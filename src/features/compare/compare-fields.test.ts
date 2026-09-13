import { describe, expect, it } from "vitest";

import { DEMO_VEHICLE_SEED } from "@/data/demo-vehicles";

import { COMPARE_FIELDS, fieldHasDifferences } from "./compare-fields";

describe("compare fields", () => {
  it("covers the complete public comparison set", () => {
    expect(COMPARE_FIELDS.map((field) => field.key)).toEqual([
      "model",
      "year",
      "mileage",
      "engine",
      "horsepower",
      "transmission",
      "drivetrain",
      "fuel",
      "body",
      "exterior",
      "interior",
      "condition",
      "features",
      "status",
    ]);
  });

  it("detects differences without treating a single value as different", () => {
    const year = COMPARE_FIELDS.find((field) => field.key === "year")!;
    expect(fieldHasDifferences(year, [DEMO_VEHICLE_SEED[0]])).toBe(false);
    expect(fieldHasDifferences(year, DEMO_VEHICLE_SEED.slice(0, 2))).toBe(true);
  });
});
