import type { Vehicle } from "@/types/vehicle";

// Intentionally fictional placeholders for exercising the demo data layer.
// Approved AutoSafir inventory and media must replace these in Phase 11.
export const DEMO_VEHICLE_SEED: readonly Vehicle[] = Object.freeze([
  {
    id: "10000000-0000-4000-8000-000000000001",
    slug: "demo-aurora-one-2024",
    brand: "Demo",
    model: "Aurora",
    trim: "One",
    year: 2024,
    mileage: 0,
    features: [],
    description:
      "رکورد نمایشی برای آزمون زیرساخت؛ این خودرو موجودی واقعی اتو سفیر نیست.",
    media: [],
    status: "AVAILABLE",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    slug: "demo-atelier-two-2023",
    brand: "Demo",
    model: "Atelier",
    trim: "Two",
    year: 2023,
    mileage: 0,
    features: [],
    description:
      "رکورد نمایشی برای آزمون وضعیت؛ بدون ادعای ارتباط با موجودی واقعی.",
    media: [],
    status: "RESERVED",
    createdAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    slug: "demo-studio-three-2022",
    brand: "Demo",
    model: "Studio",
    trim: "Three",
    year: 2022,
    mileage: 0,
    features: [],
    description: "رکورد نمایشی فروخته‌شده برای آزمون؛ فاقد مشخصات واقعی خودرو.",
    media: [],
    status: "SOLD",
    createdAt: "2026-01-03T00:00:00.000Z",
  },
]);
