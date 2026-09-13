import type { Metadata } from "next";

import { VehicleCollection } from "@/components/vehicle/vehicle-collection";

export const metadata: Metadata = {
  title: "مجموعه خودروها | دموی اتو سفیر",
  description: "نمایش آزمایشی مجموعه خودروها بدون درج قیمت.",
};

export default function CollectionPage() {
  return (
    <main id="main-content" className="collection-page">
      <header className="collection-hero">
        <p className="font-technical" dir="ltr">
          AUTOSAFIR · CURATED CARS
        </p>
        <h1>مجموعه خودروها</h1>
        <p>مرور آرام و دقیق خودروهای نمایشی در یک مجموعه یکپارچه.</p>
      </header>
      <VehicleCollection />
    </main>
  );
}
