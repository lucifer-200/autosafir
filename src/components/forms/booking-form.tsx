"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, Check, Phone } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { PRIMARY_CONTACT_PHONE, SHOWROOM_BRANCHES } from "@/data/branches";
import {
  createBookingSchema,
  getLocalDateInputValue,
  type BookingFormValues,
} from "@/schemas/booking";
import {
  demoLeadService,
  type DemoLeadReceipt,
  type LeadService,
} from "@/services/lead-service";
import { useVehicleStore } from "@/stores/vehicle-store";

import {
  FieldFrame,
  fieldA11yProps,
  LeadInput,
  LeadSelect,
  LeadTextarea,
} from "./form-field";

interface BookingFormProps {
  service?: LeadService;
}

export function BookingForm({ service = demoLeadService }: BookingFormProps) {
  const searchParams = useSearchParams();
  const requestedVehicle = searchParams.get("vehicle") ?? "";
  const vehicles = useVehicleStore((state) => state.vehicles);
  const hydrated = useVehicleStore((state) => state.hydrated);
  const hydrate = useVehicleStore((state) => state.hydrate);
  const [receipt, setReceipt] = useState<DemoLeadReceipt>();
  const [submitError, setSubmitError] = useState<string>();
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const today = useMemo(() => getLocalDateInputValue(), []);
  const schema = useMemo(() => createBookingSchema(today), [today]);
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicle: "",
      name: "",
      phone: "",
      branch: "",
      date: "",
      time: "",
      note: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrate, hydrated]);

  useEffect(() => {
    if (
      hydrated &&
      requestedVehicle &&
      !form.formState.dirtyFields.vehicle &&
      vehicles.some((vehicle) => vehicle.slug === requestedVehicle)
    ) {
      form.setValue("vehicle", requestedVehicle, { shouldValidate: true });
    }
  }, [form, hydrated, requestedVehicle, vehicles]);

  useEffect(() => {
    if (receipt) successHeadingRef.current?.focus();
  }, [receipt]);

  async function submit(values: BookingFormValues) {
    setSubmitError(undefined);
    try {
      setReceipt(await service.submitBooking(values));
    } catch {
      setSubmitError(
        "تکمیل درخواست نمایشی ممکن نشد. هیچ رزروی ثبت یا ارسال نشده است.",
      );
    }
  }

  if (receipt) {
    return (
      <motion.section
        className="lead-success"
        aria-live="polite"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
      >
        <motion.span
          className="lead-success__mark"
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.45,
            delay: shouldReduceMotion ? 0 : 0.08,
          }}
        >
          <Check size={30} weight="light" />
        </motion.span>
        <p className="font-technical">DEMO PREVIEW</p>
        <h2 ref={successHeadingRef} tabIndex={-1}>
          درخواست بازدید آماده شد
        </h2>
        <p>
          این نسخه نمایشی هیچ رزروی را برای اتو سفیر ثبت نکرده است. برای هماهنگی
          واقعی همین حالا تماس بگیرید.
        </p>
        <a
          href={`tel:${PRIMARY_CONTACT_PHONE}`}
          className="lead-primary-action"
        >
          <Phone size={19} weight="light" /> تماس مستقیم
        </a>
        <button
          type="button"
          className="lead-quiet-action"
          onClick={() => {
            form.reset();
            setReceipt(undefined);
            setSubmitError(undefined);
          }}
        >
          تنظیم درخواست نمایشی دیگر
        </button>
      </motion.section>
    );
  }

  return (
    <form
      className="booking-form"
      onSubmit={form.handleSubmit(submit)}
      noValidate
    >
      <div className="booking-form__mark" aria-hidden="true">
        <CalendarCheck size={29} weight="light" />
      </div>
      <div className="lead-fields-grid">
        <FieldFrame
          label="خودرو"
          htmlFor="booking-vehicle"
          error={form.formState.errors.vehicle?.message}
          hint={!hydrated ? "در حال آماده‌سازی موجودی محلی…" : undefined}
        >
          <LeadSelect
            {...form.register("vehicle")}
            {...fieldA11yProps(
              "booking-vehicle",
              form.formState.errors.vehicle?.message,
              !hydrated,
            )}
            disabled={!hydrated}
          >
            <option value="">انتخاب خودرو</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.slug}>
                {vehicle.brand} {vehicle.model} {vehicle.trim ?? ""} —{" "}
                {vehicle.year}
              </option>
            ))}
          </LeadSelect>
        </FieldFrame>
        <FieldFrame
          label="نام و نام خانوادگی"
          htmlFor="booking-name"
          error={form.formState.errors.name?.message}
        >
          <LeadInput
            {...form.register("name")}
            {...fieldA11yProps(
              "booking-name",
              form.formState.errors.name?.message,
            )}
            autoComplete="name"
            enterKeyHint="next"
          />
        </FieldFrame>
        <FieldFrame
          label="شماره موبایل"
          htmlFor="booking-phone"
          error={form.formState.errors.phone?.message}
        >
          <LeadInput
            type="tel"
            inputMode="tel"
            dir="ltr"
            {...form.register("phone")}
            {...fieldA11yProps(
              "booking-phone",
              form.formState.errors.phone?.message,
            )}
            autoComplete="tel"
            enterKeyHint="next"
          />
        </FieldFrame>
        <FieldFrame
          label="شعبه"
          htmlFor="booking-branch"
          error={form.formState.errors.branch?.message}
        >
          <LeadSelect
            {...form.register("branch")}
            {...fieldA11yProps(
              "booking-branch",
              form.formState.errors.branch?.message,
            )}
          >
            <option value="">انتخاب شعبه</option>
            {SHOWROOM_BRANCHES.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} — {branch.address}
              </option>
            ))}
          </LeadSelect>
        </FieldFrame>
        <FieldFrame
          label="تاریخ"
          htmlFor="booking-date"
          error={form.formState.errors.date?.message}
        >
          <LeadInput
            type="date"
            min={today}
            {...form.register("date")}
            {...fieldA11yProps(
              "booking-date",
              form.formState.errors.date?.message,
            )}
          />
        </FieldFrame>
        <FieldFrame
          label="زمان"
          htmlFor="booking-time"
          error={form.formState.errors.time?.message}
        >
          <LeadInput
            type="time"
            {...form.register("time")}
            {...fieldA11yProps(
              "booking-time",
              form.formState.errors.time?.message,
            )}
          />
        </FieldFrame>
        <FieldFrame
          label="یادداشت"
          htmlFor="booking-note"
          error={form.formState.errors.note?.message}
          hint="اختیاری؛ برای نمونه زمان یا نکته موردنظر."
        >
          <LeadTextarea
            rows={4}
            {...form.register("note")}
            {...fieldA11yProps(
              "booking-note",
              form.formState.errors.note?.message,
              true,
            )}
          />
        </FieldFrame>
      </div>
      <aside className="lead-demo-note">
        این فرم بخشی از دموی استاتیک است و اطلاعات را ذخیره یا ارسال نمی‌کند.
      </aside>
      {submitError && (
        <p className="lead-submit-error" role="alert">
          {submitError}
        </p>
      )}
      <button
        type="submit"
        className="lead-primary-action"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting
          ? "در حال آماده‌سازی…"
          : "تکمیل درخواست نمایشی"}
      </button>
    </form>
  );
}
