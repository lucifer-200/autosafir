"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Keeps static HTML from submitting a client-only form before hydration. */
export function useClientReady() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
