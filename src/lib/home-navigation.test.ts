import { describe, expect, it } from "vitest";
import { adjacentScene, sceneFromHash } from "./home-navigation";

describe("home URL navigation", () => {
  it("resolves direct URLs and safely defaults unknown fragments", () => {
    expect(sceneFromHash("#compare")).toBe("compare");
    expect(sceneFromHash("#showroom")).toBe("showroom");
    expect(sceneFromHash("#unknown")).toBe("collection");
    expect(sceneFromHash("")).toBe("collection");
  });
  it("clamps navigation and includes the showroom only on mobile", () => {
    expect(adjacentScene("collection", -1, true)).toBe("collection");
    expect(adjacentScene("book-visit", 1, false)).toBe("book-visit");
    expect(adjacentScene("book-visit", 1, true)).toBe("showroom");
    expect(adjacentScene("showroom", 1, true)).toBe("showroom");
    expect(adjacentScene("compare", -1, false)).toBe("collection");
    expect(adjacentScene("showroom", 1, false)).toBe("compare");
  });
});
