import {
  DEMO_VEHICLE_SEED,
  LEGACY_PLACEHOLDER_VEHICLES,
  STALE_OFFICIAL_SEED_IDS,
  STALE_TECHNICAL_SEED_IDS,
} from "@/data/demo-vehicles";
import {
  createPersistedData,
  parseAndMigratePersistedData,
  parsePersistedJson,
  VEHICLE_STORAGE_KEY,
  VEHICLE_SYNC_CHANNEL,
  type PersistedVehicleData,
} from "@/repositories/vehicle-persistence";
import {
  VehicleRepositoryError,
  type VehicleRepository,
  type VehicleRepositorySnapshot,
} from "@/repositories/vehicle-repository";
import {
  vehicleCollectionSchema,
  vehicleCreateInputSchema,
  vehicleUpdateInputSchema,
} from "@/schemas/vehicle";
import type {
  Vehicle,
  VehicleCreateInput,
  VehicleUpdateInput,
} from "@/types/vehicle";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface BroadcastChannelLike {
  postMessage(message: unknown): void;
  close(): void;
  addEventListener(type: "message", listener: () => void): void;
  removeEventListener(type: "message", listener: () => void): void;
}

interface DemoVehicleRepositoryOptions {
  storage?: StorageLike | null;
  seed?: readonly Vehicle[];
  createId?: () => string;
  now?: () => string;
  broadcastChannel?: BroadcastChannelLike | null;
  windowTarget?: Pick<
    Window,
    "addEventListener" | "removeEventListener"
  > | null;
}

function cloneVehicles(vehicles: readonly Vehicle[]): Vehicle[] {
  return structuredClone([...vehicles]);
}

export function isLegacyPlaceholderSeed(vehicles: readonly Vehicle[]): boolean {
  return (
    vehicles.length === LEGACY_PLACEHOLDER_VEHICLES.length &&
    LEGACY_PLACEHOLDER_VEHICLES.every(({ id, slug }) =>
      vehicles.some(
        (vehicle) =>
          vehicle.id === id &&
          vehicle.slug === slug &&
          vehicle.brand === "Demo",
      ),
    )
  );
}

export function isStaleOfficialSeed(vehicles: readonly Vehicle[]): boolean {
  return (
    vehicles.length === STALE_OFFICIAL_SEED_IDS.length &&
    STALE_OFFICIAL_SEED_IDS.every((id) =>
      vehicles.some((vehicle) => vehicle.id === id),
    )
  );
}

export function isStaleTechnicalSeed(vehicles: readonly Vehicle[]): boolean {
  return (
    vehicles.length === STALE_TECHNICAL_SEED_IDS.length &&
    vehicles.every((vehicle) => !vehicle.updatedAt) &&
    STALE_TECHNICAL_SEED_IDS.every((id) =>
      vehicles.some((vehicle) => vehicle.id === id),
    ) &&
    vehicles.some(
      (vehicle) =>
        !vehicle.bodyType ||
        !vehicle.engine ||
        !vehicle.transmission ||
        !vehicle.drivetrain ||
        !vehicle.fuelType,
    )
  );
}

function shouldReplaceOfficialSeed(vehicles: readonly Vehicle[]): boolean {
  return (
    isLegacyPlaceholderSeed(vehicles) ||
    isStaleOfficialSeed(vehicles) ||
    isStaleTechnicalSeed(vehicles)
  );
}

