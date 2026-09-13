import { describe, expect, it } from "vitest";

import { DemoVehicleRepository } from "@/repositories/demo-vehicle-repository";
import { createVehicleStore } from "@/stores/vehicle-store";

describe("vehicle store", () => {
  it("hydrates and delegates mutations through the repository", async () => {
    const repository = new DemoVehicleRepository({
      storage: null,
      broadcastChannel: null,
      windowTarget: null,
    });
    const store = createVehicleStore(repository);
    await store.getState().hydrate();
    expect(store.getState().hydrated).toBe(true);
    expect(store.getState().persistence).toBe("memory");

    await store.getState().createVehicle({
      brand: "Demo",
      model: "Store",
      year: 2025,
      mileage: 0,
      features: [],
      media: [],
      status: "AVAILABLE",
    });
    expect(
      store.getState().vehicles.some((vehicle) => vehicle.model === "Store"),
    ).toBe(true);
    store.getState().dispose();
  });
});
