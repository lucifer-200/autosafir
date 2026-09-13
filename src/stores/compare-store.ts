"use client";

import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";

import {
  BrowserCompareSelectionRepository,
  MAX_COMPARE_VEHICLES,
  type CompareSelectionRepository,
} from "@/repositories/compare-selection-repository";

export interface CompareStoreState {
  slugs: string[];
  hydrated: boolean;
  hydrate(): void;
  add(slug: string): "ADDED" | "EXISTS" | "FULL";
  remove(slug: string): void;
  replace(slugs: readonly string[]): void;
  clear(): void;
}

export function createCompareStore(
  repository: CompareSelectionRepository,
): StoreApi<CompareStoreState> {
  return createStore<CompareStoreState>((set, get) => {
    const persist = (slugs: string[]) => {
      repository.save(slugs);
      set({ slugs });
    };

    return {
      slugs: [],
      hydrated: false,
      hydrate: () => set({ slugs: repository.load(), hydrated: true }),
      add: (slug) => {
        const normalized = slug.trim();
        if (get().slugs.includes(normalized)) return "EXISTS";
        if (get().slugs.length >= MAX_COMPARE_VEHICLES) return "FULL";
        persist([...get().slugs, normalized]);
        return "ADDED";
      },
      remove: (slug) => persist(get().slugs.filter((item) => item !== slug)),
      replace: (slugs) =>
        persist(
          [...new Set(slugs.map((slug) => slug.trim()).filter(Boolean))].slice(
            0,
            MAX_COMPARE_VEHICLES,
          ),
        ),
      clear: () => persist([]),
    };
  });
}

let browserStore: StoreApi<CompareStoreState> | undefined;

export function getCompareStore(): StoreApi<CompareStoreState> {
  browserStore ??= createCompareStore(new BrowserCompareSelectionRepository());
  return browserStore;
}

export function useCompareStore<T>(
  selector: (state: CompareStoreState) => T,
): T {
  return useStore(getCompareStore(), selector);
}
