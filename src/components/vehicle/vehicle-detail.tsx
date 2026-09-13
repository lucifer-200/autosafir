"use client";

import {
  CalendarCheck,
  Check,
  Copy,
  InstagramLogo,
  PaperPlaneTilt,
  Phone,
  ShareNetwork,
  SquaresFour,
  WhatsappLogo,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { siteContact, toTelephoneHref } from "@/data/site-navigation";
import {
  findVehicleBySlug,
  formatVehicleMileage,
  getRelatedVehicles,
  getVehicleDisplayName,
} from "@/features/vehicles/vehicle-detail";
import { useVehicleStore } from "@/stores/vehicle-store";
import type { Vehicle } from "@/types/vehicle";

import { VehicleCard } from "./vehicle-card";
import { VehicleGallery } from "./vehicle-gallery";
import { VehicleStatusBadge } from "./vehicle-status-badge";

type SpecItem = { label: string; value?: string | number };

function DetailLoading() {
  return (
    <main id="main-content" className="vehicle-detail-page">
      <div className="vehicle-detail-loading" role="status">
        <span className="font-technical" dir="ltr">
          AUTOSAFIR
        </span>
        <p>در حال آماده‌سازی جزئیات خودرو…</p>
      </div>
    </main>
  );
}

function DetailNotFound({ missingSlug }: { missingSlug: boolean }) {
  return (
    <main id="main-content" className="vehicle-detail-page">
      <section
        className="vehicle-detail-missing"
        aria-labelledby="missing-vehicle-title"
      >
        <p className="font-technical" dir="ltr">
          VEHICLE NOT FOUND
        </p>
        <h1 id="missing-vehicle-title">
          {missingSlug
            ? "آدرس خودرو کامل نیست"
            : "این خودرو در مجموعه پیدا نشد"}
        </h1>
        <p>
          ممکن است نشانی تغییر کرده باشد یا این رکورد هنوز در دموی محلی ثبت نشده
          باشد.
        </p>
        <Link href="/collection">بازگشت به مجموعه خودروها</Link>
      </section>
    </main>
  );
}

function DetailList({ items }: { items: readonly SpecItem[] }) {
  const visible = items.filter(
    (item) => item.value !== undefined && item.value !== "",
  );
  if (visible.length === 0) {
    return (
      <p className="vehicle-detail__empty-copy">
        جزئیات این بخش هنوز ثبت نشده است.
      </p>
    );
  }
  return (
    <dl className="vehicle-detail-list">
      {visible.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ShareButton({ vehicle }: { vehicle: Vehicle }) {
  const [message, setMessage] = useState("");
  const name = getVehicleDisplayName(vehicle);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: name,
          text: `مشاهده ${name} در دموی اتو سفیر`,
          url,
        });
        setMessage("پنجره اشتراک‌گذاری باز شد");
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("پیوند کپی شد");
      }
    } catch (error) {
      if ((error as DOMException).name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url);
        setMessage("پیوند کپی شد");
      } catch {
        setMessage("کپی خودکار ممکن نبود؛ نشانی مرورگر را کپی کنید");
      }
    }
  };

  return (
    <>
      <button
        type="button"
        className="vehicle-action vehicle-action--quiet"
        onClick={share}
      >
        {message === "پیوند کپی شد" ? (
          <Check size={20} />
        ) : (
          <ShareNetwork size={20} />
        )}
        اشتراک‌گذاری
      </button>
      <span className="vehicle-share-message" role="status" aria-live="polite">
        {message}
      </span>
    </>
  );
}

