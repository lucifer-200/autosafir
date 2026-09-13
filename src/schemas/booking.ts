import { z } from "zod";

import { SHOWROOM_BRANCHES } from "@/data/branches";

import { iranianPhoneSchema } from "./sell-car";

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} را وارد کنید.`).max(160);

export function getLocalDateInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

const branchIds = new Set(SHOWROOM_BRANCHES.map((branch) => branch.id));

export function createBookingSchema(today = getLocalDateInputValue()) {
  return z.object({
    vehicle: requiredText("خودرو"),
    name: requiredText("نام و نام خانوادگی"),
    phone: iranianPhoneSchema,
    branch: requiredText("شعبه").refine(
      (value) => branchIds.has(value),
      "شعبه معتبر انتخاب کنید.",
    ),
    date: z
      .string()
      .min(1, "تاریخ بازدید را انتخاب کنید.")
      .refine(isCalendarDate, "تاریخ معتبر انتخاب کنید.")
      .refine((value) => value >= today, "تاریخ بازدید نمی‌تواند گذشته باشد."),
    time: z
      .string()
      .min(1, "زمان بازدید را انتخاب کنید.")
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "زمان معتبر انتخاب کنید."),
    note: z.string().trim().max(800, "یادداشت نباید بیشتر از ۸۰۰ نویسه باشد."),
  });
}

export type BookingFormValues = z.infer<ReturnType<typeof createBookingSchema>>;
