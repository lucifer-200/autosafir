"use client";

import type { RefObject } from "react";
import { useLayoutEffect } from "react";

export function useHomeParallax(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup: () => void = () => undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([gsapModule, triggerModule]) => {
        if (disposed) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = triggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          const mediaQuery = gsap.matchMedia();
          mediaQuery.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.to("[data-hero-media] picture", {
              yPercent: 9,
              scale: 1.045,
              ease: "none",
              scrollTrigger: {
                trigger: ".home-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
              },
            });
            gsap.to("[data-hero-copy]", {
              yPercent: -18,
              opacity: 0.15,
              ease: "none",
              scrollTrigger: {
                trigger: ".home-hero",
                start: "top top",
                end: "bottom 20%",
                scrub: 0.8,
              },
            });
            gsap.utils
              .toArray<HTMLElement>("[data-parallax]")
              .forEach((element) => {
                if (
                  element.closest(".home-contact-float, .home-feature-float")
                ) {
                  return;
                }
                const distance = Number(element.dataset.parallax ?? 8);
                gsap.fromTo(
                  element,
                  { yPercent: -distance },
                  {
                    yPercent: distance,
                    ease: "none",
                    scrollTrigger: {
                      trigger: element,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 0.7,
                    },
                  },
                );
              });
            gsap.utils
              .toArray<HTMLElement>("[data-reveal]")
              .forEach((element) => {
                gsap.from(element, {
                  y: 44,
                  opacity: 0,
                  duration: 1.05,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: element,
                    start: "top 88%",
                    once: true,
                  },
                });
              });
          });
          cleanup = () => mediaQuery.revert();
        }, root);
        const previousCleanup = cleanup;
        cleanup = () => {
          previousCleanup();
          context.revert();
        };
      })
      .catch(() => {
        /* Semantic content remains fully usable without motion. */
      });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [rootRef]);
}
