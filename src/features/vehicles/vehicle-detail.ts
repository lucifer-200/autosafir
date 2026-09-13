import type { Vehicle } from "@/types/vehicle";

export function findVehicleBySlug(
  vehicles: readonly Vehicle[],
  slug: string,
): Vehicle | undefined {
  const normalized = slug.trim();
  if (!normalized) return undefined;
  return vehicles.find((vehicle) => vehicle.slug === normalized);
}

export function getRelatedVehicles(
  vehicle: Vehicle,
  vehicles: readonly Vehicle[],
  limit = 3,
): Vehicle[] {
  return vehicles
    .filter((candidate) => candidate.id !== vehicle.id)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.status === "AVAILABLE" ? 4 : 0) +
        (candidate.brand === vehicle.brand ? 3 : 0) +
        (Boolean(vehicle.bodyType) && candidate.bodyType === vehicle.bodyType
          ? 2
          : 0) +
        (candidate.status === vehicle.status ? 1 : 0),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.candidate.createdAt.localeCompare(a.candidate.createdAt),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function formatVehicleMileage(mileage: number): string {
  if (mileage === 0) return "صفر کیلومتر";
  return `${new Intl.NumberFormat("fa-IR").format(mileage)} کیلومتر`;
}

export function getVehicleDisplayName(vehicle: Vehicle): string {
  return [vehicle.brand, vehicle.model, vehicle.trim].filter(Boolean).join(" ");
}
