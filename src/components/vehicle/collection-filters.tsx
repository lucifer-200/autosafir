"use client";

import { FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

import {
  MILEAGE_RANGES,
  getFacetOptions,
  type CollectionFilters as CollectionFilterState,
} from "@/features/vehicles/collection-filters";
import type { Vehicle } from "@/types/vehicle";

type FilterChange = <K extends keyof CollectionFilterState>(
  key: K,
  value: CollectionFilterState[K],
) => void;

const fieldLabels = {
  brand: "برند",
  model: "مدل",
  year: "سال",
  bodyType: "کلاس بدنه",
  fuelType: "سوخت",
  transmission: "گیربکس",
  condition: "وضعیت بدنه",
  plateType: "نوع پلاک",
} as const;

function FilterFields({
  vehicles,
  filters,
  onChange,
  idPrefix,
}: {
  vehicles: readonly Vehicle[];
  filters: CollectionFilterState;
  onChange: FilterChange;
  idPrefix: string;
}) {
  const fieldKeys = Object.keys(fieldLabels) as (keyof typeof fieldLabels)[];

  return (
    <div className="collection-filter-fields">
      <label htmlFor={`${idPrefix}-status`}>
        <span>وضعیت موجودی</span>
        <select
          id={`${idPrefix}-status`}
          value={filters.status}
          onChange={(event) =>
            onChange(
              "status",
              event.target.value as CollectionFilterState["status"],
            )
          }
        >
          <option value="ALL">همه وضعیت‌ها</option>
          <option value="AVAILABLE">موجود</option>
          <option value="RESERVED">رزرو شده</option>
          <option value="SOLD">فروخته شده</option>
        </select>
      </label>

      {fieldKeys.map((key) => (
        <label key={key} htmlFor={`${idPrefix}-${key}`}>
          <span>{fieldLabels[key]}</span>
          <select
            id={`${idPrefix}-${key}`}
            value={filters[key]}
            onChange={(event) => onChange(key, event.target.value)}
          >
            <option value="">همه</option>
            {getFacetOptions(vehicles, key).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ))}

      <label htmlFor={`${idPrefix}-mileage`}>
        <span>کارکرد</span>
        <select
          id={`${idPrefix}-mileage`}
          value={filters.mileage}
          onChange={(event) => onChange("mileage", event.target.value)}
        >
          <option value="">همه</option>
          {MILEAGE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function CollectionFilters({
  vehicles,
  filters,
  activeCount,
  onChange,
  onReset,
}: {
  vehicles: readonly Vehicle[];
  filters: CollectionFilterState;
  activeCount: number;
  onChange: FilterChange;
  onReset(): void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const id = useId().replaceAll(":", "");

  useEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), select:not([disabled]), input:not([disabled]), [href]",
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
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="collection-filter-trigger touch-target"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <FunnelSimple size={19} aria-hidden="true" />
        فیلترها
        {activeCount > 0 ? (
          <span className="latin-numerals">{activeCount}</span>
        ) : null}
      </button>

      <aside className="collection-filter-desktop" aria-label="فیلتر خودروها">
        <div className="collection-filter-heading">
          <div>
            <span className="font-technical" dir="ltr">
              REFINE
            </span>
            <h2>فیلتر خودروها</h2>
          </div>
          {activeCount > 0 ? (
            <button type="button" onClick={onReset}>
              پاک کردن
            </button>
          ) : null}
        </div>
        <FilterFields
          vehicles={vehicles}
          filters={filters}
          onChange={onChange}
          idPrefix={`desktop-${id}`}
        />
      </aside>

      {isOpen ? (
        <div
          className="collection-sheet-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            className="collection-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-sheet-title`}
          >
            <div className="collection-sheet__handle" aria-hidden="true" />
            <header>
              <div>
                <span className="font-technical" dir="ltr">
                  REFINE
                </span>
                <h2 id={`${id}-sheet-title`}>فیلتر خودروها</h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="touch-target"
                aria-label="بستن فیلترها"
                onClick={() => setIsOpen(false)}
              >
                <X size={22} aria-hidden="true" />
              </button>
            </header>
            <div className="collection-sheet__content">
              <FilterFields
                vehicles={vehicles}
                filters={filters}
                onChange={onChange}
                idPrefix={`mobile-${id}`}
              />
            </div>
            <footer>
              <button
                type="button"
                className="collection-reset"
                onClick={onReset}
                disabled={activeCount === 0}
              >
                پاک کردن همه
              </button>
              <button
                type="button"
                className="collection-apply"
                onClick={() => setIsOpen(false)}
              >
                نمایش نتیجه
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function CollectionSearch({
  value,
  onChange,
}: {
  value: string;
  onChange(value: string): void;
}) {
  return (
    <label className="collection-search">
      <span className="sr-only">جستجوی برند یا مدل</span>
      <MagnifyingGlass size={20} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="جستجوی برند یا مدل"
      />
    </label>
  );
}
