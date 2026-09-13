import type { Vehicle, VehicleStatus } from "@/types/vehicle";

export type VehicleFacetKey =
  | "status"
  | "brand"
  | "model"
  | "year"
  | "bodyType"
  | "mileage"
  | "fuelType"
  | "transmission"
  | "condition"
  | "plateType";

export type QuickStatus = "ALL" | Exclude<VehicleStatus, "RESERVED">;

export interface CollectionFilters {
  search: string;
  quickStatus: QuickStatus;
  status: "ALL" | VehicleStatus;
  brand: string;
  model: string;
  year: string;
  bodyType: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  condition: string;
  plateType: string;
}

export const EMPTY_COLLECTION_FILTERS: CollectionFilters = {
  search: "",
  quickStatus: "ALL",
  status: "ALL",
  brand: "",
  model: "",
  year: "",
  bodyType: "",
  mileage: "",
  fuelType: "",
  transmission: "",
  condition: "",
  plateType: "",
};

export const MILEAGE_RANGES = [
  { value: "ZERO", label: "صفر کیلومتر", min: 0, max: 0 },
  { value: "UNDER_50K", label: "تا ۵۰ هزار", min: 0, max: 50_000 },
  { value: "50K_100K", label: "۵۰ تا ۱۰۰ هزار", min: 50_001, max: 100_000 },
  { value: "OVER_100K", label: "بیش از ۱۰۰ هزار", min: 100_001, max: Infinity },
] as const;

function normalize(value: string | undefined) {
  return (value ?? "").trim().toLocaleLowerCase("fa");
}

export function filterVehicles(
  vehicles: readonly Vehicle[],
  filters: CollectionFilters,
): Vehicle[] {
  const query = normalize(filters.search);
  const mileageRange = MILEAGE_RANGES.find(
    (range) => range.value === filters.mileage,
  );

  return vehicles.filter((vehicle) => {
    const searchable = normalize(
      [vehicle.brand, vehicle.model, vehicle.trim].filter(Boolean).join(" "),
    );
    const effectiveStatus =
      filters.quickStatus !== "ALL" ? filters.quickStatus : filters.status;

    return (
      (!query || searchable.includes(query)) &&
      (effectiveStatus === "ALL" || vehicle.status === effectiveStatus) &&
      (!filters.brand || vehicle.brand === filters.brand) &&
      (!filters.model || vehicle.model === filters.model) &&
      (!filters.year || String(vehicle.year) === filters.year) &&
      (!filters.bodyType || vehicle.bodyType === filters.bodyType) &&
      (!mileageRange ||
        (vehicle.mileage >= mileageRange.min &&
          vehicle.mileage <= mileageRange.max)) &&
      (!filters.fuelType || vehicle.fuelType === filters.fuelType) &&
      (!filters.transmission ||
        vehicle.transmission === filters.transmission) &&
      (!filters.condition || vehicle.condition === filters.condition) &&
      (!filters.plateType || vehicle.plateType === filters.plateType)
    );
  });
}

export function countActiveFilters(filters: CollectionFilters): number {
  return (
    Number(Boolean(filters.search.trim())) +
    Number(filters.quickStatus !== "ALL" || filters.status !== "ALL") +
    Number(Boolean(filters.brand)) +
    Number(Boolean(filters.model)) +
    Number(Boolean(filters.year)) +
    Number(Boolean(filters.bodyType)) +
    Number(Boolean(filters.mileage)) +
    Number(Boolean(filters.fuelType)) +
    Number(Boolean(filters.transmission)) +
    Number(Boolean(filters.condition)) +
    Number(Boolean(filters.plateType))
  );
}

export function getFacetOptions(
  vehicles: readonly Vehicle[],
  key: Exclude<VehicleFacetKey, "status" | "mileage">,
): string[] {
  const values = vehicles.flatMap((vehicle) => {
    const value = key === "year" ? String(vehicle.year) : vehicle[key];
    return value ? [String(value)] : [];
  });

  return [...new Set(values)].sort((a, b) =>
    key === "year"
      ? Number(b) - Number(a)
      : a.localeCompare(b, "fa", { sensitivity: "base" }),
  );
}