function ContactActions({ vehicle }: { vehicle: Vehicle }) {
  const sold = vehicle.status === "SOLD";
  const phone = vehicle.advisor?.phone || siteContact.phones[0];
  return (
    <div className="vehicle-contact-actions" aria-label="راه‌های ارتباطی">
      {sold ? (
        <Link
          className="vehicle-action vehicle-action--primary"
          href="/collection"
        >
          <SquaresFour size={20} /> مشاهده خودروهای مشابه
        </Link>
      ) : (
        <Link
          className="vehicle-action vehicle-action--primary"
          href={`/book-visit?vehicle=${encodeURIComponent(vehicle.slug)}`}
        >
          <CalendarCheck size={20} /> رزرو بازدید
        </Link>
      )}
      <a className="vehicle-action" href={toTelephoneHref(phone)}>
        <Phone size={20} /> تماس مستقیم
      </a>
      <a
        className="vehicle-action vehicle-action--quiet"
        href={siteContact.social.whatsapp}
        target="_blank"
        rel="noreferrer"
      >
        <WhatsappLogo size={20} /> کانال واتساپ
      </a>
      <a
        className="vehicle-action vehicle-action--quiet"
        href={siteContact.social.telegram}
        target="_blank"
        rel="noreferrer"
      >
        <PaperPlaneTilt size={20} /> تلگرام
      </a>
      <a
        className="vehicle-action vehicle-action--quiet"
        href={vehicle.instagramUrl || siteContact.social.instagram}
        target="_blank"
        rel="noreferrer"
      >
        <InstagramLogo size={20} /> اینستاگرام
      </a>
    </div>
  );
}

