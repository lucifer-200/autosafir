"use client";

import {
  ArrowDown,
  DownloadSimple,
  MagnifyingGlass,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { AdminPageHeader } from "./admin-page-header";
import { AdminStatus } from "./admin-status";
import { useVehicleStore } from "@/stores/vehicle-store";
import type { Vehicle, VehicleStatus } from "@/types/vehicle";

type SortKey = "newest" | "oldest" | "year-desc" | "name";

function matchesSearch(vehicle: Vehicle, search: string) {
  const term = search.trim().toLocaleLowerCase("fa");
  if (!term) return true;
  return [
    vehicle.brand,
    vehicle.model,
    vehicle.trim,
    vehicle.slug,
    String(vehicle.year),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("fa")
    .includes(term);
}

export function AdminVehicleList() {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const hydrate = useVehicleStore((state) => state.hydrate);
  const pending = useVehicleStore((state) => state.pending);
  const deleteVehicle = useVehicleStore((state) => state.deleteVehicle);
  const exportVehicles = useVehicleStore((state) => state.exportVehicles);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<VehicleStatus | "ALL">("ALL");
  const [sort, setSort] = useState<SortKey>("newest");
  const [deleting, setDeleting] = useState<Vehicle | null>(null);
  const [notice, setNotice] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => void hydrate(), [hydrate]);
  useEffect(() => {
    if (!deleting) return;
    cancelRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDeleting(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [deleting]);

  const filtered = useMemo(() => {
    const result = vehicles.filter(
      (vehicle) =>
        (status === "ALL" || vehicle.status === status) &&
        matchesSearch(vehicle, search),
    );
    return result.sort((a, b) => {
      if (sort === "name")
        return `${a.brand}${a.model}`.localeCompare(
          `${b.brand}${b.model}`,
          "fa",
        );
      if (sort === "year-desc") return b.year - a.year;
      const comparison = (b.updatedAt ?? b.createdAt).localeCompare(
        a.updatedAt ?? a.createdAt,
      );
      return sort === "oldest" ? -comparison : comparison;
    });
  }, [search, sort, status, vehicles]);

  async function downloadExport() {
    const json = await exportVehicles();
    const url = URL.createObjectURL(
      new Blob([json], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `autosafir-vehicles-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("خروجی معتبر JSON آماده شد.");
  }

  async function confirmDelete() {
    if (!deleting) return;
    await deleteVehicle(deleting.id);
    setNotice(`رکورد ${deleting.brand} ${deleting.model} حذف شد.`);
    setDeleting(null);
  }

  return (
    <main className="admin-page" id="main-content">
      <AdminPageHeader
        eyebrow="VEHICLE LEDGER"
        title="مدیریت خودروها"
        description={`${vehicles.length.toLocaleString("fa-IR")} رکورد در فروشگاه محلی مشترک`}
        actions={
          <>
            <button
              type="button"
              className="admin-secondary-button"
              onClick={downloadExport}
            >
              <DownloadSimple size={18} /> خروجی JSON
            </button>
            <Link className="admin-primary-button" href="/admin/vehicles/new/">
              <Plus size={18} /> افزودن خودرو
            </Link>
          </>
        }
      />
      {notice ? (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      ) : null}
      <section
        className="admin-list-toolbar"
        aria-label="جستجو و پالایش خودروها"
      >
        <label className="admin-search">
          <span className="sr-only">جستجوی خودرو</span>
          <MagnifyingGlass size={19} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="برند، مدل، سال یا اسلاگ…"
          />
        </label>
        <label>
          <span>وضعیت</span>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as VehicleStatus | "ALL")
            }
          >
            <option value="ALL">همه وضعیت‌ها</option>
            <option value="AVAILABLE">موجود</option>
            <option value="RESERVED">رزرو شده</option>
            <option value="SOLD">فروخته شده</option>
          </select>
        </label>
        <label>
          <span>ترتیب</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
          >
            <option value="newest">آخرین تغییر</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="year-desc">سال ساخت</option>
            <option value="name">نام خودرو</option>
          </select>
        </label>
        <span className="admin-result-count font-technical">
          {filtered.length.toString().padStart(2, "0")} /{" "}
          {vehicles.length.toString().padStart(2, "0")}
        </span>
      </section>
      <section className="admin-vehicle-ledger" aria-label="فهرست خودروها">
        <div className="admin-ledger-head font-technical">
          <span>VEHICLE</span>
          <span>YEAR / KM</span>
          <span>STATUS</span>
          <span>ACTIONS</span>
        </div>
        {filtered.length ? (
          <ol>
            {filtered.map((vehicle, index) => (
              <li key={vehicle.id}>
                <span className="admin-ledger-index font-technical">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="admin-ledger-name">
                  <strong dir="ltr">
                    {vehicle.brand} {vehicle.model} {vehicle.trim}
                  </strong>
                  <small className="font-technical" dir="ltr">
                    {vehicle.slug}
                  </small>
                </div>
                <div className="admin-ledger-spec font-technical">
                  <span>{vehicle.year}</span>
                  <small>{vehicle.mileage.toLocaleString("en-US")} KM</small>
                </div>
                <AdminStatus status={vehicle.status} />
                <div className="admin-ledger-actions">
                  <Link href={`/admin/vehicles/edit/?id=${vehicle.id}`}>
                    ویرایش
                  </Link>
                  <button
                    type="button"
                    aria-label={`حذف ${vehicle.brand} ${vehicle.model}`}
                    onClick={() => setDeleting(vehicle)}
                  >
                    <Trash size={17} />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="admin-empty">
            <ArrowDown size={25} />
            <p>رکوردی با این معیارها پیدا نشد.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("ALL");
              }}
            >
              پاک‌کردن فیلترها
            </button>
          </div>
        )}
      </section>
      {deleting ? (
        <div
          className="admin-dialog-layer"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDeleting(null);
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            className="admin-dialog"
          >
            <span className="admin-kicker font-technical">
              DESTRUCTIVE ACTION
            </span>
            <h2 id="delete-title">حذف رکورد خودرو؟</h2>
            <p id="delete-description">
              «{deleting.brand} {deleting.model}» از فروشگاه محلی و بلافاصله از
              سایت عمومی حذف می‌شود. این عمل با Reset Demo Data قابل بازگردانی
              است فقط اگر رکورد در seed باشد.
            </p>
            <div>
              <button
                ref={cancelRef}
                type="button"
                className="admin-secondary-button"
                onClick={() => setDeleting(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className="admin-danger-button"
                disabled={pending}
                onClick={confirmDelete}
              >
                {pending ? "در حال حذف…" : "حذف قطعی رکورد"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
