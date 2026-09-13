import { describe, expect, it } from "vitest";

import { vehicleCollectionSchema, vehicleSchema } from "@/schemas/vehicle";

const vehicle = {
  id: "20000000-0000-4000-8000-000000000001",
  slug: "demo-car-2024",
  brand: "Demo",
  model: "Car",
  year: 2024,
  mileage: 0,
  features: [],
  media: [],
  status: "AVAILABLE" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("vehicle schema", () => {
  it("accepts the documented model and has no price", () => {
    expect(vehicleSchema.parse(vehicle)).toEqual(vehicle);
    expect(vehicleSchema.safeParse({ ...vehicle, price: 1 }).success).toBe(
      false,
    );
  });

  it("rejects invalid status, binary media and duplicate ids/slugs", () => {
    expect(
      vehicleSchema.safeParse({ ...vehicle, status: "PENDING" }).success,
    ).toBe(false);
    expect(
      vehicleSchema.safeParse({
        ...vehicle,
        media: [
          {
            id: crypto.randomUUID(),
            type: "IMAGE",
            src: "data:image/png;base64,abc",
          },
        ],
      }).success,
    ).toBe(false);
    expect(vehicleCollectionSchema.safeParse([vehicle, vehicle]).success).toBe(
      false,
    );
  });
});
