"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { allowsEnhancedMotion } from "@/lib/motion-preferences";

export function ScrollChoreography({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !allowsEnhancedMotion()) return;
    let cancelled = false;
    let context: { revert: () => void } | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelled || !rootRef.current) return;
        gsap.registerPlugin(ScrollTrigger);
        context = gsap.context(() => {
          rootRef.current
            ?.querySelectorAll<HTMLElement>("[data-reveal]")
            .forEach((node) => {
              gsap.fromTo(
                node,
                { y: 28, opacity: 0.3 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: node,
                    start: "top 88%",
                    once: true,
                  },
                },
              );
            });
          const image = rootRef.current?.querySelector("[data-hero-image]");
          if (image) {
            gsap.to(image, {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 0.45,
              },
            });
          }
        }, rootRef);
      },
    );

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
