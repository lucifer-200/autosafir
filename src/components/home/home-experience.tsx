"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpLeft,
  CalendarBlank,
  CaretDown,
  CarProfile,
  Scales,
  MapPin,
  Sparkle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { AkhWordmark } from "@/components/branding/akh-wordmark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HOME_SCENES } from "@/lib/home-navigation";
import { ShowroomCard } from "./showroom-card";
import { useHomeNavigation } from "./use-home-navigation";

const chapters = [
  {
    id: "collection",
    title: "موجودی امروز",
    english: "THE COLLECTION",
    href: "/collection",
    action: "مشاهده خودروها",
    icon: CarProfile,
    detail: "خودروهای منتخب و آماده بازدید",
  },
  {
    id: "compare",
    title: "مقایسه",
    english: "SIDE BY SIDE",
    href: "/compare",
    action: "انتخاب خودروها",
    icon: Scales,
    detail: "مقایسه هم‌زمان تا سه انتخاب",
  },
  {
    id: "book-visit",
    title: "بازدید حضوری",
    english: "YOUR VISIT",
    href: "/book-visit",
    action: "هماهنگی بازدید",
    icon: CalendarBlank,
    detail: "هماهنگی سریع با شعب اتو سفیر",
  },
] as const;

const headerLinks = [
  { href: "/branches", eyebrow: "موقعیت", label: "شعب اتو سفیر", icon: MapPin },
  {
    href: "/collection",
    eyebrow: "نوع خودرو",
    label: "موجودی",
    icon: CarProfile,
  },
  { href: "/compare", eyebrow: "انتخاب", label: "مقایسه", icon: Scales },
  {
    href: "/book-visit",
    eyebrow: "قرار ملاقات",
    label: "رزرو بازدید",
    icon: CalendarBlank,
  },
] as const;

export function HomeExperience() {
  const { rootRef, scene, panelScene, mobile, select, step } =
    useHomeNavigation();
  const activeIndex = HOME_SCENES.indexOf(panelScene);
  const controls = [
    ...chapters.map(({ id, title }) => ({ id, title })),
    ...(mobile ? [{ id: "showroom" as const, title: "اطلاعات فروشگاه" }] : []),
  ];
  return (
    <main
      ref={rootRef}
      id="main-content"
      className="showroom-home"
      tabIndex={-1}
      data-active-scene={scene}
    >
      <section className="showroom-frame" aria-label="نمایشگاه اتو سفیر">
        <header className="showroom-header">
          <svg
            className="showroom-header__shape"
            viewBox="0 0 1000 68"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M160 0H840C805 0 805 64 750 64H250C195 64 195 0 160 0Z" />
          </svg>
          <nav aria-label="ناوبری اصلی صفحه خانه">
            {headerLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} prefetch={false}>
                  <Icon
                    className="showroom-header__icon"
                    size={15}
                    weight="light"
                    aria-hidden="true"
                  />
                  <span className="showroom-header__copy">
                    <small>{item.eyebrow}</small>
                    <strong>{item.label}</strong>
                  </span>
                  <CaretDown
                    className="showroom-header__caret"
                    size={11}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>
        </header>
        <div className="showroom-backdrop">
          <picture>
            <source
              media="(min-width: 1024px)"
              type="image/avif"
              srcSet="/images/home/showroom-desktop.avif"
            />
            <source
              media="(min-width: 1024px)"
              type="image/webp"
              srcSet="/images/home/showroom-desktop.webp"
            />
            <source
              type="image/avif"
              srcSet="/images/home/showroom-mobile-480.avif 480w, /images/home/showroom-mobile-768.avif 768w"
              sizes="100vw"
            />
            <img
              src="/images/home/showroom-mobile-768.webp"
              srcSet="/images/home/showroom-mobile-480.webp 480w, /images/home/showroom-mobile-768.webp 768w"
              sizes="100vw"
              alt="تصویر مفهومی خودروی لوکس در فضای معماری گرم"
              fetchPriority="high"
              width={853}
              height={1844}
            />
          </picture>
        </div>
        <div className="showroom-title">
          <span className="font-technical" dir="ltr">
            AUTO SAFIR
          </span>
          <h1>اتو سفیر</h1>
        </div>
        <aside className="showroom-tools" aria-label="تنظیمات نمایش">
          <ThemeToggle variant="icon" />
          <button
            type="button"
            className="showroom-contact-trigger"
            aria-label="نمایش اطلاعات فروشگاه"
            aria-pressed={scene === "showroom"}
            onClick={() =>
              select(scene === "showroom" ? "collection" : "showroom")
            }
          >
            <MapPin size={21} aria-hidden="true" />
          </button>
        </aside>
        <div
          className="showroom-contact-slot"
          data-highlight={scene === "showroom" || undefined}
        >
          <ShowroomCard />
        </div>
        <div className="showroom-route-slot">
          <div className="showroom-deck">
            {chapters.map((chapter, index) => {
              const Icon = chapter.icon;
              const active = panelScene === chapter.id;
              const position = active
                ? "active"
                : index === activeIndex + 1
                  ? "next"
                  : "hidden";
              return (
                <article
                  key={chapter.id}
                  data-scene={chapter.id}
                  data-active={active}
                  data-position={position}
                  inert={!active}
                  aria-hidden={!active}
                  className="showroom-route-card"
                  aria-label={chapter.title}
                >
                  <div className="showroom-route-top">
                    <Icon size={28} weight="light" aria-hidden="true" />
                    <span className="font-technical" dir="ltr">
                      0{index + 1} / 03
                    </span>
                  </div>
                  <div className="showroom-route-copy">
                    <p className="font-technical" dir="ltr">
                      {chapter.english}
                    </p>
                    <h2>{chapter.title}</h2>
                    <div className="showroom-route-detail">
                      <Sparkle size={16} weight="fill" aria-hidden="true" />
                      <span>{chapter.detail}</span>
                    </div>
                    <Link
                      href={chapter.href}
                      prefetch={false}
                      className="showroom-route-link"
                    >
                      {chapter.action}
                      <ArrowUpLeft size={22} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
            <div
              data-scene="showroom"
              data-active={panelScene === "showroom"}
              inert={panelScene !== "showroom"}
              aria-hidden={panelScene !== "showroom"}
              className="showroom-mobile-contact"
            >
              <ShowroomCard />
            </div>
          </div>
          <nav className="showroom-chapter-controls" aria-label="انتخاب کارت">
            <button
              type="button"
              aria-label="کارت قبلی"
              disabled={activeIndex === 0}
              onClick={() => step(-1)}
            >
              <ArrowUp size={18} aria-hidden="true" />
            </button>
            <div className="showroom-dots">
              {controls.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  aria-label={`نمایش ${item.title}`}
                  aria-pressed={panelScene === item.id}
                  onClick={() => select(item.id)}
                >
                  <span />
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="کارت بعدی"
              disabled={activeIndex === controls.length - 1}
              onClick={() => step(1)}
            >
              <ArrowDown size={18} aria-hidden="true" />
            </button>
          </nav>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {panelScene === "showroom"
              ? "اطلاعات فروشگاه"
              : chapters[activeIndex].title}
          </p>
        </div>
        <span className="showroom-image-note">تصویر مفهومی</span>
      </section>
      <div className="showroom-colophon">
        <span>نسخهٔ نمایشی</span>
        <a href="https://akhavan.dev" aria-label="Developed by AKH" dir="ltr">
          <span>Developed by</span>
          <AkhWordmark />
        </a>
      </div>
    </main>
  );
}
