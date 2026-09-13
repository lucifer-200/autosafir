"use client";

import { useEffect, type ReactNode } from "react";

import {
  allowsEnhancedMotion,
  prefersReducedMotion,
} from "@/lib/motion-preferences";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (
      !allowsEnhancedMotion() ||
      prefersReducedMotion() ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    let cancelled = false;
    let frame = 0;
    let controller:
      { raf: (time: number) => void; destroy: () => void } | undefined;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      controller = new Lenis({ duration: 0.9, smoothWheel: true });
      const tick = (time: number) => {
        controller?.raf(time);
        frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      controller?.destroy();
    };
  }, []);

  return children;
}
