import { describe, expect, it } from "vitest";

import { createBookingSchema } from "./booking";

const base = {
  vehicle: "demo-one",
  name: "کاربر نمایشی",
  phone: "09121234567",
  branch: "beheshti",
  date: "2026-09-10",
  time: "12:30",
  note: "",
};

describe("createBookingSchema", () => {
  it("accepts today and future dates", () => {
    expect(createBookingSchema("2026-09-10").safeParse(base).success).toBe(
      true,
    );
  });

  it("rejects a past date", () => {
    const result = createBookingSchema("2026-09-11").safeParse(base);
    expect(result.success).toBe(false);
  });

  it("rejects impossible calendar dates and times", () => {
    const schema = createBookingSchema("2026-09-10");

    expect(schema.safeParse({ ...base, date: "2026-02-31" }).success).toBe(
      false,
    );
    expect(schema.safeParse({ ...base, time: "25:90" }).success).toBe(false);
  });

  it("accepts only a centralized showroom branch", () => {
    const result = createBookingSchema("2026-09-10").safeParse({
      ...base,
      branch: "unlisted-branch",
    });

    expect(result.success).toBe(false);
  });
});
