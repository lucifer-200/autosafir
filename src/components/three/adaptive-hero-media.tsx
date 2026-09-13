"use client";

import type { ReactNode } from "react";
import { Component, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import {
  detectAdaptiveRenderTier,
  type AdaptiveRenderTier,
} from "@/lib/adaptive-render-quality";

const HeroDepthCanvas = dynamic(
  () => import("./hero-depth-canvas").then((module) => module.HeroDepthCanvas),
  { ssr: false, loading: () => null },
);

interface SceneBoundaryProps {
  children: ReactNode;
  onError: () => void;
}

class SceneBoundary extends Component<SceneBoundaryProps> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function AdaptiveHeroMedia() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<AdaptiveRenderTier>("static");
  const [nearViewport, setNearViewport] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const capabilityTimer = window.setTimeout(
      () => setTier(detectAdaptiveRenderTier()),
      0,
    );

    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") {
      const viewportTimer = window.setTimeout(() => setNearViewport(true), 0);
      return () => {
        window.clearTimeout(capabilityTimer);
        window.clearTimeout(viewportTimer);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: "240px" },
    );
    observer.observe(root);
    return () => {
      window.clearTimeout(capabilityTimer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const updateVisibility = () =>
      setPageVisible(document.visibilityState !== "hidden");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setTier("cinematic");
    };
    root.addEventListener("webglcontextlost", handleContextLost, true);
    return () =>
      root.removeEventListener("webglcontextlost", handleContextLost, true);
  }, []);

  useEffect(() => {
    if (tier !== "webgl") return;

    const windowWithIdle = window as Window & {
      requestIdleCallback?: (callback: () => void) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const handle = windowWithIdle.requestIdleCallback
      ? windowWithIdle.requestIdleCallback(() => setIdle(true))
      : window.setTimeout(() => setIdle(true), 180);

    return () => {
      if (windowWithIdle.cancelIdleCallback) {
        windowWithIdle.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
    };
  }, [tier]);

  const shouldRenderWebGL = tier === "webgl" && nearViewport && idle;

  return (
    <div
      ref={rootRef}
      className="luxury-hero__media adaptive-hero-media"
      data-render-tier={tier}
      data-hero-image
    >
      <Image
        src="/images/navigation/showroom-portrait.png"
        alt="تصویر مفهومی خودروی لوکس در فضای معماری گرم"
        fill
        priority
        sizes="(min-width: 900px) 36vw, 100vw"
      />
      {shouldRenderWebGL ? (
        <SceneBoundary onError={() => setTier("cinematic")}>
          <HeroDepthCanvas
            active={pageVisible}
            onDegrade={() => setTier("cinematic")}
          />
        </SceneBoundary>
      ) : null}
      <span>تصویر مفهومی نسخه دمو</span>
    </div>
  );
}
