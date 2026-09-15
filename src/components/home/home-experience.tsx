"use client";

import {
  ArrowDownLeft,
  ArrowUpLeft,
  CalendarBlank,
  CarProfile,
  MapPin,
  Phone,
  Scales,
  Sparkle,
  SteeringWheel,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

import { AkhWordmark } from "@/components/branding/akh-wordmark";
import { SafirStories } from "@/components/content/safir-stories";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { VehicleStatusBadge } from "@/components/vehicle/vehicle-status-badge";
import { SHOWROOM_BRANCHES } from "@/data/branches";
import { useVehicleStore } from "@/stores/vehicle-store";
import type { Vehicle } from "@/types/vehicle";

import { ShowroomCard } from "./showroom-card";
import { useHomeParallax } from "./use-home-parallax";

const navItems = [
  { label: "موجودی", href: "/collection" },
  { label: "مقایسه", href: "/compare" },
  { label: "فروش خودرو", href: "/sell-your-car" },
  { label: "درباره ما", href: "/about" },
  { label: "شعب", href: "/branches" },
  { label: "تماس", href: "/contact" },
] as const;

const dockItems = [
  { label: "موجودی", href: "/collection", icon: CarProfile },
  { label: "مقایسه", href: "/compare", icon: Scales },
  { label: "فروش", href: "/sell-your-car", icon: SteeringWheel },
  { label: "بازدید", href: "/book-visit", icon: CalendarBlank },
  { label: "تماس", href: "/contact", icon: Phone },
] as const;

function formatMileage(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function VehicleEditorialCard({
  vehicle,
  index,
}: {
  vehicle: Vehicle;
  index: number;
}) {
  const image = vehicle.media.find((item) => item.type === "IMAGE");

  return (
    <article className="home-vehicle-card" data-reveal>
      <Link
        href={`/vehicle?slug=${encodeURIComponent(vehicle.slug)}`}
        prefetch={false}
      >
        <div className="home-vehicle-card__media">
          {image ? (
            // Admin data may contain object URLs, so a plain image is intentional here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={image.alt ?? `${vehicle.brand} ${vehicle.model}`}
            />
          ) : (
            <div className="home-vehicle-card__fallback" aria-hidden="true">
              <CarProfile size={48} weight="thin" />
              <span>AUTO SAFIR</span>
            </div>
          )}
          <span className="home-vehicle-card__number font-technical" dir="ltr">
            0{index + 1}
          </span>
          <VehicleStatusBadge status={vehicle.status} />
        </div>
        <div className="home-vehicle-card__body">
          <div>
            <p className="font-technical" dir="ltr">
              {vehicle.brand}
            </p>
            <h3>{vehicle.model}</h3>
          </div>
          <p>
            {vehicle.year} · {formatMileage(vehicle.mileage)} کیلومتر
          </p>
          <ArrowUpLeft size={22} aria-hidden="true" />
        </div>
      </Link>
    </article>
  );
}

export function HomeExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const vehicles = useVehicleStore((state) => state.vehicles);
  const hydrated = useVehicleStore((state) => state.hydrated);
  const hydrate = useVehicleStore((state) => state.hydrate);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);

  useHomeParallax(rootRef);

  const available = useMemo(
    () => vehicles.filter((vehicle) => vehicle.status === "AVAILABLE"),
    [vehicles],
  );
  const sold = useMemo(
    () => vehicles.filter((vehicle) => vehicle.status === "SOLD"),
    [vehicles],
  );
  const featured = available[0] ?? vehicles[0];
  const featuredImage = featured?.media.find((item) => item.type === "IMAGE");

  return (
    <main
      ref={rootRef}
      id="main-content"
      className="home-cinematic"
      tabIndex={-1}
    >
      <div className="home-architecture" aria-hidden="true" data-parallax="-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/navigation/showroom-portrait.png" alt="" />
      </div>

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__masthead" aria-hidden="true">
          <span>فراتر از یک مقصد</span>
          <strong dir="ltr">AutoSafir</strong>
        </div>
        <div className="home-frame">
          <div className="home-hero__media" data-hero-media>
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
                alt="خودروی لوکس در معماری گرم نمایشگاه"
                fetchPriority="high"
              />
            </picture>
            <span className="home-hero__shade" aria-hidden="true" />
            <div
              className="home-three-slot"
              data-three-slot
              aria-hidden="true"
            />
          </div>

          <header className="home-header">
            <Link
              className="home-brand"
              href="/"
              aria-label="اتو سفیر، صفحه خانه"
              dir="ltr"
            >
              AutoSafir
            </Link>
            <nav aria-label="ناوبری اصلی">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} prefetch={false}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <div className="home-theme-control" aria-label="انتخاب پوسته">
            <ThemeToggle variant="segmented" />
          </div>

          <div className="home-hero__copy" data-hero-copy>
            <p className="home-kicker font-technical" dir="ltr">
              AUTO SAFIR — A HIGHER JOURNEY
            </p>
            <h1 id="home-title">
              <span className="sr-only">اتو سفیر — </span>
              <span>انتخابی برای</span>
              <span>مسیرهای ماندگار</span>
            </h1>
            <p>
              خودروهای منتخب، مشاوره دقیق و تجربه‌ای آرام برای تصمیمی که قرار
              است ماندگار بماند.
            </p>
            <Link
              className="home-primary-action"
              href="/collection"
              prefetch={false}
            >
              مشاهده موجودی <ArrowUpLeft size={19} aria-hidden="true" />
            </Link>
          </div>

          <div className="home-contact-float" data-parallax="9">
            <ShowroomCard />
          </div>

          <aside
            className="home-feature-float"
            data-parallax="14"
            aria-label="خودروی شاخص و آمار موجودی"
          >
            <p className="font-technical" dir="ltr">
              TODAY&apos;S SELECTION
            </p>
            {featured ? (
              <>
                <h2>
                  {featured.brand} {featured.model}
                </h2>
                <span>{featured.year} · آماده بررسی</span>
              </>
            ) : (
              <>
                <h2>موجودی منتخب</h2>
                <span>در حال آماده‌سازی</span>
              </>
            )}
            {featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="home-feature-float__image"
                src={featuredImage.src}
                alt=""
              />
            ) : null}
            <div className="home-feature-float__count">
              <strong className="font-technical" dir="ltr">
                {available.length}
              </strong>
              <span>خودروی موجود</span>
            </div>
            <Link
              href="/collection"
              prefetch={false}
              aria-label="مشاهده موجودی"
            >
              <ArrowUpLeft size={21} />
            </Link>
          </aside>

          <span className="home-concept-note">
            تصویر مفهومی · جایگاه آماده برای مدل سه‌بعدی نهایی
          </span>
        </div>
        <nav className="home-mobile-dock" aria-label="دسترسی سریع">
          {dockItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} prefetch={false}>
                <Icon size={19} weight="light" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="home-hero__footer-notes" aria-hidden="true">
          <span className="font-technical" dir="ltr">
            DRIVE A BRIGHTER TOMORROW
          </span>
          <span>اعتماد، در هر مسیر</span>
        </div>
        <a className="home-scroll-cue" href="#selected">
          <span>ادامه تجربه</span>
          <ArrowDownLeft size={19} />
        </a>
      </section>

      <section
        id="selected"
        className="home-section home-selected"
        aria-labelledby="selected-title"
      >
        <header className="home-section-heading" data-reveal>
          <p className="font-technical" dir="ltr">
            THE SELECTION
          </p>
          <h2 id="selected-title">انتخاب‌های امروز</h2>
          <Link href="/collection" prefetch={false}>
            تمام موجودی <ArrowUpLeft size={18} />
          </Link>
        </header>
        <div className="home-vehicle-grid">
          {vehicles.length ? (
            vehicles
              .slice(0, 3)
              .map((vehicle, index) => (
                <VehicleEditorialCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  index={index}
                />
              ))
          ) : (
            <div className="home-vehicle-empty" data-reveal>
              <CarProfile size={52} weight="thin" />
              <div>
                <h3>موجودی در حال آماده‌سازی است.</h3>
                <p>
                  خودروهای تأییدشده از پنل مدیریت در همین بخش نمایش داده
                  می‌شوند.
                </p>
              </div>
              <Link href="/contact">
                تماس با مشاور <ArrowUpLeft size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section
        className="home-manifesto home-section"
        aria-labelledby="experience-title"
      >
        <div className="home-manifesto__mark" data-parallax="-8">
          <Sparkle size={24} weight="fill" />
          <span className="font-technical" dir="ltr">
            AUTO SAFIR
          </span>
        </div>
        <div data-reveal>
          <p className="font-technical" dir="ltr">
            A CONSIDERED EXPERIENCE
          </p>
          <h2 id="experience-title">
            لوکس بودن،
            <br />
            در آرامش انتخاب است.
          </h2>
          <p>
            ما هر خودرو را با دقت انتخاب می‌کنیم و اطلاعاتی روشن برای بررسی،
            مقایسه و هماهنگی بازدید در اختیار شما می‌گذاریم.
          </p>
          <Link href="/about" prefetch={false}>
            روایت اتو سفیر <ArrowUpLeft size={18} />
          </Link>
        </div>
      </section>

      <section
        className="home-statuses home-section"
        aria-labelledby="status-title"
      >
        <header className="home-section-heading" data-reveal>
          <p className="font-technical" dir="ltr">
            CURRENT STATUS
          </p>
          <h2 id="status-title">موجود، رزرو شده، فروخته شده</h2>
        </header>
        <div className="home-status-grid">
          <Link href="/collection?status=AVAILABLE">
            <span>موجود</span>
            <strong>{hydrated ? available.length : "—"}</strong>
            <small>آماده بررسی و هماهنگی بازدید</small>
          </Link>
          <Link href="/collection?status=RESERVED">
            <span>رزرو شده</span>
            <strong>
              {hydrated
                ? vehicles.filter((v) => v.status === "RESERVED").length
                : "—"}
            </strong>
            <small>در مسیر نهایی‌شدن انتخاب</small>
          </Link>
          <Link href="/collection?status=SOLD">
            <span>فروخته شده</span>
            <strong>{hydrated ? sold.length : "—"}</strong>
            <small>آرشیو انتخاب‌های ماندگار</small>
          </Link>
        </div>
      </section>

      <section
        className="home-compare home-section"
        aria-labelledby="compare-title"
      >
        <div data-parallax="-7">
          <Scales size={66} weight="thin" />
        </div>
        <div data-reveal>
          <p className="font-technical" dir="ltr">
            SIDE BY SIDE
          </p>
          <h2 id="compare-title">انتخاب را دقیق‌تر کنید.</h2>
          <p>
            تا سه خودرو را کنار هم ببینید؛ بدون قیمت‌گذاری عمومی، با تمرکز بر
            مشخصات و تناسب هر انتخاب.
          </p>
          <Link href="/compare">
            شروع مقایسه <ArrowUpLeft size={18} />
          </Link>
        </div>
      </section>

      <SafirStories />

      <section
        className="home-branches home-section"
        aria-labelledby="branches-title"
      >
        <header className="home-section-heading" data-reveal>
          <p className="font-technical" dir="ltr">
            OUR LOCATIONS
          </p>
          <h2 id="branches-title">دو نقطه، یک تجربه.</h2>
        </header>
        <div className="home-branch-grid">
          {SHOWROOM_BRANCHES.map((branch, index) => (
            <article key={branch.id} data-reveal>
              <span className="font-technical" dir="ltr">
                0{index + 1}
              </span>
              <MapPin size={24} weight="light" />
              <h3>{branch.name}</h3>
              <p>{branch.address}</p>
              <a href={`tel:${branch.phone}`} dir="ltr">
                {branch.phoneDisplay}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section
        className="home-contact-finale home-section"
        aria-labelledby="contact-title"
      >
        <div data-reveal>
          <p className="font-technical" dir="ltr">
            THE NEXT STEP
          </p>
          <h2 id="contact-title">
            برای یک انتخاب
            <br />
            آگاهانه، نزدیک‌تر شوید.
          </h2>
        </div>
        <div>
          <Link href="/book-visit">
            <CalendarBlank size={22} /> هماهنگی بازدید
          </Link>
          <Link href="/contact">
            <Phone size={22} /> تماس با اتو سفیر
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <span>نسخه نمایشی · بدون نمایش قیمت خودرو</span>
        <a href="https://akhavan.dev" aria-label="Developed by AKH" dir="ltr">
          <span>Developed by</span>
          <AkhWordmark />
        </a>
      </footer>
    </main>
  );
}
