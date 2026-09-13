import { z } from "zod";

import { vehicleCollectionSchema } from "@/schemas/vehicle";
import type { Vehicle } from "@/types/vehicle";

export const VEHICLE_STORAGE_KEY = "autosafir:vehicles";
export const VEHICLE_SCHEMA_VERSION = 1;
export const VEHICLE_SYNC_CHANNEL = "autosafir:vehicles:sync";

export const persistedVehicleDataSchema = z
  .object({
    version: z.literal(VEHICLE_SCHEMA_VERSION),
    revision: z.number().int().nonnegative(),
    vehicles: vehicleCollectionSchema,
  })
  .strict();

export interface PersistedVehicleData {
  version: typeof VEHICLE_SCHEMA_VERSION;
  revision: number;
  vehicles: Vehicle[];
}

const legacyEnvelopeSchema = z
  .object({
    version: z.literal(0),
    vehicles: vehicleCollectionSchema,
  })
  .passthrough();

export function parseAndMigratePersistedData(
  value: unknown,
): PersistedVehicleData {
  const current = persistedVehicleDataSchema.safeParse(value);
  if (current.success) return current.data;

  const legacyEnvelope = legacyEnvelopeSchema.safeParse(value);
  if (legacyEnvelope.success) {
    return {
      version: VEHICLE_SCHEMA_VERSION,
      revision: 0,
      vehicles: legacyEnvelope.data.vehicles,
    };
  }

  const legacyArray = vehicleCollectionSchema.safeParse(value);
  if (legacyArray.success) {
    return {
      version: VEHICLE_SCHEMA_VERSION,
      revision: 0,
      vehicles: legacyArray.data,
    };
  }

  throw new Error("Unsupported or invalid persisted vehicle data.");
}

export function parsePersistedJson(json: string): PersistedVehicleData {
  return parseAndMigratePersistedData(JSON.parse(json) as unknown);
}

export function createPersistedData(
  vehicles: Vehicle[],
  revision: number,
): PersistedVehicleData {
  return persistedVehicleDataSchema.parse({
    version: VEHICLE_SCHEMA_VERSION,
    revision,
    vehicles,
  });
}
