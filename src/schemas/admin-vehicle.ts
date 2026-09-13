import { z } from "zod";

const currentYear = new Date().getFullYear();
const optionalShortText = z.string().trim().max(500);
const mediaSource = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;
    if (value.startsWith("/")) return !value.startsWith("//");
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "هر رسانه باید یک مسیر محلی مطلق یا نشانی HTTP(S) باشد.");

export const adminVehicleFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "اسلاگ الزامی است.")
    .max(240)
    .regex(
      /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u,
      "فقط حروف، عدد و خط تیره مجاز است.",
    ),
  brand: z.string().trim().min(1, "برند الزامی است.").max(200),
  model: z.string().trim().min(1, "مدل الزامی است.").max(200),
  trim: optionalShortText,
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "سال را چهار رقمی وارد کنید.")
    .refine(
      (value) => Number(value) >= 1886 && Number(value) <= currentYear + 2,
      "سال ساخت خارج از بازه معتبر است.",
    ),
  mileage: z
    .string()
    .trim()
    .regex(/^\d+$/, "کارکرد باید یک عدد نامنفی باشد.")
    .refine((value) => Number(value) <= 10_000_000, "کارکرد معتبر نیست."),
  exteriorColor: optionalShortText,
  interiorColor: optionalShortText,
  bodyType: optionalShortText,
  engine: optionalShortText,
  horsepower: z
    .string()
    .trim()
    .refine(
      (value) => !value || (/^\d+$/.test(value) && Number(value) <= 5_000),
      "توان موتور معتبر نیست.",
    ),
  transmission: optionalShortText,
  drivetrain: optionalShortText,
  fuelType: optionalShortText,
  condition: optionalShortText,
  plateType: optionalShortText,
  featuresText: z.string().max(10_000),
  description: z.string().trim().max(10_000),
  mediaText: z
    .string()
    .max(50_000)
    .superRefine((value, context) => {
      for (const [index, line] of value.split(/\r?\n/).entries()) {
        const result = mediaSource.safeParse(line);
        if (!result.success) {
          context.addIssue({
            code: "custom",
            message: `خط ${index + 1}: ${result.error.issues[0]?.message}`,
          });
          return;
        }
      }
    }),
  status: z.enum(["AVAILABLE", "SOLD", "RESERVED"]),
  advisorName: optionalShortText,
  advisorPhone: z.string().trim().max(32),
  instagramUrl: z
    .string()
    .trim()
    .refine((value) => {
      if (!value) return true;
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    }, "نشانی اینستاگرام باید HTTPS باشد."),
});

export type AdminVehicleFormValues = z.infer<typeof adminVehicleFormSchema>;
