import { describe, expect, it } from "vitest";

import { DemoLeadService } from "./lead-service";

describe("DemoLeadService", () => {
  it("returns an explicitly undelivered receipt", async () => {
    const service = new DemoLeadService();
    const receipt = await service.submitBooking({
      vehicle: "demo-one",
      name: "کاربر نمایشی",
      phone: "09121234567",
      branch: "beheshti",
      date: "2026-09-10",
      time: "12:30",
      note: "",
    });

    expect(receipt.delivered).toBe(false);
    expect(receipt.id).toMatch(/^visit-/);
  });
});
