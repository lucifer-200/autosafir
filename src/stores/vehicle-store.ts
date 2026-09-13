"use client";

import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";

import { DemoVehicleRepository } from "@/repositories/demo-vehicle-repository";
import type {
  VehicleRepository,
  VehicleRepositoryIssue,
} from "@/repositories/vehicle-repository";
import type {
  Vehicle,
  VehicleCreateInput,
  VehicleUpdateInput,
} from "@/types/vehicle";

export interface VehicleStoreState {
  vehicles: Vehicle[];
  hydrated: boolean;
  pending: boolean;
  persistence: "localStorage" | "memory";
  warning?: VehicleRepositoryIssue;
  error?: string;
  hydrate(): Promise<void>;
  createVehicle(input: VehicleCreateInput): Promise<Vehicle>;
  updateVehicle(id: string, input: VehicleUpdateInput): Promise<Vehicle>;
  deleteVehicle(id: string): Promise<void>;
  resetVehicles(): Promise<void>;
  exportVehicles(): Promise<string>;
  importVehicles(json: string): Promise<void>;
  dispose(): void;
}

export function createVehicleStore(
  repository: VehicleRepository,
): StoreApi<VehicleStoreState> {
  let unsubscribe: (() => void) | undefined;

  const store = createStore<VehicleStoreState>((set) => {
    const refresh = async () => {
      const snapshot = await repository.getSnapshot();
      set({ ...snapshot, hydrated: true, pending: false, error: undefined });
    };

    const execute = async <T>(operation: () => Promise<T>): Promise<T> => {
      set({ pending: true, error: undefined });
      try {
        const result = await operation();
        await refresh();
        return result;
      } catch (error) {
        set({
          pending: false,
          error: error instanceof Error ? error.message : "Unknown data error",
        });
        throw error;
      }
    };

    return {
      vehicles: [],
      hydrated: false,
      pending: false,
      persistence: "memory",
      hydrate: async () => {
        if (!unsubscribe)
          unsubscribe = repository.subscribe(() => void refresh());
        await refresh();
      },
      createVehicle: (input) => execute(() => repository.create(input)),
      updateVehicle: (id, input) => execute(() => repository.update(id, input)),
      deleteVehicle: (id) => execute(() => repository.delete(id)),
      resetVehicles: () =>
        execute(async () => {
          await repository.reset();
        }),
      exportVehicles: () => repository.exportJson(),
      importVehicles: (json) =>
        execute(async () => {
          await repository.importJson(json);
        }),
      dispose: () => {
        unsubscribe?.();
        unsubscribe = undefined;
        repository.dispose();
        set({ hydrated: false });
      },
    };
  });

  return store;
}

let browserStore: StoreApi<VehicleStoreState> | undefined;

export function getVehicleStore(): StoreApi<VehicleStoreState> {
  browserStore ??= createVehicleStore(new DemoVehicleRepository());
  return browserStore;
}

export function useVehicleStore<T>(
  selector: (state: VehicleStoreState) => T,
): T {
  return useStore(getVehicleStore(), selector);
}
