import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { vehicleCollectionSchema } from "@/schemas/vehicle";

import { DEMO_VEHICLE_SEED } from "./demo-vehicles";

describe("real AutoSafir seed", () => {
  it("contains schema-valid, source-linked records with local photos and no prices", () => {
    expect(() =>
      vehicleCollectionSchema.parse(DEMO_VEHICLE_SEED),
    ).not.toThrow();
    expect(DEMO_VEHICLE_SEED.length).toBeGreaterThanOrEqual(12);
    expect(DEMO_VEHICLE_SEED.length).toBeLessThanOrEqual(30);
    expect(
      DEMO_VEHICLE_SEED.every(
        (vehicle) =>
          vehicle.brand !== "Demo" &&
          vehicle.instagramUrl?.startsWith(
            "https://www.instagram.com/autosafirgallery/",
          ) &&
          vehicle.media.some(
            (item) => item.type === "IMAGE" && item.src.startsWith("/cars/"),
          ),
      ),
    ).toBe(true);
    expect(JSON.stringify(DEMO_VEHICLE_SEED)).not.toMatch(/"price"|قیمت/i);

    for (const vehicle of DEMO_VEHICLE_SEED) {
      for (const item of vehicle.media) {
        if (!item.src.startsWith("/cars/")) continue;
        expect(
          existsSync(path.join(process.cwd(), "public", item.src)),
        ).toBe(true);
      }
    }
  });

  it("keeps the original six public slugs and does not invent reserved cars", () => {
    const slugs = DEMO_VEHICLE_SEED.map((vehicle) => vehicle.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "volkswagen-tiguan-2018",
        "bmw-428-convertible-2015",
        "toyota-rav4-hybrid-2026",
        "toyota-land-cruiser-70-2026",
        "mitsubishi-pajero-2022",
        "toyota-land-cruiser-300-vxr-2024",
      ]),
    );
    expect(DEMO_VEHICLE_SEED.some((vehicle) => vehicle.status === "RESERVED")).toBe(
      false,
    );
    expect(
      DEMO_VEHICLE_SEED.every(
        (vehicle) =>
          vehicle.status === "AVAILABLE" || vehicle.status === "SOLD",
      ),
    ).toBe(true);
  });
});
