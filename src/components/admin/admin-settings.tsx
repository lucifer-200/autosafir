"use client";

import {
  ArrowClockwise,
  DownloadSimple,
  FileArrowUp,
  ShieldWarning,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { AdminPageHeader } from "./admin-page-header";
import { parsePersistedJson } from "@/repositories/vehicle-persistence";
import { useVehicleStore } from "@/stores/vehicle-store";

type Confirmation =
  { type: "reset" } | { type: "import"; json: string; count: number };

export function AdminSettings() {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const pending = useVehicleStore((state) => state.pending);
  const persistence = useVehicleStore((state) => state.persistence);
  const warning = useVehicleStore((state) => state.warning);
  const hydrate = useVehicleStore((state) => state.hydrate);
  const resetVehicles = useVehicleStore((state) => state.resetVehicles);
  const importVehicles = useVehicleStore((state) => state.importVehicles);
  const exportVehicles = useVehicleStore((state) => state.exportVehicles);
  const [confirmation, setConfirmation] = useState<Confirmation>();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => void hydrate(), [hydrate]);
  useEffect(() => {
    if (!confirmation) return;
    cancelRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setConfirmation(undefined);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [confirmation]);

  async function exportJson() {
    const json = await exportVehicles();
    const url = URL.createObjectURL(
      new Blob([json], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `autosafir-vehicles-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("خروجی JSON با نسخه schema در مرورگر آماده شد.");
  }

  async function inspectFile(file?: File) {
    setError("");
    setNotice("");
    if (!file) return;
    try {
      const json = await file.text();
      const candidate = parsePersistedJson(json);
      setConfirmation({
        type: "import",
        json,
        count: candidate.vehicles.length,
      });
    } catch {
      setError("فایل معتبر نیست. داده فعلی بدون تغییر باقی ماند.");
    }
  }

  async function confirmAction() {
    if (!confirmation) return;
    try {
      if (confirmation.type === "reset") {
        await resetVehicles();
        setNotice("داده‌های دمو از seed غیرقابل‌تغییر بازیابی شدند.");
      } else {
        await importVehicles(confirmation.json);
        setNotice(
          `${confirmation.count.toLocaleString("fa-IR")} رکورد معتبر جایگزین شد.`,
        );
      }
      setConfirmation(undefined);
    } catch {
      setError("عملیات انجام نشد و داده فعلی دست‌نخورده باقی ماند.");
      setConfirmation(undefined);
    }
  }

  return (
    <main className="admin-page" id="main-content">
      <AdminPageHeader
        eyebrow="DEMO DATA CONTROL"
        title="تنظیمات دمو"
        description="نسخه پشتیبان، بازیابی seed و ورود کنترل‌شده داده‌های خودرو."
      />
      {notice ? (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="admin-alert" role="alert">
          {error}
        </p>
      ) : null}
      <section className="admin-settings-grid">
        <article className="admin-setting-card">
          <DownloadSimple size={25} />
          <p className="admin-kicker font-technical">EXPORT</p>
          <h2>دریافت نسخه پشتیبان</h2>
          <p>
            تمام {vehicles.length.toLocaleString("fa-IR")} رکورد فعلی همراه نسخه
            schema و revision در JSON.
          </p>
          <button
            type="button"
            className="admin-secondary-button"
            onClick={exportJson}
          >
            دریافت فایل JSON
          </button>
        </article>
        <article className="admin-setting-card">
          <FileArrowUp size={25} />
          <p className="admin-kicker font-technical">VALIDATED IMPORT</p>
          <h2>ورود داده معتبر</h2>
          <p>
            فایل ابتدا به‌طور کامل اعتبارسنجی می‌شود؛ فقط پس از تأیید شما
            جایگزین خواهد شد.
          </p>
          <label className="admin-secondary-button">
            انتخاب فایل JSON
            <input
              type="file"
              accept="application/json,.json"
              onChange={(event) => void inspectFile(event.target.files?.[0])}
            />
          </label>
        </article>
        <article className="admin-setting-card admin-setting-card--danger">
          <ArrowClockwise size={25} />
          <p className="admin-kicker font-technical">IMMUTABLE SEED</p>
          <h2>بازنشانی داده دمو</h2>
          <p>تمام تغییرات محلی حذف و نسخه seed اولیه دوباره بارگذاری می‌شود.</p>
          <button
            type="button"
            className="admin-danger-outline"
            onClick={() => setConfirmation({ type: "reset" })}
          >
            بازنشانی با تأیید
          </button>
        </article>
      </section>
      <section className="admin-storage-status">
        <ShieldWarning size={24} />
        <div>
          <p>وضعیت لایه داده</p>
          <strong>
            {persistence === "localStorage"
              ? "حافظه محلی مرورگر"
              : "حافظه موقت"}
          </strong>
        </div>
        <span className="font-technical">SCHEMA V1</span>
        {warning ? (
          <small>هشدار repository: {warning}</small>
        ) : (
          <small>هیچ کلید یا اتصال شبکه‌ای فعال نیست.</small>
        )}
      </section>
      {confirmation ? (
        <div className="admin-dialog-layer" role="presentation">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            className="admin-dialog"
          >
            <span className="admin-kicker font-technical">
              CONFIRM REPLACEMENT
            </span>
            <h2 id="confirmation-title">
              {confirmation.type === "reset"
                ? "بازنشانی داده‌های دمو؟"
                : "جایگزینی داده فعلی؟"}
            </h2>
            <p>
              {confirmation.type === "reset"
                ? "داده فعلی با seed اولیه جایگزین می‌شود. رکوردهای ساخته‌شده محلی قابل بازیابی نخواهند بود مگر قبلاً خروجی گرفته باشید."
                : `فایل با ${confirmation.count.toLocaleString("fa-IR")} رکورد معتبر است. پس از تأیید، کل موجودی فعلی جایگزین می‌شود.`}
            </p>
            <div>
              <button
                ref={cancelRef}
                type="button"
                className="admin-secondary-button"
                onClick={() => setConfirmation(undefined)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={
                  confirmation.type === "reset"
                    ? "admin-danger-button"
                    : "admin-primary-button"
                }
                disabled={pending}
                onClick={confirmAction}
              >
                {pending
                  ? "در حال اجرا…"
                  : confirmation.type === "reset"
                    ? "بازنشانی قطعی"
                    : "تأیید و جایگزینی"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
