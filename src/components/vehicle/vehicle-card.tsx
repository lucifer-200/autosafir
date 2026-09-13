import Link from "next/link";

import type { Vehicle } from "@/types/vehicle";

import { VehicleStatusBadge } from "./vehicle-status-badge";

function formatMileage(value: number) {
  if (value === 0) return "صفر کیلومتر";
  return `${new Intl.NumberFormat("fa-IR").format(value)} کیلومتر`;
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const image = vehicle.media.find((item) => item.type === "IMAGE");
  const shortSpecs = [vehicle.bodyType, vehicle.transmission, vehicle.fuelType]
    .filter(Boolean)
    .slice(0, 2);

  return (
    <article className="vehicle-card" data-status={vehicle.status}>
      <Link
        className="vehicle-card__link"
        href={`/vehicle?slug=${encodeURIComponent(vehicle.slug)}`}
        aria-label={`مشاهده ${vehicle.brand} ${vehicle.model}`}
      >
        <div className="vehicle-card__media">
          {image ? (
            // Dynamic demo media may include local previews and cannot use the image optimizer.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={image.alt || `${vehicle.brand} ${vehicle.model}`}
            />
          ) : (
            <div className="vehicle-card__placeholder">
              {/* Shared atmospheric fallback; it does not represent this vehicle's model. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/navigation/showroom-portrait.png" alt="" />
              <span>تصویر اختصاصی موجود نیست</span>
            </div>
          )}
          <VehicleStatusBadge status={vehicle.status} />
        </div>

        <div className="vehicle-card__body">
          <div>
            <p className="vehicle-card__eyebrow font-technical" dir="ltr">
              {vehicle.brand} · {vehicle.year}
            </p>
            <h2 dir="ltr">
              {vehicle.model}
              {vehicle.trim ? <small>{vehicle.trim}</small> : null}
            </h2>
          </div>
          <span className="vehicle-card__arrow" aria-hidden="true">
            ↙
          </span>
          <dl>
            <div>
              <dt>کارکرد</dt>
              <dd>{formatMileage(vehicle.mileage)}</dd>
            </div>
            {shortSpecs.map((spec, index) => (
              <div key={`${spec}-${index}`}>
                <dt>{index === 0 ? "کلاس" : "مشخصات"}</dt>
                <dd>{spec}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Link>
    </article>
  );
}
