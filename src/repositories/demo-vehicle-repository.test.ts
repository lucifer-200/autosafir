import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEMO_VEHICLE_SEED } from "@/data/demo-vehicles";
import {
  createUniqueSlug,
  DemoVehicleRepository,
  slugifyVehicle,
  type StorageLike,
} from "@/repositories/demo-vehicle-repository";
import { VEHICLE_STORAGE_KEY } from "@/repositories/vehicle-persistence";
import { VehicleRepositoryError } from "@/repositories/vehicle-repository";
import type { VehicleCreateInput } from "@/types/vehicle";

class MemoryStorage implements StorageLike {
  values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

class TestChannel {
  private listeners = new Set<() => void>();
  peer?: TestChannel;
  postMessage() {
    for (const listener of this.peer?.listeners ?? []) listener();
  }
  close() {}
  addEventListener(_type: "message", listener: () => void) {
    this.listeners.add(listener);
  }
  removeEventListener(_type: "message", listener: () => void) {
    this.listeners.delete(listener);
  }
}

class TestWindowTarget {
  private listener?: EventListenerOrEventListenerObject;
  addEventListener(
    _type: string,
    listener: EventListenerOrEventListenerObject,
  ) {
    this.listener = listener;
  }
  removeEventListener() {
    this.listener = undefined;
  }
  dispatchStorage(key: string) {
    const event = new StorageEvent("storage", { key });
    if (typeof this.listener === "function") this.listener(event);
    else this.listener?.handleEvent(event);
  }
}

const input: VehicleCreateInput = {
  brand: "Demo Brand",
  model: "Model X",
  trim: "Prime",
  year: 2025,
  mileage: 10,
  features: [],
  media: [],
  status: "AVAILABLE",
};

describe("DemoVehicleRepository", () => {
  let storage: MemoryStorage;
  let idIndex: number;

  beforeEach(() => {
    storage = new MemoryStorage();
    idIndex = 10;
  });

  const makeRepository = () =>
    new DemoVehicleRepository({
      storage,
      broadcastChannel: null,
      windowTarget: null,
      createId: () =>
        `20000000-0000-4000-8000-${String(idIndex++).padStart(12, "0")}`,
      now: () => "2026-02-01T00:00:00.000Z",
    });

  it("hydrates seed on first visit and persists CRUD across instances", async () => {
    const first = makeRepository();
    expect((await first.getSnapshot()).vehicles).toHaveLength(
      DEMO_VEHICLE_SEED.length,
    );
    const created = await first.create(input);
    expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
    first.dispose();

    const second = makeRepository();
    expect(await second.getById(created.id)).toEqual(created);
    await second.update(created.id, { status: "SOLD" });
    expect((await second.getById(created.id))?.status).toBe("SOLD");
    await second.delete(created.id);
    expect(await second.getById(created.id)).toBeUndefined();
  });

  it("generates normalized slugs and deterministic unique suffixes", async () => {
    expect(slugifyVehicle(input)).toBe("demo-brand-model-x-prime-2025");
    expect(createUniqueSlug("car", ["car", "car-2", "car-4"])).toBe("car-3");
    const repository = makeRepository();
    const one = await repository.create(input);
    const two = await repository.create(input);
    expect(two.slug).toBe(`${one.slug}-2`);
  });

  it("exports, resets and imports validated data", async () => {
    const repository = makeRepository();
    await repository.create(input);
    const exported = await repository.exportJson();
    await repository.reset();
    expect((await repository.getSnapshot()).vehicles).toHaveLength(
      DEMO_VEHICLE_SEED.length,
    );
    await repository.importJson(exported);
    expect((await repository.getSnapshot()).vehicles).toHaveLength(
      DEMO_VEHICLE_SEED.length + 1,
    );
  });

  it("rejects invalid imports atomically", async () => {
    const repository = makeRepository();
    const before = await repository.exportJson();
    await expect(
      repository.importJson(
        '{"version":1,"revision":0,"vehicles":[{"price":10}]}',
      ),
    ).rejects.toBeInstanceOf(VehicleRepositoryError);
    expect(await repository.exportJson()).toBe(before);
  });

  it("exposes a stable validation error without mutating stored data", async () => {
    const repository = makeRepository();
    const before = await repository.exportJson();

    await expect(
      repository.create({ ...input, status: "PENDING" as "AVAILABLE" }),
    ).rejects.toMatchObject({ issue: "VALIDATION_FAILED" });

    expect(await repository.exportJson()).toBe(before);
  });

  it("recovers from corrupt storage and reports it", async () => {
    storage.setItem(VEHICLE_STORAGE_KEY, "not json");
    const repository = makeRepository();
    const snapshot = await repository.getSnapshot();
    expect(snapshot.warning).toBe("CORRUPT_STORAGE");
    expect(snapshot.vehicles).toHaveLength(DEMO_VEHICLE_SEED.length);
    expect(() =>
      JSON.parse(storage.getItem(VEHICLE_STORAGE_KEY) ?? ""),
    ).not.toThrow();
  });

  it("continues in memory when storage is unavailable", async () => {
    const unavailable: StorageLike = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    const repository = new DemoVehicleRepository({
      storage: unavailable,
      broadcastChannel: null,
      windowTarget: null,
    });
    expect((await repository.getSnapshot()).warning).toBe(
      "STORAGE_UNAVAILABLE",
    );
    await expect(repository.create(input)).resolves.toBeDefined();
  });

  it("notifies subscribers after mutations", async () => {
    const repository = makeRepository();
    const listener = vi.fn();
    repository.subscribe(listener);
    await repository.create(input);
    expect(listener).toHaveBeenCalledOnce();
  });

  it("reloads persisted state after a BroadcastChannel signal", async () => {
    const firstChannel = new TestChannel();
    const secondChannel = new TestChannel();
    firstChannel.peer = secondChannel;
    secondChannel.peer = firstChannel;
    const first = new DemoVehicleRepository({
      storage,
      broadcastChannel: firstChannel,
      windowTarget: null,
    });
    const second = new DemoVehicleRepository({
      storage,
      broadcastChannel: secondChannel,
      windowTarget: null,
    });
    const listener = vi.fn();
    second.subscribe(listener);

    const created = await first.create(input);

    expect(await second.getById(created.id)).toBeDefined();
    expect(listener).toHaveBeenCalledOnce();
  });

  it("uses the storage event when BroadcastChannel is unavailable", async () => {
    const windowTarget = new TestWindowTarget();
    const listening = new DemoVehicleRepository({
      storage,
      broadcastChannel: null,
      windowTarget,
    });
    const writer = new DemoVehicleRepository({
      storage,
      broadcastChannel: null,
      windowTarget: null,
    });
    const created = await writer.create(input);

    windowTarget.dispatchStorage(VEHICLE_STORAGE_KEY);

    expect(await listening.getById(created.id)).toBeDefined();
  });
});
