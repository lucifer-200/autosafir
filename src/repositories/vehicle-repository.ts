import type {
  Vehicle,
  VehicleCreateInput,
  VehicleUpdateInput,
} from "@/types/vehicle";

export type VehicleRepositoryIssue =
  | "CORRUPT_STORAGE"
  | "INVALID_IMPORT"
  | "NOT_FOUND"
  | "STORAGE_UNAVAILABLE"
  | "VALIDATION_FAILED";

export class VehicleRepositoryError extends Error {
  constructor(
    public readonly issue: VehicleRepositoryIssue,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "VehicleRepositoryError";
  }
}

export interface VehicleRepositorySnapshot {
  vehicles: Vehicle[];
  persistence: "localStorage" | "memory";
  warning?: VehicleRepositoryIssue;
}

export interface VehicleRepository {
  getSnapshot(): Promise<VehicleRepositorySnapshot>;
  getById(id: string): Promise<Vehicle | undefined>;
  getBySlug(slug: string): Promise<Vehicle | undefined>;
  create(input: VehicleCreateInput): Promise<Vehicle>;
  update(id: string, input: VehicleUpdateInput): Promise<Vehicle>;
  delete(id: string): Promise<void>;
  reset(): Promise<VehicleRepositorySnapshot>;
  exportJson(): Promise<string>;
  importJson(json: string): Promise<VehicleRepositorySnapshot>;
  subscribe(listener: () => void): () => void;
  dispose(): void;
}
