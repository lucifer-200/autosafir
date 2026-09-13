import { describe, expect, it } from "vitest";

import { DEMO_VEHICLE_SEED } from "@/data/demo-vehicles";
import {
  findVehicleBySlug,
  formatVehicleMileage,
  getRelatedVehicles,
  getVehicleDisplayName,
} from "@/features/vehicles/vehicle-detail";
import type { Vehicle } from "@/types/vehicle";

describe("vehicle detail helpers", () => {
  it("finds a persisted vehicle by exact slug", () => {
    expect(
      findVehicleBySlug(DEMO_VEHICLE_SEED, "demo-aurora-one-2024")?.model,
    ).toBe("Aurora");
    expect(findVehicleBySlug(DEMO_VEHICLE_SEED, " ")).toBeUndefined();
  });

  it("prioritizes related available cars sharing brand and body", () => {
    const current: Vehicle = {
      ...DEMO_VEHICLE_SEED[0],
      bodyType: "Sedan",
    };
    const sameBody: Vehicle = {
      ...DEMO_VEHICLE_SEED[1],
      id: "related-one",
      slug: "related-one",
      bodyType: "Sedan",
      status: "AVAILABLE",
    };
    const unrelated: Vehicle = {
      ...DEMO_VEHICLE_SEED[2],
      id: "related-two",
      slug: "related-two",
      brand: "Other",
      bodyType: "SUV",
    };

    expect(
      getRelatedVehicles(current, [current, unrelated, sameBody], 1),
    ).toEqual([sameBody]);
  });

  it("formats public labels without a price concept", () => {
    expect(formatVehicleMileage(0)).toBe("صفر کیلومتر");
    expect(formatVehicleMileage(12000)).toContain("کیلومتر");
    expect(getVehicleDisplayName(DEMO_VEHICLE_SEED[0])).toBe("Demo Aurora One");
  });
});
