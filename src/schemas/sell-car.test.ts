import { describe, expect, it } from "vitest";

import { sellCarSchema } from "./sell-car";

const validInput = {
  brand: "Demo",
  model: "One",
  year: 2025,
  mileage: 1200,
  exteriorColor: "مشکی",
  interiorColor: "کرم",
  condition: "excellent" as const,
  description: "",
  name: "کاربر نمایشی",
  phone: "09121234567",
};

describe("sellCarSchema", () => {
  it("accepts a complete seller record without media or price", () => {
    const result = sellCarSchema.parse(validInput);
    expect(result).not.toHaveProperty("price");
  });

  it("rejects an invalid phone and negative mileage", () => {
    const result = sellCarSchema.safeParse({
      ...validInput,
      phone: "123",
      mileage: -1,
    });
    expect(result.success).toBe(false);
  });
});
