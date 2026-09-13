import { VEHICLE_STATUS_LABELS } from "@/features/vehicles/status";
import type { Vehicle } from "@/types/vehicle";

export interface CompareField {
  key: string;
  label: string;
  value(vehicle: Vehicle): string;
}

const empty = "ثبت نشده";
const faNumber = new Intl.NumberFormat("fa-IR");

export const COMPARE_FIELDS: readonly CompareField[] = [
  {
    key: "model",
    label: "مدل و تیپ",
    value: (v) => [v.model, v.trim].filter(Boolean).join(" · "),
  },
  { key: "year", label: "سال", value: (v) => faNumber.format(v.year) },
  {
    key: "mileage",
    label: "کارکرد",
    value: (v) =>
      v.mileage === 0 ? "صفر کیلومتر" : `${faNumber.format(v.mileage)} کیلومتر`,
  },
  { key: "engine", label: "پیشرانه", value: (v) => v.engine || empty },
  {
    key: "horsepower",
    label: "قدرت",
    value: (v) =>
      v.horsepower ? `${faNumber.format(v.horsepower)} اسب بخار` : empty,
  },
  {
    key: "transmission",
    label: "گیربکس",
    value: (v) => v.transmission || empty,
  },
  {
    key: "drivetrain",
    label: "محور محرک",
    value: (v) => v.drivetrain || empty,
  },
  { key: "fuel", label: "سوخت", value: (v) => v.fuelType || empty },
  { key: "body", label: "کلاس بدنه", value: (v) => v.bodyType || empty },
  {
    key: "exterior",
    label: "رنگ بدنه",
    value: (v) => v.exteriorColor || empty,
  },
  {
    key: "interior",
    label: "رنگ کابین",
    value: (v) => v.interiorColor || empty,
  },
  { key: "condition", label: "شرایط", value: (v) => v.condition || empty },
  {
    key: "features",
    label: "امکانات",
    value: (v) => (v.features.length ? v.features.join("، ") : empty),
  },
  {
    key: "status",
    label: "وضعیت",
    value: (v) => VEHICLE_STATUS_LABELS[v.status],
  },
];

export function fieldHasDifferences(
  field: CompareField,
  vehicles: readonly Vehicle[],
): boolean {
  return (
    vehicles.length > 1 &&
    new Set(vehicles.map((vehicle) => field.value(vehicle))).size > 1
  );
}
