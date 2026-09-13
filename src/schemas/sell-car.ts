import { z } from "zod";

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} را وارد کنید.`).max(120);

export const iranianPhoneSchema = z
  .string()
  .trim()
  .min(1, "شماره تماس را وارد کنید.")
  .regex(/^(?:\+98|0098|98|0)?9\d{9}$/, "شماره موبایل معتبر وارد کنید.");

export const sellCarSchema = z.object({
  brand: requiredText("برند"),
  model: requiredText("مدل"),
  year: z
    .number({ error: "سال ساخت را وارد کنید." })
    .int("سال ساخت باید عدد صحیح باشد.")
    .min(1300, "سال ساخت معتبر نیست.")
    .max(2100, "سال ساخت معتبر نیست."),
  mileage: z
    .number({ error: "کارکرد را وارد کنید." })
    .int("کارکرد باید عدد صحیح باشد.")
    .min(0, "کارکرد نمی‌تواند منفی باشد.")
    .max(2_000_000, "کارکرد واردشده معتبر نیست."),
  exteriorColor: requiredText("رنگ بدنه"),
  interiorColor: requiredText("رنگ کابین"),
  condition: z.enum(["excellent", "good", "needs-review"], {
    error: "وضعیت خودرو را انتخاب کنید.",
  }),
  description: z
    .string()
    .trim()
    .max(1200, "توضیحات نباید بیشتر از ۱۲۰۰ نویسه باشد."),
  name: requiredText("نام و نام خانوادگی"),
  phone: iranianPhoneSchema,
});

export type SellCarFormValues = z.infer<typeof sellCarSchema>;
