import { describe, expect, it } from "vitest";

import { DEMO_VEHICLE_SEED } from "@/data/demo-vehicles";
import {
  parseAndMigratePersistedData,
  VEHICLE_SCHEMA_VERSION,
} from "@/repositories/vehicle-persistence";

describe("vehicle persistence migration", () => {
  it("migrates a legacy array", () => {
    const migrated = parseAndMigratePersistedData(DEMO_VEHICLE_SEED);
    expect(migrated.version).toBe(VEHICLE_SCHEMA_VERSION);
    expect(migrated.revision).toBe(0);
  });

  it("migrates the version zero envelope and rejects future versions", () => {
    expect(
      parseAndMigratePersistedData({ version: 0, vehicles: DEMO_VEHICLE_SEED })
        .version,
    ).toBe(1);
    expect(() =>
      parseAndMigratePersistedData({ version: 99, revision: 0, vehicles: [] }),
    ).toThrow();
  });
});
