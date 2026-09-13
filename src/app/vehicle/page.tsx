import type { Metadata } from "next";
import { Suspense } from "react";

import { VehicleDetailRoute } from "@/components/vehicle/vehicle-detail";

export const metadata: Metadata = {
  title: "جزئیات خودرو | دموی اتو سفیر",
  description: "نمایش جزئیات خودرو در دموی خصوصی اتو سفیر.",
};

export default function VehiclePage() {
  return (
    <Suspense
      fallback={<main id="main-content" className="vehicle-detail-page" />}
    >
      <VehicleDetailRoute />
    </Suspense>
  );
}
