import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingForm } from "@/components/forms/booking-form";

export const metadata: Metadata = {
  title: "رزرو بازدید | دموی اتو سفیر",
  description: "تجربه نمایشی هماهنگی بازدید خودرو؛ بدون ثبت یا ارسال واقعی.",
};

export default function BookVisitPage() {
  return (
    <main className="lead-page lead-page--booking">
      <header className="lead-hero">
        <div>
          <p className="font-technical">PRIVATE VIEWING · DEMO</p>
          <h1>رزرو بازدید</h1>
        </div>
        <p>
          خودرو، شعبه و زمان دلخواه را انتخاب کنید. برای هماهنگی واقعی، تماس
          مستقیم همیشه در دسترس است.
        </p>
      </header>
      <Suspense
        fallback={<p className="booking-loading">در حال آماده‌سازی فرم…</p>}
      >
        <BookingForm />
      </Suspense>
    </main>
  );
}
