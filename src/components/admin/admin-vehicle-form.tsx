"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Image as ImageIcon } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { AdminPageHeader } from "./admin-page-header";
import { slugifyVehicle } from "@/repositories/demo-vehicle-repository";
import {
  adminVehicleFormSchema,
  type AdminVehicleFormValues,
} from "@/schemas/admin-vehicle";
import { useVehicleStore } from "@/stores/vehicle-store";
import type { Vehicle, VehicleCreateInput } from "@/types/vehicle";

const defaults: AdminVehicleFormValues = {
  slug: "",
  brand: "",
  model: "",
  trim: "",
  year: String(new Date().getFullYear()),
  mileage: "0",
  exteriorColor: "",
  interiorColor: "",
  bodyType: "",
  engine: "",
  horsepower: "",
  transmission: "",
  drivetrain: "",
  fuelType: "",
  condition: "",
  plateType: "",
  featuresText: "",
  description: "",
  mediaText: "",
  status: "AVAILABLE",
  advisorName: "",
  advisorPhone: "",
  instagramUrl: "",
};

function valuesFor(vehicle: Vehicle): AdminVehicleFormValues {
  return {
    slug: vehicle.slug,
    brand: vehicle.brand,
    model: vehicle.model,
    trim: vehicle.trim ?? "",
    year: String(vehicle.year),
    mileage: String(vehicle.mileage),
    exteriorColor: vehicle.exteriorColor ?? "",
    interiorColor: vehicle.interiorColor ?? "",
    bodyType: vehicle.bodyType ?? "",
    engine: vehicle.engine ?? "",
    horsepower: vehicle.horsepower ? String(vehicle.horsepower) : "",
    transmission: vehicle.transmission ?? "",
    drivetrain: vehicle.drivetrain ?? "",
    fuelType: vehicle.fuelType ?? "",
    condition: vehicle.condition ?? "",
    plateType: vehicle.plateType ?? "",
    featuresText: vehicle.features.join("\n"),
    description: vehicle.description ?? "",
    mediaText: vehicle.media.map((item) => item.src).join("\n"),
    status: vehicle.status,
    advisorName: vehicle.advisor?.name ?? "",
    advisorPhone: vehicle.advisor?.phone ?? "",
    instagramUrl: vehicle.instagramUrl ?? "",
  };
}

const clean = (value: string) => value.trim() || undefined;

function toInput(values: AdminVehicleFormValues): VehicleCreateInput {
  const mediaSources = values.mediaText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    slug: values.slug,
    brand: values.brand.trim(),
    model: values.model.trim(),
    trim: clean(values.trim),
    year: Number(values.year),
    mileage: Number(values.mileage),
    exteriorColor: clean(values.exteriorColor),
    interiorColor: clean(values.interiorColor),
    bodyType: clean(values.bodyType),
    engine: clean(values.engine),
    horsepower: values.horsepower ? Number(values.horsepower) : undefined,
    transmission: clean(values.transmission),
    drivetrain: clean(values.drivetrain),
    fuelType: clean(values.fuelType),
    condition: clean(values.condition),
    plateType: clean(values.plateType),
    features: values.featuresText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
    description: clean(values.description),
    media: mediaSources.map((src) => ({
      id: crypto.randomUUID(),
      type: /\.(mp4|webm|mov)(?:\?|$)/i.test(src) ? "VIDEO" : "IMAGE",
      src,
      alt: `${values.brand} ${values.model}`.trim(),
    })),
    status: values.status,
    advisor:
      values.advisorName && values.advisorPhone
        ? { name: values.advisorName.trim(), phone: values.advisorPhone.trim() }
        : undefined,
    instagramUrl: clean(values.instagramUrl),
  };
}

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
      {error ? (
        <small role="alert">{error}</small>
      ) : hint ? (
        <small>{hint}</small>
      ) : null}
    </label>
  );
}

