import type { Metadata } from "next";

import { SellCarForm } from "@/components/forms/sell-car-form";

export const metadata: Metadata = {
  title: "فروش خودرو | دموی اتو سفیر",
  description:
    "تجربه نمایشی ثبت مشخصات خودرو برای ارزیابی اولیه؛ بدون ارسال شبکه‌ای.",
};

export default function SellYourCarPage() {
  return (
    <main className="lead-page">
      <header className="lead-hero">
        <div>
          <p className="font-technical">PRIVATE CONCIERGE · DEMO</p>
          <h1>فروش خودرو</h1>
        </div>
        <p>
          مشخصات خودرو را در پنج گام آرام و دقیق مرور کنید. این تجربه صرفاً
          نمایشی است و هیچ داده‌ای ارسال نمی‌شود.
        </p>
      </header>
      <SellCarForm />
    </main>
  );
}