export function slugifyVehicle(
  parts: Pick<VehicleCreateInput, "brand" | "model" | "trim" | "year">,
): string {
  const source = [parts.brand, parts.model, parts.trim, String(parts.year)]
    .filter(Boolean)
    .join("-");
  return (
    source
      .normalize("NFKD")
      .toLocaleLowerCase("en")
      .replace(/[’']/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "vehicle"
  );
}

export function createUniqueSlug(
  base: string,
  occupied: Iterable<string>,
): string {
  const slugs = new Set(occupied);
  if (!slugs.has(base)) return base;
  let suffix = 2;
  while (slugs.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

function browserStorage(): StorageLike | null {
  try {
    if (typeof window === "undefined") return null;
    const storage = window.localStorage;
    const probe = `${VEHICLE_STORAGE_KEY}:probe`;
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

export class DemoVehicleRepository implements VehicleRepository {
  private data: PersistedVehicleData;
  private readonly storage: StorageLike | null;
  private readonly listeners = new Set<() => void>();
  private readonly seed: Vehicle[];
  private readonly createId: () => string;
  private readonly now: () => string;
  private readonly channel: BroadcastChannelLike | null;
  private readonly windowTarget: DemoVehicleRepositoryOptions["windowTarget"];
  private warning?: VehicleRepositorySnapshot["warning"];

  private readonly onExternalChange = () => {
    this.reloadFromStorage();
  };

  private readonly onStorage = (event: Event) => {
    if ((event as StorageEvent).key === VEHICLE_STORAGE_KEY)
      this.reloadFromStorage();
  };

  constructor(options: DemoVehicleRepositoryOptions = {}) {
    this.seed = vehicleCollectionSchema.parse(
      cloneVehicles(options.seed ?? DEMO_VEHICLE_SEED),
    );
    this.createId = options.createId ?? (() => crypto.randomUUID());
    this.now = options.now ?? (() => new Date().toISOString());
    this.storage =
      options.storage === undefined ? browserStorage() : options.storage;
    this.windowTarget =
      options.windowTarget === undefined
        ? typeof window === "undefined"
          ? null
          : window
        : options.windowTarget;
    this.channel =
      options.broadcastChannel === undefined
        ? typeof BroadcastChannel === "undefined"
          ? null
          : new BroadcastChannel(VEHICLE_SYNC_CHANNEL)
        : options.broadcastChannel;
    this.data = createPersistedData(this.seed, 0);
    this.hydrate();
    this.channel?.addEventListener("message", this.onExternalChange);
    this.windowTarget?.addEventListener("storage", this.onStorage);
  }

  async getSnapshot(): Promise<VehicleRepositorySnapshot> {
    return this.snapshot();
  }

  async getById(id: string): Promise<Vehicle | undefined> {
    const vehicle = this.data.vehicles.find((item) => item.id === id);
    return vehicle ? structuredClone(vehicle) : undefined;
  }

  async getBySlug(slug: string): Promise<Vehicle | undefined> {
    const vehicle = this.data.vehicles.find((item) => item.slug === slug);
    return vehicle ? structuredClone(vehicle) : undefined;
  }

  async create(input: VehicleCreateInput): Promise<Vehicle> {
    try {
      const parsed = vehicleCreateInputSchema.parse(input);
      const requestedSlug = parsed.slug ?? slugifyVehicle(parsed);
      const slug = createUniqueSlug(
        requestedSlug,
        this.data.vehicles.map((vehicle) => vehicle.slug),
      );
      const vehicle: Vehicle = {
        ...parsed,
        id: this.createId(),
        slug,
        createdAt: this.now(),
      };
      const next = vehicleCollectionSchema.parse([
        ...this.data.vehicles,
        vehicle,
      ]);
      this.commit(next);
      return structuredClone(vehicle);
    } catch (error) {
      throw new VehicleRepositoryError(
        "VALIDATION_FAILED",
        "Vehicle data failed validation.",
        { cause: error },
      );
    }
  }

  async update(id: string, input: VehicleUpdateInput): Promise<Vehicle> {
    const index = this.data.vehicles.findIndex((vehicle) => vehicle.id === id);
    if (index < 0)
      throw new VehicleRepositoryError(
        "NOT_FOUND",
        `Vehicle ${id} was not found.`,
      );
    try {
      const parsed = vehicleUpdateInputSchema.parse(input);
      const current = this.data.vehicles[index];
      const merged = { ...current, ...parsed };
      const requestedSlug =
        parsed.slug ??
        (parsed.brand || parsed.model || parsed.trim || parsed.year
          ? slugifyVehicle(merged)
          : current.slug);
      const slug = createUniqueSlug(
        requestedSlug,
        this.data.vehicles
          .filter((vehicle) => vehicle.id !== id)
          .map((vehicle) => vehicle.slug),
      );
      const vehicle: Vehicle = { ...merged, slug, updatedAt: this.now() };
      const next = this.data.vehicles.slice();
      next[index] = vehicle;
      this.commit(vehicleCollectionSchema.parse(next));
      return structuredClone(vehicle);
    } catch (error) {
      throw new VehicleRepositoryError(
        "VALIDATION_FAILED",
        "Vehicle data failed validation.",
        { cause: error },
      );
    }
  }

  async delete(id: string): Promise<void> {
    if (!this.data.vehicles.some((vehicle) => vehicle.id === id)) {
      throw new VehicleRepositoryError(
        "NOT_FOUND",
        `Vehicle ${id} was not found.`,
      );
    }
    this.commit(this.data.vehicles.filter((vehicle) => vehicle.id !== id));
  }

  async reset(): Promise<VehicleRepositorySnapshot> {
    this.warning = undefined;
    this.commit(this.seed);
    return this.snapshot();
  }

  async exportJson(): Promise<string> {
    return JSON.stringify(this.data, null, 2);
  }

  async importJson(json: string): Promise<VehicleRepositorySnapshot> {
    let candidate: PersistedVehicleData;
    try {
      candidate = parsePersistedJson(json);
    } catch (error) {
      throw new VehicleRepositoryError(
        "INVALID_IMPORT",
        "Vehicle import is invalid.",
        { cause: error },
      );
    }
    // Validation completes before commit, so a failed import cannot mutate current data.
    this.commit(candidate.vehicles);
    return this.snapshot();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  dispose(): void {
    this.channel?.removeEventListener("message", this.onExternalChange);
    this.channel?.close();
    this.windowTarget?.removeEventListener("storage", this.onStorage);
    this.listeners.clear();
  }

  private hydrate(): void {
    if (!this.storage) {
      this.warning = "STORAGE_UNAVAILABLE";
      return;
    }
    try {
      const stored = this.storage.getItem(VEHICLE_STORAGE_KEY);
      if (!stored) {
        this.persist(false);
        return;
      }
      const persisted = parseAndMigratePersistedData(
        JSON.parse(stored) as unknown,
      );
      this.data = shouldReplaceOfficialSeed(persisted.vehicles)
        ? createPersistedData(this.seed, persisted.revision + 1)
        : persisted;
      this.persist(false);
    } catch {
      this.warning = "CORRUPT_STORAGE";
      this.data = createPersistedData(this.seed, 0);
      try {
        this.persist(false);
      } catch {
        this.warning = "STORAGE_UNAVAILABLE";
      }
    }
  }

  private reloadFromStorage(): void {
    if (!this.storage) return;
    try {
      const stored = this.storage.getItem(VEHICLE_STORAGE_KEY);
      if (!stored) return;
      const external = parsePersistedJson(stored);
      if (external.revision < this.data.revision) return;
      this.data = external;
      this.warning = undefined;
      this.notify();
    } catch {
      this.warning = "CORRUPT_STORAGE";
      this.notify();
    }
  }

  private commit(vehicles: readonly Vehicle[]): void {
    this.data = createPersistedData(
      cloneVehicles(vehicles),
      this.data.revision + 1,
    );
    try {
      this.persist(true);
    } catch {
      this.warning = "STORAGE_UNAVAILABLE";
    }
    this.notify();
  }

  private persist(broadcast: boolean): void {
    if (!this.storage) return;
    this.storage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(this.data));
    if (broadcast) this.channel?.postMessage({ revision: this.data.revision });
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }

  private snapshot(): VehicleRepositorySnapshot {
    return {
      vehicles: cloneVehicles(this.data.vehicles),
      persistence:
        this.storage && this.warning !== "STORAGE_UNAVAILABLE"
          ? "localStorage"
          : "memory",
      ...(this.warning ? { warning: this.warning } : {}),
    };
  }
}
