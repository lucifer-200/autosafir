"use client";

import { ArrowLeft, CarProfile, Plus } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo } from "react";

import { AdminPageHeader } from "./admin-page-header";
import { AdminStatus } from "./admin-status";
import { useVehicleStore } from "@/stores/vehicle-store";

export function AdminDashboard() {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const hydrated = useVehicleStore((state) => state.hydrated);
  const hydrate = useVehicleStore((state) => state.hydrate);

  useEffect(() => void hydrate(), [hydrate]);

  const counts = useMemo(
    () => ({
      total: vehicles.length,
      available: vehicles.filter((item) => item.status === "AVAILABLE").length,
      reserved: vehicles.filter((item) => item.status === "RESERVED").length,
      sold: vehicles.filter((item) => item.status === "SOLD").length,
    }),
    [vehicles],
  );
  const recent = [...vehicles]
    .sort((a, b) =>
      (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt),
    )
    .slice(0, 5);

  return (
    <main className="admin-page" id="main-content">
      <AdminPageHeader
        eyebrow="INVENTORY CONTROL / 08"
        title="نمای کلی موجودی"
        description="تصویری دقیق از داده‌ای که همین حالا در سایت عمومی دیده می‌شود."
        actions={
          <Link href="/admin/vehicles/new/" className="admin-primary-button">
            <Plus size={18} /> افزودن خودرو
          </Link>
        }
      />
      {!hydrated ? (
        <p className="admin-loading">در حال خواندن موجودی محلی…</p>
      ) : null}
      <section className="admin-kpi-grid" aria-label="شاخص‌های موجودی">
        {[
          ["کل رکوردها", counts.total, "TOTAL"],
          ["موجود", counts.available, "AVAILABLE"],
          ["رزرو شده", counts.reserved, "RESERVED"],
          ["فروخته شده", counts.sold, "SOLD"],
        ].map(([label, count, code]) => (
          <article key={String(code)} data-code={code}>
            <span className="font-technical">{code}</span>
            <strong className="font-technical">
              {String(count).padStart(2, "0")}
            </strong>
            <p>{label}</p>
          </article>
        ))}
      </section>
      <section className="admin-dashboard-grid">
        <article className="admin-panel admin-recent">
          <header>
            <div>
              <p className="admin-kicker font-technical">RECENT RECORDS</p>
              <h2>آخرین خودروها</h2>
            </div>
            <Link href="/admin/vehicles/">
              مشاهده همه <ArrowLeft size={16} />
            </Link>
          </header>
          {recent.length ? (
            <ul>
              {recent.map((vehicle) => (
                <li key={vehicle.id}>
                  <span className="admin-record-mark">
                    <CarProfile size={19} />
                  </span>
                  <div>
                    <strong dir="ltr">
                      {vehicle.brand} {vehicle.model}
                    </strong>
                    <small className="font-technical">
                      {vehicle.year} · {vehicle.slug}
                    </small>
                  </div>
                  <AdminStatus status={vehicle.status} />
                  <Link
                    href={`/admin/vehicles/edit/?id=${vehicle.id}`}
                    aria-label={`ویرایش ${vehicle.brand} ${vehicle.model}`}
                  >
                    ویرایش
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="admin-empty">
              <p>هنوز خودرویی ثبت نشده است.</p>
              <Link href="/admin/vehicles/new/">ساخت اولین رکورد</Link>
            </div>
          )}
        </article>
        <aside className="admin-panel admin-operations-note">
          <p className="admin-kicker font-technical">LOCAL SOURCE OF TRUTH</p>
          <h2>یک فروشگاه، دو نما</h2>
          <p>
            تغییرات این پنل در repository محلی نسخه‌بندی‌شده ذخیره می‌شوند و
            مجموعه عمومی همان داده را می‌خواند.
          </p>
          <dl>
            <div>
              <dt>پایداری</dt>
              <dd>مرورگر محلی</dd>
            </div>
            <div>
              <dt>انتشار بیرونی</dt>
              <dd>غیرفعال / دمو</dd>
            </div>
            <div>
              <dt>نسخه داده</dt>
              <dd className="font-technical">Schema V1</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
