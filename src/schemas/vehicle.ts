import { z } from "zod";

const currentYear = new Date().getFullYear();
const requiredText = z.string().trim().min(1).max(200);
const optionalText = z.string().trim().min(1).max(500).optional();
const localPathOrUrl = z
  .string()
  .trim()
  .min(1)
  .max(2_048)
  .refine(
    (value) => {
      if (value.startsWith("/")) return !value.startsWith("//");
      try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    },
    {
      message: "Media source must be an HTTP(S) URL or an absolute local path.",
    },
  );

export const vehicleStatusSchema = z.enum(["AVAILABLE", "SOLD", "RESERVED"]);

export const vehicleAdvisorSchema = z
  .object({
    name: requiredText,
    phone: z.string().trim().min(5).max(32),
  })
  .strict();

export const vehicleMediaSchema = z
  .object({
    id: z.uuid(),
    type: z.enum(["IMAGE", "VIDEO"]),
    src: localPathOrUrl,
    alt: optionalText,
    poster: localPathOrUrl.optional(),
  })
  .strict()
  .superRefine((media, context) => {
    if (media.type === "IMAGE" && media.poster) {
      context.addIssue({
        code: "custom",
        path: ["poster"],
        message: "Only video media can define a poster.",
      });
    }
  });

const vehicleFields = {
  brand: requiredText,
  model: requiredText,
  trim: optionalText,
  year: z
    .number()
    .int()
    .min(1886)
    .max(currentYear + 2),
  mileage: z.number().int().nonnegative().max(10_000_000),
  exteriorColor: optionalText,
  interiorColor: optionalText,
  bodyType: optionalText,
  engine: optionalText,
  horsepower: z.number().int().positive().max(5_000).optional(),
  transmission: optionalText,
  drivetrain: optionalText,
  fuelType: optionalText,
  condition: optionalText,
  plateType: optionalText,
  features: z.array(requiredText).max(200).default([]),
  description: z.string().trim().min(1).max(10_000).optional(),
  media: z.array(vehicleMediaSchema).max(100).default([]),
  status: vehicleStatusSchema,
  advisor: vehicleAdvisorSchema.optional(),
  instagramUrl: z
    .url()
    .refine((value) => new URL(value).protocol === "https:", {
      message: "Instagram URL must use HTTPS.",
    })
    .optional(),
} as const;

export const vehicleSchema = z
  .object({
    id: z.uuid(),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(240)
      .regex(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u),
    ...vehicleFields,
    createdAt: z.iso.datetime({ offset: true }),
    updatedAt: z.iso.datetime({ offset: true }).optional(),
  })
  .strict();

export const vehicleCreateInputSchema = z
  .object({
    ...vehicleFields,
    slug: z
      .string()
      .trim()
      .min(1)
      .max(240)
      .regex(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u)
      .optional(),
  })
  .strict();

export const vehicleUpdateInputSchema = vehicleCreateInputSchema.partial();

export const vehicleCollectionSchema = z
  .array(vehicleSchema)
  .superRefine((vehicles, context) => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const [index, vehicle] of vehicles.entries()) {
      if (ids.has(vehicle.id)) {
        context.addIssue({
          code: "custom",
          path: [index, "id"],
          message: "Duplicate vehicle id.",
        });
      }
      if (slugs.has(vehicle.slug)) {
        context.addIssue({
          code: "custom",
          path: [index, "slug"],
          message: "Duplicate vehicle slug.",
        });
      }
      ids.add(vehicle.id);
      slugs.add(vehicle.slug);
    }
  });

export type ValidatedVehicle = z.infer<typeof vehicleSchema>;
