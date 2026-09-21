"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const VIDEO_URL = "/videos/autosafir-hero-v2.mp4?v=2";
const POSTER_URL = "/videos/autosafir-hero-v2-poster.jpg";
const CACHE_NAME = "autosafir-cinematic-media-v2";
const CACHE_HINT = "autosafir:hero-video:v2";

type LoadState = "loading" | "opening" | "ready";

function ToyCar() {
  return (
    <svg
      className="home-video-loader__car"
      viewBox="0 0 132 58"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="toy-car-gold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff0b9" />
          <stop offset="0.34" stopColor="#d5a34e" />
          <stop offset="0.72" stopColor="#8f5d17" />
          <stop offset="1" stopColor="#edca79" />
        </linearGradient>
        <filter id="toy-car-shadow" x="-40%" y="-80%" width="180%" height="260%">
          <feDropShadow dx="0" dy="7" stdDeviation="5" floodOpacity=".55" />
        </filter>
      </defs>
      <g filter="url(#toy-car-shadow)">
        <path
          fill="url(#toy-car-gold)"
          d="M10 37.5c2.5-8.2 8.4-12.7 18.1-14.2l17.2-2.7 11.1-11.2c2.4-2.4 5.2-3.6 8.6-3.6h22.3c4.4 0 7.8 1.6 10.4 4.9l9.2 11.7 11.6 3.8c4.1 1.4 6.5 4.2 7.2 8.6l.8 5.2H9.2l.8-2.5Z"
        />
        <path
          fill="#2b2115"
          d="M54.7 21.5 63 11.8c1-1.1 2.3-1.7 3.8-1.7h9.4v11.4H54.7Zm26-11.4h5.7c2.6 0 4.6 1 6.2 2.9l6.8 8.5H80.7V10.1Z"
        />
        <path
          fill="none"
          stroke="#fff2c6"
          strokeLinecap="round"
          strokeWidth="1.7"
          d="M18 30.7c20.3-5.9 74.4-8.9 99.3-1.2"
          opacity=".7"
        />
        <circle cx="34" cy="40" r="10.2" fill="#13110e" />
        <circle cx="34" cy="40" r="5.1" fill="#d8af62" />
        <circle cx="101" cy="40" r="10.2" fill="#13110e" />
        <circle cx="101" cy="40" r="5.1" fill="#d8af62" />
        <path fill="#fff5ce" d="m119 28 7 2.7-1.4 4.1-7.6-1.7Z" opacity=".85" />
      </g>
    </svg>
  );
}

export function CinematicHeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      queueMicrotask(() => {
        if (!cancelled) setState("ready");
      });
      return () => {
        cancelled = true;
      };
    }

    if (localStorage.getItem(CACHE_HINT) !== "ready") {
      delete document.documentElement.dataset.homeVideoCached;
    }

    let objectUrl: string | undefined;

    async function loadVideo() {
      const cache = "caches" in window
        ? await caches.open(CACHE_NAME)
        : undefined;
      let response = await cache?.match(VIDEO_URL);
      let cacheWrite: Promise<void> | undefined;

      if (!response) {
        const networkResponse = await fetch(VIDEO_URL, { cache: "force-cache" });
        if (!networkResponse.ok) throw new Error("Hero video could not load");
        response = networkResponse;
        cacheWrite = cache?.put(VIDEO_URL, networkResponse.clone());
      }

      const total = Number(response.headers.get("content-length") ?? 0);
      const reader = response.body?.getReader();
      const chunks: ArrayBuffer[] = [];
      let received = 0;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            const chunk = new Uint8Array(value.byteLength);
            chunk.set(value);
            chunks.push(chunk.buffer);
            received += value.byteLength;
            if (!cancelled && total > 0) {
              setProgress(Math.min(99, Math.round((received / total) * 100)));
            }
          }
        }
      }

      if (cancelled) return;
      const blob = reader
        ? new Blob(chunks, { type: "video/mp4" })
        : await response.blob();
      await cacheWrite?.catch(() => undefined);
      objectUrl = URL.createObjectURL(blob);
      localStorage.setItem(CACHE_HINT, "ready");
      document.documentElement.dataset.homeVideoCached = "true";
      setProgress(100);
      setSource(objectUrl);
    }

    void loadVideo();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;
    let previewTimer = 0;

    const openHero = () => {
      setState("opening");
      video.currentTime = 0;
      void video.play();
      previewTimer = window.setTimeout(() => {
        video.pause();
        setState("ready");
        window.dispatchEvent(new CustomEvent("autosafir:hero-ready"));
      }, 1050);
    };

    video.addEventListener("loadedmetadata", openHero, { once: true });
    video.load();
    return () => {
      window.clearTimeout(previewTimer);
      video.pause();
      video.removeEventListener("loadedmetadata", openHero);
    };
  }, [source]);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video || state !== "ready" || !source) return;
    let disposed = false;
    let cleanup: () => void = () => undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, triggerModule]) => {
        if (disposed) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = triggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        const previewTime = video.currentTime;
        const duration = Math.max(previewTime, video.duration - 0.08);
        let targetTime = previewTime;
        let seeking = false;
        let animationFrame = 0;

        const seekToLatestTarget = () => {
          animationFrame = 0;
          if (seeking || Math.abs(video.currentTime - targetTime) < 1 / 30) {
            return;
          }
          seeking = true;
          video.currentTime = targetTime;
        };
        const requestLatestFrame = () => {
          if (!animationFrame && !seeking) {
            animationFrame = requestAnimationFrame(seekToLatestTarget);
          }
        };
        const handleSeeked = () => {
          seeking = false;
          requestLatestFrame();
        };

        video.addEventListener("seeked", handleSeeked);
        const trigger = ScrollTrigger.create({
          trigger: ".home-hero",
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            targetTime = previewTime + self.progress * (duration - previewTime);
            requestLatestFrame();
          },
        });
        ScrollTrigger.refresh();
        cleanup = () => {
          cancelAnimationFrame(animationFrame);
          video.removeEventListener("seeked", handleSeeked);
          trigger.kill();
        };
      },
    );

    return () => {
      disposed = true;
      cleanup();
    };
  }, [source, state]);

  return (
    <div className="home-hero__media" data-hero-media data-load-state={state}>
      <video
        ref={videoRef}
        className="home-hero__video"
        src={source ?? undefined}
        poster={POSTER_URL}
        preload="auto"
        muted
        playsInline
        aria-label="نمای سینمایی خودروی لوکس اتو سفیر"
      />
      <span className="home-hero__shade" aria-hidden="true" />
      {state !== "ready" ? (
        <div className="home-video-loader" aria-live="polite">
          <div className="home-video-loader__orbit" aria-hidden="true">
            <span className="home-video-loader__track" />
            <div className="home-video-loader__vehicle">
              <ToyCar />
            </div>
          </div>
          <div className="home-video-loader__brand" aria-hidden="true">
            <strong dir="ltr">AutoSafir</strong>
            <span>اتو سفیر</span>
          </div>
          <div className="home-video-loader__progress">
            <span style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
          <p>{progress < 100 ? `آماده‌سازی تجربه · ${progress}٪` : "آماده حرکت"}</p>
        </div>
      ) : null}
    </div>
  );
}
