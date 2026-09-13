import { describe, expect, it } from "vitest";

import {
  getIntroMode,
  INTRO_SEEN_KEY,
  INTRO_SESSION_KEY,
} from "./motion-preferences";

describe("getIntroMode", () => {
  it("plays once, shortens on return, and skips within the session", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null };

    expect(getIntroMode(storage)).toBe("full");
    values.set(INTRO_SEEN_KEY, "1");
    expect(getIntroMode(storage)).toBe("short");
    values.set(INTRO_SESSION_KEY, "1");
    expect(getIntroMode(storage)).toBe("skip");
  });
});
