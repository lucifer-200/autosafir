"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import type { gsap as Gsap } from "gsap";
import {
  adjacentScene,
  sceneFromHash,
  type HomeScene,
} from "@/lib/home-navigation";

const SCENE_EVENT = "autosafir-home-scene";
const MOBILE_QUERY = "(max-width: 1023px)";
function subscribeScene(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  window.addEventListener(SCENE_EVENT, callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
    window.removeEventListener(SCENE_EVENT, callback);
  };
}
function subscribeMobile(callback: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function useHomeNavigation() {
  const scene = useSyncExternalStore(
    subscribeScene,
    () => sceneFromHash(window.location.hash),
    () => "collection" as HomeScene,
  );
  const mobile = useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
  const rootRef = useRef<HTMLElement>(null);
  const motionRef = useRef<typeof Gsap | null>(null);
  const previousRef = useRef<HomeScene>("collection");
  const transitioningRef = useRef(false);
  const queuedRef = useRef<HomeScene | null>(null);
  const commit = useCallback((next: HomeScene) => {
    if (window.location.hash === `#${next}`) return;
    transitioningRef.current = true;
    window.history.pushState(null, "", `#${next}`);
    window.dispatchEvent(new Event(SCENE_EVENT));
  }, []);
  const select = useCallback(
    (next: HomeScene) => {
      if (transitioningRef.current) {
        queuedRef.current = next;
        return;
      }
      commit(next);
    },
    [commit],
  );
  const step = useCallback(
    (direction: number) => {
      select(
        adjacentScene(
          sceneFromHash(window.location.hash),
          direction,
          window.matchMedia(MOBILE_QUERY).matches,
        ),
      );
    },
    [select],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let observer: { kill: () => void } | undefined;
    let cooldownUntil = 0;
    let gestureUsed = false;
    const ignored = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(
        target.closest(
          "[data-gesture-ignore], button, a, summary, input, textarea, select, [role=dialog]",
        ),
      );
    const advance = (direction: number) => {
      if (
        gestureUsed ||
        Date.now() < cooldownUntil ||
        document.querySelector('[aria-modal="true"]')
      )
        return;
      gestureUsed = true;
      cooldownUntil = Date.now() + 600;
      step(direction);
    };
    function onKey(event: KeyboardEvent) {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        ignored(event.target) ||
        document.querySelector('[aria-modal="true"]')
      )
        return;
      const direction =
        event.key === "ArrowDown" || event.key === "PageDown"
          ? 1
          : event.key === "ArrowUp" || event.key === "PageUp"
            ? -1
            : 0;
      if (direction) {
        event.preventDefault();
        step(direction);
      }
    }
    document.addEventListener("keydown", onKey);
    void Promise.all([import("gsap"), import("gsap/Observer")])
      .then(([{ gsap }, { Observer }]) => {
        if (disposed) return;
        gsap.registerPlugin(Observer);
        motionRef.current = gsap;
        observer = Observer.create({
          target: root,
          type: "wheel,touch,pointer",
          tolerance: 40,
          dragMinimum: 35,
          lockAxis: true,
          preventDefault: true,
          allowClicks: true,
          ignoreCheck: (event) =>
            ignored(event.target) ||
            (event instanceof WheelEvent && event.ctrlKey),
          onChangeY: (self) =>
            advance(
              self.event.type === "wheel"
                ? Math.sign(self.deltaY)
                : -Math.sign(self.deltaY),
            ),
          onStopDelay: 0.22,
          onStop: () => {
            gestureUsed = false;
          },
          onRelease: () => {
            gestureUsed = false;
          },
        });
      })
      .catch(() => {
        /* Real links and buttons remain usable if the animation chunk fails. */
      });
    return () => {
      disposed = true;
      observer?.kill();
      motionRef.current = null;
      document.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const panelScene = !mobile && scene === "showroom" ? "collection" : scene;
  useEffect(() => {
    const previous = previousRef.current;
    previousRef.current = panelScene;
    const root = rootRef.current;
    const gsap = motionRef.current;
    const finish = () => {
      transitioningRef.current = false;
      const queued = queuedRef.current;
      queuedRef.current = null;
      if (queued && queued !== panelScene) commit(queued);
    };
    if (!root || previous === panelScene) {
      transitioningRef.current = false;
      return;
    }
    const outgoing = root.querySelector<HTMLElement>(
      `[data-scene="${previous}"]`,
    );
    const incoming = root.querySelector<HTMLElement>(
      `[data-scene="${panelScene}"]`,
    );
    if (
      !gsap ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish();
      return;
    }
    transitioningRef.current = true;
    const direction = HOME_INDEX(panelScene) >= HOME_INDEX(previous) ? 1 : -1;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete: finish });
      if (outgoing)
        timeline.fromTo(
          outgoing,
          { autoAlpha: 1, x: 0, y: 0, rotate: 0, scale: 1, zIndex: 4 },
          {
            autoAlpha: 0,
            x: -150 * direction,
            y: -105 * direction,
            rotate: -9 * direction,
            scale: 0.88,
            duration: 0.52,
            ease: "power3.in",
          },
        );
      if (incoming)
        timeline.fromTo(
          incoming,
          {
            autoAlpha: 0,
            x: 155 * direction,
            y: 100 * direction,
            rotate: 10 * direction,
            scale: 0.9,
            zIndex: 5,
          },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.7,
            ease: "power4.out",
            clearProps: "transform,opacity,visibility,zIndex",
          },
          "-=0.24",
        );
    }, root);
    return () => context.revert();
  }, [commit, panelScene]);

  return { rootRef, scene, panelScene, mobile, select, step };
}

function HOME_INDEX(scene: HomeScene) {
  return ["collection", "compare", "book-visit", "showroom"].indexOf(scene);
}
