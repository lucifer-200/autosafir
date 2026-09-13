export type AdaptiveRenderTier = "webgl" | "cinematic" | "static";

export interface AdaptiveRenderHints {
  reducedMotion: boolean;
  saveData: boolean;
  webgl: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export function selectAdaptiveRenderTier({
  reducedMotion,
  saveData,
  webgl,
  deviceMemory,
  hardwareConcurrency,
}: AdaptiveRenderHints): AdaptiveRenderTier {
  if (
    reducedMotion ||
    saveData ||
    (deviceMemory !== undefined && deviceMemory <= 2) ||
    (hardwareConcurrency !== undefined && hardwareConcurrency <= 2)
  ) {
    return "static";
  }

  if (
    !webgl ||
    (deviceMemory !== undefined && deviceMemory <= 4) ||
    (hardwareConcurrency !== undefined && hardwareConcurrency <= 4)
  ) {
    return "cinematic";
  }

  return "webgl";
}

export function browserSupportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    return context !== null;
  } catch {
    return false;
  }
}

export function detectAdaptiveRenderTier(): AdaptiveRenderTier {
  const navigatorWithHints = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };

  return selectAdaptiveRenderTier({
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    saveData: Boolean(navigatorWithHints.connection?.saveData),
    webgl: browserSupportsWebGL(),
    deviceMemory: navigatorWithHints.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
  });
}
