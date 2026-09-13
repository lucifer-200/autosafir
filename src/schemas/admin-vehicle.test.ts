import { describe, expect, it } from "vitest";

import { adminVehicleFormSchema } from "./admin-vehicle";

const valid = {
  slug: "demo-admin-car-2026",
  brand: "Demo",
  model: "Admin",
  trim: "Car",
  year: "2026",
  mileage: "12",
  exteriorColor: "",
  interiorColor: "",
  bodyType: "",
  engine: "",
  horsepower: "",
  transmission: "",
  drivetrain: "",
  fuelType: "",
  condition: "",
  plateType: "",
  featuresText: "feature one\nfeature two",
  description: "",
  mediaText: "/images/cars/demo.webp\nhttps://example.com/demo.mp4",
  status: "AVAILABLE",
  advisorName: "",
  advisorPhone: "",
  instagramUrl: "",
};

describe("adminVehicleFormSchema", () => {
  it("accepts the strings emitted by the admin form", () => {
    expect(adminVehicleFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects malformed slugs and unsafe media sources", () => {
    expect(
      adminVehicleFormSchema.safeParse({
        ...valid,
        slug: "bad slug",
        mediaText: "javascript:alert(1)",
      }).success,
    ).toBe(false);
  });
});
