import { describe, expect, it, vi } from "vitest";

import { DemoPublishingProvider } from "./publishing-provider";

describe("DemoPublishingProvider", () => {
  it("reports the complete simulated flow without external writes", async () => {
    const listener = vi.fn();
    await new DemoPublishingProvider().simulate(listener, { delayMs: 0 });
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({ step: "COMPLETE", state: "COMPLETE" }),
    );
  });

  it("can simulate a deterministic provider failure", async () => {
    const listener = vi.fn();
    await expect(
      new DemoPublishingProvider().simulate(listener, {
        delayMs: 0,
        failAt: "BAMA",
      }),
    ).rejects.toThrow("DEMO_PUBLISHING_FAILURE");
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({ step: "BAMA", state: "FAILED" }),
    );
  });
});
