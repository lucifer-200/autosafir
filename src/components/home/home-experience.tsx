"use client";

import { ArrowDown, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { SafirIntro } from "@/components/animation/safir-intro";
import { ScrollChoreography } from "@/components/animation/scroll-choreography";
import { SmoothScroll } from "@/components/animation/smooth-scroll";
import { AdaptiveHeroMedia } from "@/components/three/adaptive-hero-media";
import { resolveIntroMode, type IntroMode } from "@/lib/motion-preferences";
import { useVehicleStore } from "@/stores/vehicle-store";

const chapters = [
  {
    index: "01",
    title: "موجودی امروز",
    body: "خودروهای موجود و رزروشده را با اطلاعات روشن و بدون قیمت عمومی مرور کنید.",
    href: "/collection",
    action: "مشاهده مجموعه",
  },
  {
    index: "02",
    title: "مقایسه دقیق",
    body: "دو یا سه خودرو را کنار هم بگذارید و تفاوت‌های واقعی مشخصات را آرام بررسی کنید.",
    href: "/compare",
    action: "شروع مقایسه",
  },
  {
    index: "03",
    title: "بازدید حضوری",
    body: "خودرو را انتخاب کنید و برای هماهنگی واقعی مستقیماً با اتو سفیر تماس بگیرید.",
    href: "/book-visit",
    action: "رزرو نمایشی بازدید",
  },
] as const;

export function HomeExperience() {
  const [introDismissed, setIntroDismissed] = useState(false);
  const isClient = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const introMode: IntroMode | null = introDismissed
    ? "skip"
    : isClient
      ? resolveIntroMode()
      : null;
  const vehicles = useVehicleStore((state) => state.vehicles);
  const hydrated = useVehicleStore((state) => state.hydrated);
  const hydrate = useVehicleStore((state) => state.hydrate);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);

  const counts = useMemo(
    () => ({
      available: vehicles.filter((vehicle) => vehicle.status === "AVAILABLE")
        .length,
      reserved: vehicles.filter((vehicle) => vehicle.status === "RESERVED")
        .length,
      sold: vehicles.filter((vehicle) => vehicle.status === "SOLD").length,
    }),
    [vehicles],
  );

  return (
    <main id="main-content" className="luxury-home">
      {introMode && introMode !== "skip" ? (
        <SafirIntro
          mode={introMode}
          onComplete={() => setIntroDismissed(true)}
        />
      ) : null}
      <SmoothScroll>
        <ScrollChoreography>
          <section
            className="luxury-hero"
            aria-labelledby="luxury-home-heading"
          >
            <AdaptiveHeroMedia />
            <div className="luxury-hero__content">
              <p className="font-technical" dir="ltr">
                AUTOSAFIR · PRIVATE VIEWING
              </p>
              <h1 id="luxury-home-heading">اتو سفیر</h1>
              <p className="luxury-hero__lead">
                نمایشگاه دیجیتال برای انتخابی آرام‌تر؛ خودرو، جزئیات و مسیر
                بازدید در یک قاب دقیق.
              </p>
              <div className="luxury-hero__actions">
                <Link href="/collection" prefetch={false}>
                  مشاهده خودروها <ArrowLeft aria-hidden="true" />
                </Link>
                <Link href="/collection" prefetch={false} className="is-quiet">
                  موجودی امروز
                </Link>
              </div>
              <a href="#home-ledger" className="luxury-hero__scroll">
                <ArrowDown aria-hidden="true" /> ادامه
              </a>
            </div>
          </section>

          <section
            id="home-ledger"
            className="home-ledger"
            aria-labelledby="home-ledger-heading"
          >
            <header data-reveal>
              <p className="font-technical" dir="ltr">
                A QUIET JOURNEY
              </p>
              <h2 id="home-ledger-heading">سه مسیر، یک انتخاب سنجیده</h2>
            </header>
            <div className="home-ledger__rows">
              {chapters.map((chapter) => (
                <article key={chapter.index} data-reveal>
                  <span className="home-ledger__index font-technical">
                    {chapter.index}
                  </span>
                  <div>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.body}</p>
                  </div>
                  <Link
                    href={chapter.href}
                    prefetch={false}
                    aria-label={`${chapter.action}: ${chapter.title}`}
                  >
                    <ArrowLeft aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section
            className="home-inventory"
            aria-label="خلاصه موجودی نمایشی"
            data-reveal
          >
            <p>وضعیت مجموعه روی همین دستگاه</p>
            <dl>
              <div>
                <dt>موجود</dt>
                <dd>{hydrated ? counts.available : "—"}</dd>
              </div>
              <div>
                <dt>رزرو</dt>
                <dd>{hydrated ? counts.reserved : "—"}</dd>
              </div>
              <div>
                <dt>فروخته‌شده</dt>
                <dd>{hydrated ? counts.sold : "—"}</dd>
              </div>
            </dl>
            <Link href="/collection" prefetch={false}>
              ورود به مجموعه
            </Link>
          </section>
        </ScrollChoreography>
      </SmoothScroll>
    </main>
  );
}
