import { describe, expect, it } from "vitest";

import {
  getVehiclePrimaryAction,
  isVehicleBookable,
  isVehiclePubliclyVisible,
} from "@/features/vehicles/status";

describe("vehicle status policy", () => {
  it("keeps every status public", () => {
    expect(
      ["AVAILABLE", "RESERVED", "SOLD"].every((status) =>
        isVehiclePubliclyVisible(status as "AVAILABLE" | "RESERVED" | "SOLD"),
      ),
    ).toBe(true);
  });

  it("only books available vehicles and maps reserved/sold CTAs", () => {
    expect(isVehicleBookable("AVAILABLE")).toBe(true);
    expect(isVehicleBookable("RESERVED")).toBe(false);
    expect(isVehicleBookable("SOLD")).toBe(false);
    expect(getVehiclePrimaryAction("RESERVED")).toBe("CONTACT_ADVISOR");
    expect(getVehiclePrimaryAction("SOLD")).toBe("VIEW_SIMILAR");
  });
});
