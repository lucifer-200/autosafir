import { describe, expect, it } from "vitest";

import type { CompareSelectionRepository } from "@/repositories/compare-selection-repository";

import { createCompareStore } from "./compare-store";

class MemoryCompareRepository implements CompareSelectionRepository {
  slugs: string[];
  constructor(slugs: string[] = []) {
    this.slugs = slugs;
  }
  load() {
    return [...this.slugs];
  }
  save(slugs: readonly string[]) {
    this.slugs = [...slugs];
  }
}

describe("compare store", () => {
  it("hydrates, persists, prevents duplicates, and enforces the maximum", () => {
    const repository = new MemoryCompareRepository(["one"]);
    const store = createCompareStore(repository);
    store.getState().hydrate();
    expect(store.getState().slugs).toEqual(["one"]);
    expect(store.getState().add("one")).toBe("EXISTS");
    expect(store.getState().add("two")).toBe("ADDED");
    expect(store.getState().add("three")).toBe("ADDED");
    expect(store.getState().add("four")).toBe("FULL");
    store.getState().remove("two");
    expect(repository.slugs).toEqual(["one", "three"]);
  });
});
