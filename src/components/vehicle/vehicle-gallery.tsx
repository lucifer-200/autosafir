"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowsOut,
  FilmStrip,
  X,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { VehicleMedia } from "@/types/vehicle";

function MediaItem({
  item,
  vehicleName,
  eager = false,
}: {
  item: VehicleMedia;
  vehicleName: string;
  eager?: boolean;
}) {
  if (item.type === "VIDEO") {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        poster={item.poster}
        aria-label={item.alt || `ویدیوی ${vehicleName}`}
      >
        <source src={item.src} />
        مرورگر شما امکان نمایش این ویدیو را ندارد.
      </video>
    );
  }

  return (
    // Demo/admin media can be local browser URLs, so the static image optimizer is unsuitable.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.src}
      alt={item.alt || vehicleName}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
    />
  );
}

function GalleryFallback() {
  return (
    <div
      className="vehicle-gallery__fallback"
      role="img"
      aria-label="تصویر خودرو موجود نیست"
    >
      {/* Atmospheric fallback does not claim to depict the listed vehicle. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/navigation/showroom-portrait.png" alt="" />
      <div>
        <span className="font-technical" dir="ltr">
          MEDIA PENDING
        </span>
        <p>تصویر اختصاصی این خودرو هنوز به دموی محلی افزوده نشده است.</p>
      </div>
    </div>
  );
}

function MediaThumbnail({ item }: { item: VehicleMedia }) {
  const source = item.type === "VIDEO" ? item.poster : item.src;
  if (!source) return <FilmStrip size={24} aria-hidden="true" />;
  return (
    // Dynamic demo media cannot rely on the static image optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={source} alt="" loading="lazy" />
  );
}

export function VehicleGallery({
  media,
  vehicleName,
}: {
  media: readonly VehicleMedia[];
  vehicleName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);

  const select = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(media.length - 1, index));
      activeIndexRef.current = next;
      setActiveIndex(next);
      trackRef.current?.children[next]?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [media.length],
  );

  const openLightbox = (index: number, trigger: HTMLElement) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
    returnFocusRef.current = trigger;
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") select(activeIndexRef.current + 1);
      if (event.key === "ArrowRight") select(activeIndexRef.current - 1);
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), video[controls], [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [lightboxOpen, select]);

  if (media.length === 0) return <GalleryFallback />;

  return (
    <>
      <div className="vehicle-gallery">
        <div
          className="vehicle-gallery__track"
          ref={trackRef}
          aria-label={`گالری ${vehicleName}`}
          onScroll={(event) => {
            const element = event.currentTarget;
            const width = element.clientWidth;
            if (width) {
              const index = Math.round(Math.abs(element.scrollLeft) / width);
              activeIndexRef.current = Math.max(
                0,
                Math.min(media.length - 1, index),
              );
              setActiveIndex(activeIndexRef.current);
            }
          }}
        >
          {media.map((item, index) => (
            <div className="vehicle-gallery__slide" key={item.id}>
              <MediaItem
                item={item}
                vehicleName={vehicleName}
                eager={index === 0}
              />
              <button
                type="button"
                className="vehicle-gallery__open touch-target"
                onClick={(event) => openLightbox(index, event.currentTarget)}
                aria-label={`باز کردن رسانه ${new Intl.NumberFormat("fa-IR").format(index + 1)} از ${new Intl.NumberFormat("fa-IR").format(media.length)}`}
              >
                <ArrowsOut size={20} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        {media.length > 1 ? (
          <div className="vehicle-gallery__counter" aria-live="polite">
            <span className="latin-numerals">{activeIndex + 1}</span>
            <span aria-hidden="true">/</span>
            <span className="latin-numerals">{media.length}</span>
          </div>
        ) : null}
        <div className="vehicle-gallery__thumbs" aria-label="انتخاب رسانه">
          {media.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => select(index)}
              aria-pressed={activeIndex === index}
              aria-label={`رسانه ${new Intl.NumberFormat("fa-IR").format(index + 1)}`}
            >
              <MediaThumbnail item={item} />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen ? (
        <div
          className="vehicle-lightbox"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setLightboxOpen(false);
          }}
        >
          <div
            className="vehicle-lightbox__dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`نمایش بزرگ ${vehicleName}`}
            ref={dialogRef}
          >
            <button
              type="button"
              className="vehicle-lightbox__close touch-target"
              onClick={() => setLightboxOpen(false)}
              ref={closeRef}
              aria-label="بستن نمایش بزرگ"
            >
              <X size={24} />
            </button>
            <div className="vehicle-lightbox__media">
              <MediaItem item={media[activeIndex]} vehicleName={vehicleName} />
            </div>
            {media.length > 1 ? (
              <div className="vehicle-lightbox__controls">
                <button
                  type="button"
                  className="touch-target"
                  onClick={() => select(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="رسانه قبلی"
                >
                  <ArrowRight size={22} />
                </button>
                <span className="font-technical" dir="ltr">
                  {activeIndex + 1} / {media.length}
                </span>
                <button
                  type="button"
                  className="touch-target"
                  onClick={() => select(activeIndex + 1)}
                  disabled={activeIndex === media.length - 1}
                  aria-label="رسانه بعدی"
                >
                  <ArrowLeft size={22} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
