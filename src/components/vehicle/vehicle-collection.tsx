"use client";

import { CarProfile } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";

import {
  countActiveFilters,
  EMPTY_COLLECTION_FILTERS,
  filterVehicles,
  type CollectionFilters,
  type QuickStatus,
} from "@/features/vehicles/collection-filters";
import { useVehicleStore } from "@/stores/vehicle-store";
import type { Vehicle } from "@/types/vehicle";

import {
  CollectionFilters as FilterPanel,
  CollectionSearch,
} from "./collection-filters";
import { VehicleCard } from "./vehicle-card";

const quickFilters: { value: QuickStatus; label: string }[] = [
  { value: "ALL", label: "همه" },
  { value: "AVAILABLE", label: "موجود" },
  { value: "SOLD", label: "فروخته‌شده" },
];

export function CollectionExperience({
  vehicles,
  hydrated = true,
}: {
  vehicles: readonly Vehicle[];
  hydrated?: boolean;
}) {
  const [filters, setFilters] = useState<CollectionFilters>(
    EMPTY_COLLECTION_FILTERS,
  );
  const results = useMemo(
    () => filterVehicles(vehicles, filters),
    [vehicles, filters],
  );
  const activeCount = countActiveFilters(filters);

  const changeFilter = <K extends keyof CollectionFilters>(
    key: K,
    value: CollectionFilters[K],
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "status" ? { quickStatus: "ALL" as const } : {}),
    }));
  };

  const setQuickStatus = (quickStatus: QuickStatus) => {
    setFilters((current) => ({ ...current, quickStatus, status: "ALL" }));
  };

  const reset = () => setFilters(EMPTY_COLLECTION_FILTERS);

  return (
    <div className="collection-layout">
      <div className="collection-mobile-tools">
        <CollectionSearch
          value={filters.search}
          onChange={(value) => changeFilter("search", value)}
        />
        <FilterPanel
          vehicles={vehicles}
          filters={filters}
          activeCount={activeCount}
          onChange={changeFilter}
          onReset={reset}
        />
      </div>

      <section
        className="collection-results"
        aria-labelledby="collection-results-heading"
        aria-busy={!hydrated}
      >
        <div className="collection-results__topline">
          <div>
            <p className="font-technical" dir="ltr">
              THE COLLECTION
            </p>
            <h2 id="collection-results-heading">انتخاب خودرو</h2>
          </div>
          <p aria-live="polite">
            <strong className="latin-numerals">{results.length}</strong> خودرو
          </p>
        </div>

        <div className="collection-quick-filters" aria-label="فیلتر سریع وضعیت">
          {quickFilters.map((item) => (
            <button
              type="button"
              key={item.value}
              aria-pressed={
                filters.quickStatus === item.value && filters.status === "ALL"
              }
              onClick={() => setQuickStatus(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {!hydrated ? (
          <div className="collection-loading" role="status">
            در حال آماده‌سازی مجموعه…
          </div>
        ) : results.length > 0 ? (
          <div className="vehicle-grid">
            {results.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="collection-empty">
            <CarProfile size={38} weight="thin" aria-hidden="true" />
            <h3>خودرویی با این انتخاب پیدا نشد</h3>
            <p>فیلترها را تغییر دهید یا مجموعه کامل را دوباره ببینید.</p>
            <button type="button" onClick={reset}>
              نمایش همه خودروها
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export function VehicleCollection() {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const hydrated = useVehicleStore((state) => state.hydrated);
  const hydrate = useVehicleStore((state) => state.hydrate);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);

  return <CollectionExperience vehicles={vehicles} hydrated={hydrated} />;
}
