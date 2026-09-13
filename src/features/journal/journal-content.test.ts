import { describe, expect, it } from "vitest";

import { staticJournalContentSource } from "./journal-content";

describe("staticJournalContentSource", () => {
  it("provides a static editorial collection with stable unique routes", () => {
    const articles = staticJournalContentSource.getAll();
    const slugs = articles.map((article) => article.slug);

    expect(articles).toHaveLength(4);
    expect(new Set(slugs).size).toBe(articles.length);
    expect(articles.every((article) => article.sections.length > 0)).toBe(true);
    expect(
      staticJournalContentSource.getBySlug("how-to-compare-trims")?.category,
    ).toBe("مقایسه تریم");
    expect(
      staticJournalContentSource.getBySlug("missing-note"),
    ).toBeUndefined();
  });
});