export function AdminVehicleForm({ vehicleId }: { vehicleId?: string }) {
  const router = useRouter();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const hydrated = useVehicleStore((state) => state.hydrated);
  const pending = useVehicleStore((state) => state.pending);
  const hydrate = useVehicleStore((state) => state.hydrate);
  const createVehicle = useVehicleStore((state) => state.createVehicle);
  const updateVehicle = useVehicleStore((state) => state.updateVehicle);
  const [submitError, setSubmitError] = useState("");
  const [localPreview, setLocalPreview] = useState<string>();
  const [autoSlug, setAutoSlug] = useState(!vehicleId);
  const loadedRecord = useRef<string | undefined>(undefined);
  const editing = useMemo(
    () => vehicles.find((item) => item.id === vehicleId),
    [vehicleId, vehicles],
  );
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<AdminVehicleFormValues>({
    resolver: zodResolver(adminVehicleFormSchema),
    defaultValues: defaults,
  });

  useEffect(() => void hydrate(), [hydrate]);
  useEffect(() => {
    if (editing && loadedRecord.current !== editing.id) {
      reset(valuesFor(editing));
      loadedRecord.current = editing.id;
    }
  }, [editing, reset]);

  const [brand, model, trim, year] = useWatch({
    control,
    name: ["brand", "model", "trim", "year"],
  });
  useEffect(() => {
    if (autoSlug && brand.trim() && model.trim()) {
      setValue(
        "slug",
        slugifyVehicle({
          brand,
          model,
          trim,
          year: Number(year) || new Date().getFullYear(),
        }),
        { shouldValidate: true },
      );
    }
  }, [autoSlug, brand, model, setValue, trim, year]);

  useEffect(
    () => () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    },
    [localPreview],
  );

  if (vehicleId && hydrated && !editing) {
    return (
      <main className="admin-page">
        <AdminPageHeader
          eyebrow="RECORD NOT FOUND"
          title="رکورد پیدا نشد"
          description="ممکن است خودرو حذف شده یا شناسه آدرس معتبر نباشد."
          actions={
            <Link className="admin-secondary-button" href="/admin/vehicles/">
              بازگشت
            </Link>
          }
        />
      </main>
    );
  }

  async function submit(values: AdminVehicleFormValues) {
    setSubmitError("");
    const collision = vehicles.some(
      (item) => item.slug === values.slug && item.id !== vehicleId,
    );
    if (collision) {
      setError("slug", {
        type: "duplicate",
        message: "این اسلاگ قبلاً استفاده شده است.",
      });
      return;
    }
    if (Boolean(values.advisorName) !== Boolean(values.advisorPhone)) {
      setSubmitError("نام و تلفن مشاور باید با هم تکمیل شوند.");
      return;
    }
    try {
      const input = toInput(values);
      if (vehicleId) await updateVehicle(vehicleId, input);
      else await createVehicle(input);
      router.push("/admin/vehicles/");
    } catch {
      setSubmitError("ذخیره انجام نشد. داده‌ها را بررسی و دوباره تلاش کنید.");
    }
  }

  return (
    <main className="admin-page admin-form-page" id="main-content">
      <AdminPageHeader
        eyebrow={vehicleId ? "EDIT VEHICLE" : "NEW VEHICLE"}
        title={vehicleId ? "ویرایش خودرو" : "افزودن خودرو"}
        description="رکورد ذخیره‌شده بلافاصله در مجموعه عمومی همان مرورگر قابل مشاهده است."
        actions={
          <Link href="/admin/vehicles/" className="admin-secondary-button">
            <ArrowRight size={18} /> بازگشت
          </Link>
        }
      />
      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        className="admin-vehicle-form"
      >
        <section className="admin-form-section">
          <header>
            <span className="font-technical">01 / GENERAL</span>
            <div>
              <h2>اطلاعات عمومی</h2>
              <p>هویت پایه و آدرس ثابت رکورد.</p>
            </div>
          </header>
          <div className="admin-form-grid">
            <Field label="برند" error={errors.brand?.message}>
              <input {...register("brand")} dir="ltr" />
            </Field>
            <Field label="مدل" error={errors.model?.message}>
              <input {...register("model")} dir="ltr" />
            </Field>
            <Field label="تریم" error={errors.trim?.message}>
              <input {...register("trim")} dir="ltr" />
            </Field>
            <Field label="سال ساخت" error={errors.year?.message}>
              <input {...register("year")} inputMode="numeric" dir="ltr" />
            </Field>
            <Field label="کارکرد (کیلومتر)" error={errors.mileage?.message}>
              <input {...register("mileage")} inputMode="numeric" dir="ltr" />
            </Field>
            <Field
              label="اسلاگ"
              error={errors.slug?.message}
              hint="به‌صورت خودکار ساخته می‌شود و قابل ویرایش است."
            >
              <input
                {...register("slug", {
                  onChange: () => {
                    setAutoSlug(false);
                  },
                })}
                dir="ltr"
              />
            </Field>
          </div>
        </section>
        <section className="admin-form-section">
          <header>
            <span className="font-technical">02 / SPECIFICATIONS</span>
            <div>
              <h2>مشخصات</h2>
              <p>فقط داده‌های تأییدشده را وارد کنید.</p>
            </div>
          </header>
          <div className="admin-form-grid">
            <Field label="رنگ بدنه">
              <input {...register("exteriorColor")} />
            </Field>
            <Field label="رنگ کابین">
              <input {...register("interiorColor")} />
            </Field>
            <Field label="نوع بدنه">
              <input {...register("bodyType")} />
            </Field>
            <Field label="موتور">
              <input {...register("engine")} dir="ltr" />
            </Field>
            <Field label="اسب بخار" error={errors.horsepower?.message}>
              <input
                {...register("horsepower")}
                inputMode="numeric"
                dir="ltr"
              />
            </Field>
            <Field label="گیربکس">
              <input {...register("transmission")} />
            </Field>
            <Field label="محور محرک">
              <input {...register("drivetrain")} />
            </Field>
            <Field label="سوخت">
              <input {...register("fuelType")} />
            </Field>
            <Field label="وضعیت فنی">
              <input {...register("condition")} />
            </Field>
            <Field label="نوع پلاک">
              <input {...register("plateType")} />
            </Field>
          </div>
        </section>
        <section className="admin-form-section">
          <header>
            <span className="font-technical">03 / FEATURES</span>
            <div>
              <h2>ویژگی‌ها و توضیحات</h2>
              <p>هر ویژگی را در یک خط بنویسید.</p>
            </div>
          </header>
          <div className="admin-form-grid admin-form-grid--wide">
            <Field label="ویژگی‌ها">
              <textarea {...register("featuresText")} rows={7} />
            </Field>
            <Field label="توضیحات">
              <textarea {...register("description")} rows={7} />
            </Field>
          </div>
        </section>
        <section className="admin-form-section">
          <header>
            <span className="font-technical">04 / MEDIA</span>
            <div>
              <h2>رسانه</h2>
              <p>مسیر محلی مطلق یا URL؛ هر منبع در یک خط.</p>
            </div>
          </header>
          <div className="admin-form-grid admin-form-grid--wide">
            <Field
              label="منابع رسانه"
              error={errors.mediaText?.message}
              hint="مثال: /images/cars/sample.webp"
            >
              <textarea {...register("mediaText")} rows={6} dir="ltr" />
            </Field>
            <div className="admin-local-preview">
              <span>پیش‌نمایش فایل محلی</span>
              <label>
                <ImageIcon size={22} />
                <span>انتخاب تصویر برای پیش‌نمایش</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    if (localPreview) URL.revokeObjectURL(localPreview);
                    const file = event.target.files?.[0];
                    setLocalPreview(
                      file ? URL.createObjectURL(file) : undefined,
                    );
                  }}
                />
              </label>
              {localPreview ? (
                <Image
                  src={localPreview}
                  alt="پیش‌نمایش محلی انتخاب‌شده"
                  width={800}
                  height={450}
                  unoptimized
                />
              ) : (
                <p>
                  فایل انتخابی فقط در حافظه این صفحه دیده می‌شود و آپلود یا
                  ذخیره نخواهد شد.
                </p>
              )}
            </div>
          </div>
        </section>
        <section className="admin-form-section">
          <header>
            <span className="font-technical">05 / STATUS & ADVISOR</span>
            <div>
              <h2>وضعیت و مشاور</h2>
              <p>وضعیت روی سایت عمومی فوراً منعکس می‌شود.</p>
            </div>
          </header>
          <div className="admin-form-grid">
            <Field label="وضعیت">
              <select {...register("status")}>
                <option value="AVAILABLE">موجود</option>
                <option value="RESERVED">رزرو شده</option>
                <option value="SOLD">فروخته شده</option>
              </select>
            </Field>
            <Field label="نام مشاور">
              <input {...register("advisorName")} />
            </Field>
            <Field label="تلفن مشاور">
              <input {...register("advisorPhone")} dir="ltr" inputMode="tel" />
            </Field>
            <Field label="لینک اینستاگرام" error={errors.instagramUrl?.message}>
              <input {...register("instagramUrl")} dir="ltr" />
            </Field>
          </div>
        </section>
        <footer className="admin-form-footer">
          <div>
            <p>نسخه نمایشی محلی</p>
            <small>هیچ داده‌ای به سرویس خارجی ارسال نمی‌شود.</small>
          </div>
          {submitError ? (
            <p className="admin-form-error" role="alert">
              {submitError}
            </p>
          ) : null}
          <button
            type="submit"
            className="admin-primary-button"
            disabled={pending}
          >
            <Check size={18} />{" "}
            {pending
              ? "در حال ذخیره…"
              : vehicleId
                ? "ذخیره تغییرات"
                : "ثبت خودرو"}
          </button>
        </footer>
      </form>
    </main>
  );
}