export function VehicleDetailExperience({
  vehicle,
  related,
}: {
  vehicle: Vehicle;
  related: readonly Vehicle[];
}) {
  const name = getVehicleDisplayName(vehicle);
  const keySpecs: SpecItem[] = [
    { label: "سال", value: vehicle.year },
    { label: "کارکرد", value: formatVehicleMileage(vehicle.mileage) },
    { label: "کلاس بدنه", value: vehicle.bodyType },
    { label: "شرایط", value: vehicle.condition },
  ];
  const technical: SpecItem[] = [
    { label: "پیشرانه", value: vehicle.engine },
    {
      label: "قدرت",
      value: vehicle.horsepower
        ? `${new Intl.NumberFormat("fa-IR").format(vehicle.horsepower)} اسب بخار`
        : undefined,
    },
    { label: "گیربکس", value: vehicle.transmission },
    { label: "محور محرک", value: vehicle.drivetrain },
    { label: "سوخت", value: vehicle.fuelType },
    { label: "نوع پلاک", value: vehicle.plateType },
  ];

  return (
    <main id="main-content" className="vehicle-detail-page">
      <article>
        <header className="vehicle-detail-hero">
          <div className="vehicle-detail-hero__copy">
            <p className="font-technical" dir="ltr">
              AUTOSAFIR · PRIVATE VIEW
            </p>
            <VehicleStatusBadge status={vehicle.status} />
            <h1 dir="ltr">
              {vehicle.brand}
              <span>{vehicle.model}</span>
              {vehicle.trim ? <small>{vehicle.trim}</small> : null}
            </h1>
            <p className="vehicle-detail-hero__year font-technical" dir="ltr">
              {vehicle.year} · {formatVehicleMileage(vehicle.mileage)}
            </p>
            {vehicle.description ? (
              <p className="vehicle-detail-hero__description">
                {vehicle.description}
              </p>
            ) : null}
          </div>
          <section
            className="vehicle-detail-hero__gallery"
            aria-label={`گالری تصویر و ویدیوی ${name}`}
          >
            <VehicleGallery media={vehicle.media} vehicleName={name} />
          </section>
        </header>

        {vehicle.status === "SOLD" ? (
          <aside className="vehicle-sold-note">
            <span className="font-technical" dir="ltr">
              SOLD ARCHIVE
            </span>
            <p>
              این خودرو فروخته شده و برای حفظ آرشیو مجموعه همچنان قابل مشاهده
              است.
            </p>
          </aside>
        ) : null}

        <section
          className="vehicle-detail-section vehicle-detail-section--specs"
          aria-labelledby="key-specs-title"
        >
          <div className="vehicle-detail-section__heading">
            <span className="font-technical" dir="ltr">
              01 · AT A GLANCE
            </span>
            <h2 id="key-specs-title">مشخصات کلیدی</h2>
          </div>
          <DetailList items={keySpecs} />
        </section>

        <div className="vehicle-detail-duo">
          <section
            className="vehicle-detail-section"
            aria-labelledby="colors-title"
          >
            <div className="vehicle-detail-section__heading">
              <span className="font-technical" dir="ltr">
                02 · MATERIAL
              </span>
              <h2 id="colors-title">نمای بیرونی و درون کابین</h2>
            </div>
            <DetailList
              items={[
                { label: "رنگ بدنه", value: vehicle.exteriorColor },
                { label: "رنگ کابین", value: vehicle.interiorColor },
              ]}
            />
          </section>
          <section
            className="vehicle-detail-section"
            aria-labelledby="technical-title"
          >
            <div className="vehicle-detail-section__heading">
              <span className="font-technical" dir="ltr">
                03 · ENGINEERING
              </span>
              <h2 id="technical-title">مشخصات فنی</h2>
            </div>
            <DetailList items={technical} />
          </section>
        </div>

        <section
          className="vehicle-detail-section"
          aria-labelledby="features-title"
        >
          <div className="vehicle-detail-section__heading">
            <span className="font-technical" dir="ltr">
              04 · FEATURES
            </span>
            <h2 id="features-title">امکانات</h2>
          </div>
          {vehicle.features.length ? (
            <ul className="vehicle-feature-list">
              {vehicle.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          ) : (
            <p className="vehicle-detail__empty-copy">
              فهرست امکانات این رکورد نمایشی هنوز تکمیل نشده است.
            </p>
          )}
        </section>

        <section
          className="vehicle-detail-section vehicle-detail-contact"
          aria-labelledby="contact-title"
        >
          <div className="vehicle-detail-section__heading">
            <span className="font-technical" dir="ltr">
              05 · PRIVATE VIEWING
            </span>
            <h2 id="contact-title">گفت‌وگو و بازدید</h2>
            <p>
              {vehicle.advisor
                ? `مشاور این خودرو: ${vehicle.advisor.name}`
                : "برای هماهنگی و دریافت اطلاعات تکمیلی از مسیر دلخواه با اتو سفیر تماس بگیرید."}
            </p>
          </div>
          <div className="vehicle-advisor" aria-label="مشاور و هماهنگی خودرو">
            <span>{vehicle.advisor ? "مشاور خودرو" : "هماهنگی عمومی"}</span>
            <strong>{vehicle.advisor?.name || "اتو سفیر"}</strong>
            <a
              href={toTelephoneHref(
                vehicle.advisor?.phone || siteContact.phones[0],
              )}
              dir="ltr"
            >
              {vehicle.advisor?.phone || siteContact.phones[0]}
            </a>
          </div>
          <ContactActions vehicle={vehicle} />
          <div className="vehicle-secondary-actions">
            <Link
              className="vehicle-action vehicle-action--quiet"
              href={`/compare?add=${encodeURIComponent(vehicle.slug)}`}
              data-compare-slug={vehicle.slug}
            >
              <Copy size={20} /> افزودن به مقایسه
            </Link>
            <ShareButton vehicle={vehicle} />
          </div>
        </section>
      </article>

      <section className="vehicle-related" aria-labelledby="related-title">
        <div className="vehicle-detail-section__heading">
          <span className="font-technical" dir="ltr">
            CURATED NEXT
          </span>
          <h2 id="related-title">خودروهای مرتبط</h2>
        </div>
        {related.length ? (
          <div className="vehicle-grid">
            {related.map((item) => (
              <VehicleCard key={item.id} vehicle={item} />
            ))}
          </div>
        ) : (
          <div className="vehicle-related__empty">
            <p>در حال حاضر خودروی مرتبط دیگری در دموی محلی ثبت نشده است.</p>
            <Link href="/collection">مشاهده مجموعه کامل</Link>
          </div>
        )}
      </section>
    </main>
  );
}

export function VehicleDetailRoute() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() || "";
  const vehicles = useVehicleStore((state) => state.vehicles);
  const hydrated = useVehicleStore((state) => state.hydrated);
  const hydrate = useVehicleStore((state) => state.hydrate);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);

  const vehicle = useMemo(
    () => findVehicleBySlug(vehicles, slug),
    [slug, vehicles],
  );
  const related = useMemo(
    () => (vehicle ? getRelatedVehicles(vehicle, vehicles) : []),
    [vehicle, vehicles],
  );

  if (!hydrated) return <DetailLoading />;
  if (!vehicle) return <DetailNotFound missingSlug={!slug} />;
  return <VehicleDetailExperience vehicle={vehicle} related={related} />;
}
