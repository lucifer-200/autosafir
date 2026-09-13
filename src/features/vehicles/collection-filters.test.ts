import { describe, expect, it } from "vitest";

import { DEMO_VEHICLE_SEED } from "@/data/demo-vehicles";

import {
  countActiveFilters,
  EMPTY_COLLECTION_FILTERS,
  filterVehicles,
  getFacetOptions,
} from "./collection-filters";

describe("collection filters", () => {
  it("searches brand, model, and trim without hiding sold vehicles by default", () => {
    expect(
      filterVehicles(DEMO_VEHICLE_SEED, EMPTY_COLLECTION_FILTERS),
    ).toHaveLength(3);
    expect(
      filterVehicles(DEMO_VEHICLE_SEED, {
        ...EMPTY_COLLECTION_FILTERS,
        search: "studio",
      }).map((vehicle) => vehicle.status),
    ).toEqual(["SOLD"]);
  });

  it("supports quick statuses and the distinct reserved status", () => {
    expect(
      filterVehicles(DEMO_VEHICLE_SEED, {
        ...EMPTY_COLLECTION_FILTERS,
        quickStatus: "AVAILABLE",
      }).map((vehicle) => vehicle.status),
    ).toEqual(["AVAILABLE"]);

    expect(
      filterVehicles(DEMO_VEHICLE_SEED, {
        ...EMPTY_COLLECTION_FILTERS,
        status: "RESERVED",
      }).map((vehicle) => vehicle.status),
    ).toEqual(["RESERVED"]);
  });

  it("filters exact facets and mileage ranges", () => {
    expect(
      filterVehicles(DEMO_VEHICLE_SEED, {
        ...EMPTY_COLLECTION_FILTERS,
        year: "2024",
        mileage: "ZERO",
      }).map((vehicle) => vehicle.model),
    ).toEqual(["Aurora"]);
  });

  it("returns sorted unique facet options and a semantic active count", () => {
    expect(getFacetOptions(DEMO_VEHICLE_SEED, "year")).toEqual([
      "2024",
      "2023",
      "2022",
    ]);
    expect(
      countActiveFilters({
        ...EMPTY_COLLECTION_FILTERS,
        search: "demo",
        quickStatus: "SOLD",
        year: "2022",
      }),
    ).toBe(3);
  });
});
