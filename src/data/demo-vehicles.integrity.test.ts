import { describe, expect, it } from "vitest";

import { vehicleCollectionSchema } from "@/schemas/vehicle";

import { DEMO_VEHICLE_SEED } from "./demo-vehicles";

describe("real AutoSafir seed", () => {
  it("contains only schema-valid, source-linked records without prices", () => {
    expect(() =>
      vehicleCollectionSchema.parse(DEMO_VEHICLE_SEED),
    ).not.toThrow();
    expect(DEMO_VEHICLE_SEED).toHaveLength(6);
    expect(
      DEMO_VEHICLE_SEED.every(
        (vehicle) =>
          vehicle.brand !== "Demo" &&
          vehicle.instagramUrl?.startsWith(
            "https://www.instagram.com/autosafirgallery/",
          ),
      ),
    ).toBe(true);
    expect(JSON.stringify(DEMO_VEHICLE_SEED)).not.toMatch(/"price"|قیمت/i);
  });

  it("does not fabricate live reserved or sold states", () => {
    expect(new Set(DEMO_VEHICLE_SEED.map((vehicle) => vehicle.status))).toEqual(
      new Set(["AVAILABLE"]),
    );
  });
});
