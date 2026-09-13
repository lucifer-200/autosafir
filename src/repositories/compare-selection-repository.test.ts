import { describe, expect, it } from "vitest";

import {
  BrowserCompareSelectionRepository,
  COMPARE_SELECTION_STORAGE_KEY,
} from "./compare-selection-repository";

describe("BrowserCompareSelectionRepository", () => {
  it("persists a unique selection and caps it at three", () => {
    const repository = new BrowserCompareSelectionRepository(
      window.localStorage,
    );
    repository.save(["one", "two", "one", "three", "four"]);

    expect(repository.load()).toEqual(["one", "two", "three"]);
  });

  it("recovers from corrupt browser data", () => {
    window.localStorage.setItem(COMPARE_SELECTION_STORAGE_KEY, "not-json");
    expect(
      new BrowserCompareSelectionRepository(window.localStorage).load(),
    ).toEqual([]);
  });
});
