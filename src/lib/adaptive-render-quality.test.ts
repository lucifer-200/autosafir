import { describe, expect, it } from "vitest";

import { selectAdaptiveRenderTier } from "./adaptive-render-quality";

const capableDevice = {
  reducedMotion: false,
  saveData: false,
  webgl: true,
  deviceMemory: 8,
  hardwareConcurrency: 8,
};

describe("selectAdaptiveRenderTier", () => {
  it("uses WebGL only for capable devices", () => {
    expect(selectAdaptiveRenderTier(capableDevice)).toBe("webgl");
  });

  it.each([
    { reducedMotion: true },
    { saveData: true },
    { deviceMemory: 2 },
    { hardwareConcurrency: 2 },
  ])("uses a static image for constrained hints: %o", (override) => {
    expect(selectAdaptiveRenderTier({ ...capableDevice, ...override })).toBe(
      "static",
    );
  });

  it.each([{ webgl: false }, { deviceMemory: 4 }, { hardwareConcurrency: 4 }])(
    "uses cinematic image motion for the middle tier: %o",
    (override) => {
      expect(selectAdaptiveRenderTier({ ...capableDevice, ...override })).toBe(
        "cinematic",
      );
    },
  );
});
