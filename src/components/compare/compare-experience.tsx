"use client";

import { Check, Plus, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

import {
  COMPARE_FIELDS,
  fieldHasDifferences,
} from "@/features/compare/compare-fields";
import { VEHICLE_STATUS_LABELS } from "@/features/vehicles/status";
import { MAX_COMPARE_VEHICLES } from "@/repositories/compare-selection-repository";
import { useCompareStore } from "@/stores/compare-store";
import { useVehicleStore } from "@/stores/vehicle-store";
import type { Vehicle } from "@/types/vehicle";

function VehicleChoice({
  vehicle,
  selected,
  disabled,
  onToggle,
}: {
  vehicle: Vehicle;
  selected: boolean;
  disabled: boolean;
  onToggle(): void;
}) {
  const name = `${vehicle.brand} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}`;
  return (
    <button
      type="button"
      className="compare-choice"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
    >
      <span className="compare-choice__mark" aria-hidden="true">
        {selected ? <Check size={16} /> : <Plus size={16} />}
      </span>
      <span>
        <strong dir="ltr">{name}</strong>
        <small>
          {vehicle.year} · {VEHICLE_STATUS_LABELS[vehicle.status]}
        </small>
      </span>
    </button>
  );
}

function CompareEmpty({ count }: { count: number }) {
  return (
    <section className="compare-empty" aria-labelledby="compare-empty-title">
      <span className="font-technical" dir="ltr">
        {count === 0 ? "NO SELECTION" : "ONE MORE"}
      </span>
      <h2 id="compare-empty-title">
        {count === 0
          ? "مقایسه را با انتخاب خودرو آغاز کنید"
          : "یک خودرو دیگر انتخاب کنید"}
      </h2>
      <p>
        {count === 0
          ? "دو یا سه خودرو را کنار هم ببینید؛ انتخاب شما روی همین دستگاه حفظ می‌شود."
          : "برای نمایش تفاوت‌ها، حداقل دو خودرو لازم است."}
      </p>
      <Link href="/collection">رفتن به مجموعه خودروها</Link>
    </section>
  );
}

export function CompareExperience({
  vehicles,
  initialAdd,
  inventoryHydrated = true,
}: {
  vehicles: readonly Vehicle[];
  initialAdd?: string;
  inventoryHydrated?: boolean;
}) {
  const slugs = useCompareStore((state) => state.slugs);
  const hydrated = useCompareStore((state) => state.hydrated);
  const hydrate = useCompareStore((state) => state.hydrate);
  const add = useCompareStore((state) => state.add);
  const remove = useCompareStore((state) => state.remove);
  const replace = useCompareStore((state) => state.replace);
  const clear = useCompareStore((state) => state.clear);
  const handledAdd = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrate, hydrated]);

  useEffect(() => {
    if (!hydrated || !inventoryHydrated) return;
    const valid = slugs.filter((slug) =>
      vehicles.some((vehicle) => vehicle.slug === slug),
    );
    if (valid.length !== slugs.length) replace(valid);
  }, [hydrated, inventoryHydrated, replace, slugs, vehicles]);

  useEffect(() => {
    if (
      !hydrated ||
      !inventoryHydrated ||
      !initialAdd ||
      handledAdd.current === initialAdd
    )
      return;
    handledAdd.current = initialAdd;
    if (vehicles.some((vehicle) => vehicle.slug === initialAdd))
      add(initialAdd);
  }, [add, hydrated, initialAdd, inventoryHydrated, vehicles]);

  const selected = useMemo(
    () =>
      slugs
        .map((slug) => vehicles.find((vehicle) => vehicle.slug === slug))
        .filter((vehicle): vehicle is Vehicle => Boolean(vehicle)),
    [slugs, vehicles],
  );
  const full = selected.length >= MAX_COMPARE_VEHICLES;
  const requestedVehicleExists = initialAdd
    ? vehicles.some((vehicle) => vehicle.slug === initialAdd)
    : true;
  const notice = !requestedVehicleExists
    ? "خودروی درخواستی در مجموعه پیدا نشد."
    : initialAdd && !slugs.includes(initialAdd) && full
      ? "برای افزودن خودرو، ابتدا یکی از سه انتخاب را حذف کنید."
      : full
        ? "حداکثر سه خودرو انتخاب شده است."
        : `${MAX_COMPARE_VEHICLES - selected.length} جای خالی`;

  return (
    <main id="main-content" className="compare-page">
      <header className="compare-hero">
        <div>
          <p className="font-technical" dir="ltr">
            05 · COMPARE LEDGER
          </p>
          <h1>مقایسه خودروها</h1>
        </div>
        <div className="compare-hero__count">
          <strong className="font-technical">{selected.length}</strong>
          <span>از {MAX_COMPARE_VEHICLES} خودرو</span>
        </div>
      </header>

      <section
        className="compare-selector"
        aria-labelledby="compare-selector-title"
      >
        <div className="compare-selector__heading">
          <div>
            <span className="font-technical" dir="ltr">
              SELECT INVENTORY
            </span>
            <h2 id="compare-selector-title">انتخاب خودرو</h2>
          </div>
          {selected.length ? (
            <button type="button" onClick={clear}>
              پاک‌کردن همه
            </button>
          ) : null}
        </div>
        <div
          className="compare-choices"
          role="group"
          aria-label="انتخاب خودروهای مقایسه"
        >
          {vehicles.map((vehicle) => {
            const isSelected = slugs.includes(vehicle.slug);
            return (
              <VehicleChoice
                key={vehicle.id}
                vehicle={vehicle}
                selected={isSelected}
                disabled={full && !isSelected}
                onToggle={() =>
                  isSelected ? remove(vehicle.slug) : add(vehicle.slug)
                }
              />
            );
          })}
        </div>
        <p className="compare-notice" role="status" aria-live="polite">
          {notice}
        </p>
      </section>

      {!hydrated || !inventoryHydrated ? (
        <div className="compare-loading" role="status">
          در حال بازیابی انتخاب‌ها…
        </div>
      ) : selected.length < 2 ? (
        <CompareEmpty count={selected.length} />
      ) : (
        <section
          className="compare-ledger"
          aria-labelledby="compare-table-title"
        >
          <div className="compare-ledger__heading">
            <span className="font-technical" dir="ltr">
              DETAIL BY DETAIL
            </span>
            <h2 id="compare-table-title">تفاوت‌ها در یک نگاه</h2>
            <p>برای دیدن ستون‌های بعدی، جدول را به چپ و راست بکشید.</p>
          </div>
          <div
            className="compare-table-wrap"
            tabIndex={0}
            aria-label="جدول مقایسه خودروها؛ قابل پیمایش افقی"
          >
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">مشخصات</th>
                  {selected.map((vehicle) => (
                    <th scope="col" key={vehicle.id}>
                      <button
                        type="button"
                        onClick={() => remove(vehicle.slug)}
                        aria-label={`حذف ${vehicle.brand} ${vehicle.model} از مقایسه`}
                      >
                        <X size={18} />
                      </button>
                      <strong dir="ltr">
                        {vehicle.brand}
                        <span>{vehicle.model}</span>
                      </strong>
                      <small>{VEHICLE_STATUS_LABELS[vehicle.status]}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_FIELDS.map((field) => {
                  const different = fieldHasDifferences(field, selected);
                  return (
                    <tr key={field.key}>
                      <th scope="row">
                        {field.label}
                        {different ? <span>متفاوت</span> : null}
                      </th>
                      {selected.map((vehicle) => (
                        <td
                          key={vehicle.id}
                          data-different={different || undefined}
                          data-status={
                            field.key === "status" ? vehicle.status : undefined
                          }
                        >
                          {field.value(vehicle)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="compare-ledger__legend">
            <span aria-hidden="true" /> زمینهٔ شامپاینی بسیار ملایم، تفاوت را
            نشان می‌دهد.
          </p>
        </section>
      )}
    </main>
  );
}

export function CompareRoute() {
  const searchParams = useSearchParams();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const hydrated = useVehicleStore((state) => state.hydrated);
  const hydrate = useVehicleStore((state) => state.hydrate);
  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);
  return (
    <CompareExperience
      vehicles={vehicles}
      initialAdd={searchParams.get("add")?.trim() || undefined}
      inventoryHydrated={hydrated}
    />
  );
}
