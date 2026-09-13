export const INTRO_SESSION_KEY = "autosafir:intro-complete";
export const INTRO_SEEN_KEY = "autosafir:intro-seen";

export type IntroMode = "full" | "short" | "skip";

export function getIntroMode(storage: Pick<Storage, "getItem">): IntroMode {
  if (storage.getItem(INTRO_SESSION_KEY) === "1") return "skip";
  return storage.getItem(INTRO_SEEN_KEY) === "1" ? "short" : "full";
}

export function resolveIntroMode(): IntroMode {
  if (typeof window === "undefined") return "full";
  try {
    return getIntroMode({
      getItem(key) {
        return key === INTRO_SESSION_KEY
          ? window.sessionStorage.getItem(key)
          : window.localStorage.getItem(key);
      },
    });
  } catch {
    return "full";
  }
}

export function rememberIntroCompletion() {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    window.localStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // Storage failure must never trap the visitor behind the intro.
  }
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function allowsEnhancedMotion() {
  if (typeof window === "undefined" || prefersReducedMotion()) return false;
  const navigatorWithHints = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (navigatorWithHints.connection?.saveData) return false;
  if (
    typeof navigatorWithHints.deviceMemory === "number" &&
    navigatorWithHints.deviceMemory <= 2
  ) {
    return false;
  }
  return true;
}
