"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  prefersReducedMotion,
  rememberIntroCompletion,
  type IntroMode,
} from "@/lib/motion-preferences";

interface SafirIntroProps {
  mode: Exclude<IntroMode, "skip">;
  onComplete: () => void;
}

const letters = ["S", "A", "F", "I", "R"];

export function SafirIntro({ mode, onComplete }: SafirIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const completed = useRef(false);
  const previousOverflow = useRef("");

  const finish = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    rememberIntroCompletion();
    document.body.style.overflow = previousOverflow.current;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (prefersReducedMotion()) {
      const timer = window.setTimeout(finish, 260);
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = previousOverflow.current;
      };
    }

    let cancelled = false;
    let timeline: { kill: () => void } | undefined;
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !rootRef.current) return;
      const total = mode === "short" ? 1.05 : 2.45;
      timeline = gsap
        .timeline({ onComplete: finish })
        .fromTo(
          rootRef.current.querySelectorAll("[data-signature-letter]"),
          { yPercent: 72, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: total * 0.3,
            stagger: total * 0.035,
            ease: "power3.out",
          },
        )
        .fromTo(
          rootRef.current.querySelector("[data-signature-rule]"),
          { scaleX: 0 },
          { scaleX: 1, duration: total * 0.2, ease: "power2.out" },
          total * 0.27,
        )
        .fromTo(
          rootRef.current.querySelector("[data-signature-caption]"),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: total * 0.18 },
          total * 0.42,
        )
        .to(
          rootRef.current,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: total * 0.25,
            ease: "power3.inOut",
          },
          total * 0.75,
        );
    });

    return () => {
      cancelled = true;
      timeline?.kill();
      document.body.style.overflow = previousOverflow.current;
    };
  }, [finish, mode]);

  return (
    <div
      ref={rootRef}
      className="signature-intro"
      role="dialog"
      aria-modal="true"
      aria-label="معرفی اتو سفیر"
    >
      <div className="signature-intro__mark" aria-label="SAFIR">
        <span className="signature-intro__letters" aria-hidden="true">
          {letters.map((letter) => (
            <span
              key={letter}
              data-signature-letter
              data-gold={letter === "A" ? "true" : undefined}
            >
              {letter}
            </span>
          ))}
        </span>
        <span data-signature-rule className="signature-intro__rule" />
        <span
          data-signature-caption
          className="signature-intro__caption font-technical"
        >
          AUTO SAFIR · DIGITAL SHOWROOM
        </span>
      </div>
      <button
        className="signature-intro__skip touch-target"
        type="button"
        onClick={finish}
      >
        رد شدن از معرفی
      </button>
    </div>
  );
}
