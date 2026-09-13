"use client";

import { Check, Flask, Play, Warning } from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";

import { AdminPageHeader } from "./admin-page-header";
import {
  DemoPublishingProvider,
  type PublishingProgress,
  type PublishingStep,
} from "@/features/publishing/publishing-provider";

const channels = [
  {
    name: "Website",
    status: "READY",
    label: "آماده",
    detail: "خواندن از فروشگاه محلی",
  },
  {
    name: "Divar",
    status: "DEMO",
    label: "دمو",
    detail: "بدون اتصال یا انتشار",
  },
  {
    name: "Bama",
    status: "DEMO",
    label: "دمو",
    detail: "بدون اتصال یا انتشار",
  },
  {
    name: "Instagram",
    status: "DEMO",
    label: "دمو",
    detail: "بدون token یا انتشار",
  },
  {
    name: "n8n",
    status: "PLANNED",
    label: "برنامه آینده",
    detail: "فقط در معماری Production",
  },
] as const;

const steps: readonly PublishingStep[] = [
  "PREPARING",
  "OPTIMIZING",
  "WEBSITE",
  "DIVAR",
  "BAMA",
  "INSTAGRAM",
  "COMPLETE",
];
const labels: Record<PublishingStep, string> = {
  PREPARING: "آماده‌سازی خودرو",
  OPTIMIZING: "بهینه‌سازی تصاویر",
  WEBSITE: "وب‌سایت",
  DIVAR: "دیوار",
  BAMA: "باما",
  INSTAGRAM: "اینستاگرام",
  COMPLETE: "پایان",
};

export function AdminIntegrations() {
  const provider = useRef(new DemoPublishingProvider());
  const [history, setHistory] = useState<PublishingProgress[]>([]);
  const [running, setRunning] = useState(false);
  const [fail, setFail] = useState(false);
  const latest = useMemo(
    () => new Map(history.map((item) => [item.step, item])),
    [history],
  );

  async function simulate() {
    setHistory([]);
    setRunning(true);
    try {
      await provider.current.simulate(
        (progress) =>
          setHistory((current) => [
            ...current.filter((item) => item.step !== progress.step),
            progress,
          ]),
        fail ? { failAt: "BAMA" } : undefined,
      );
    } catch {
      // The error is intentionally represented in the visible step state.
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="admin-page" id="main-content">
      <AdminPageHeader
        eyebrow="PUBLISHING LAB / SIMULATION"
        title="یکپارچه‌سازی‌ها"
        description="پیش‌نمایش جریان آینده؛ هیچ درخواست شبکه، کلید API یا انتشار واقعی در این دمو وجود ندارد."
      />
      <section
        className="admin-channel-grid"
        aria-label="وضعیت کانال‌های نمایشی"
      >
        {channels.map((channel) => (
          <article key={channel.name} data-status={channel.status}>
            <span className="font-technical">{channel.name}</span>
            <strong>{channel.label}</strong>
            <p>{channel.detail}</p>
            <i aria-hidden="true" />
          </article>
        ))}
      </section>
      <section className="admin-publishing-lab">
        <header>
          <div>
            <p className="admin-kicker font-technical">DEMO ADAPTER</p>
            <h2>شبیه‌سازی مسیر انتشار</h2>
            <p>
              اجرای زمان‌بندی‌شده فقط در حافظه همین صفحه؛ قابل تکرار و بدون side
              effect.
            </p>
          </div>
          <div className="admin-simulation-controls">
            <label>
              <input
                type="checkbox"
                checked={fail}
                onChange={(event) => setFail(event.target.checked)}
                disabled={running}
              />{" "}
              شبیه‌سازی خطا در باما
            </label>
            <button
              type="button"
              className="admin-primary-button"
              onClick={simulate}
              disabled={running}
            >
              <Play size={18} />{" "}
              {running ? "در حال شبیه‌سازی…" : "اجرای شبیه‌سازی"}
            </button>
          </div>
        </header>
        <ol className="admin-pipeline">
          {steps.map((step, index) => {
            const progress = latest.get(step);
            return (
              <li key={step} data-state={progress?.state ?? "IDLE"}>
                <span className="admin-pipeline__index font-technical">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong>{labels[step]}</strong>
                  <small className="font-technical">{step}</small>
                </div>
                <span className="admin-pipeline__state">
                  {progress?.state === "COMPLETE" ? (
                    <Check size={18} />
                  ) : progress?.state === "FAILED" ? (
                    <Warning size={18} />
                  ) : progress?.state === "ACTIVE" ? (
                    <Flask size={18} />
                  ) : (
                    "—"
                  )}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="admin-simulation-disclaimer">
          <Warning size={18} /> نمایش این وضعیت به معنای اتصال یا موفقیت انتشار
          در هیچ سرویس واقعی نیست.
        </p>
      </section>
    </main>
  );
}
