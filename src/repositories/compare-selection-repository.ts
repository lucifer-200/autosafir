import { z } from "zod";

export const COMPARE_SELECTION_STORAGE_KEY = "autosafir:compare-selection";
export const MAX_COMPARE_VEHICLES = 3;

const compareSelectionSchema = z
  .object({
    version: z.literal(1),
    slugs: z.array(z.string().trim().min(1)).max(MAX_COMPARE_VEHICLES),
  })
  .strict();

export interface CompareSelectionRepository {
  load(): string[];
  save(slugs: readonly string[]): void;
}

export interface CompareStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export class BrowserCompareSelectionRepository implements CompareSelectionRepository {
  constructor(private readonly storage?: CompareStorage | null) {}

  private getStorage(): CompareStorage | null {
    if (this.storage !== undefined) return this.storage;
    if (typeof window === "undefined") return null;
    return window.localStorage;
  }

  load(): string[] {
    try {
      const raw = this.getStorage()?.getItem(COMPARE_SELECTION_STORAGE_KEY);
      if (!raw) return [];
      return compareSelectionSchema.parse(JSON.parse(raw) as unknown).slugs;
    } catch {
      return [];
    }
  }

  save(slugs: readonly string[]): void {
    try {
      const unique = [...new Set(slugs)].slice(0, MAX_COMPARE_VEHICLES);
      this.getStorage()?.setItem(
        COMPARE_SELECTION_STORAGE_KEY,
        JSON.stringify(
          compareSelectionSchema.parse({ version: 1, slugs: unique }),
        ),
      );
    } catch {
      // Storage may be unavailable in private/restricted browsing; memory state remains usable.
    }
  }
}
