"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Phone,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { PRIMARY_CONTACT_PHONE } from "@/data/branches";
import { sellCarSchema, type SellCarFormValues } from "@/schemas/sell-car";
import {
  demoLeadService,
  type DemoLeadReceipt,
  type LeadService,
} from "@/services/lead-service";

import {
  FieldFrame,
  fieldA11yProps,
  LeadInput,
  LeadSelect,
  LeadTextarea,
} from "./form-field";

const steps = [
  {
    eyebrow: "01",
    title: "خودرو",
    fields: ["brand", "model", "year", "mileage"] as const,
  },
  {
    eyebrow: "02",
    title: "وضعیت",
    fields: [
      "exteriorColor",
      "interiorColor",
      "condition",
      "description",
    ] as const,
  },
  { eyebrow: "03", title: "تصاویر", fields: [] as const },
  { eyebrow: "04", title: "تماس", fields: ["name", "phone"] as const },
  { eyebrow: "05", title: "بازبینی", fields: [] as const },
] as const;

const conditionLabels = {
  excellent: "بسیار خوب",
  good: "خوب",
  "needs-review": "نیازمند بررسی",
} as const;

const defaultValues: SellCarFormValues = {
  brand: "",
  model: "",
  year: 0,
  mileage: 0,
  exteriorColor: "",
  interiorColor: "",
  condition: "excellent",
  description: "",
  name: "",
  phone: "",
};

interface SellCarFormProps {
  service?: LeadService;
}

export function SellCarForm({ service = demoLeadService }: SellCarFormProps) {
  const [step, setStep] = useState(0);
  const [previews, setPreviews] = useState<string[]>([]);
  const [receipt, setReceipt] = useState<DemoLeadReceipt>();
  const [submitError, setSubmitError] = useState<string>();
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const form = useForm<SellCarFormValues>({
    resolver: zodResolver(sellCarSchema),
    defaultValues,
    mode: "onTouched",
  });

  const watchedValues = useWatch({ control: form.control });
  const values: SellCarFormValues = { ...defaultValues, ...watchedValues };
  const activeStep = steps[step];

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    },
    [previews],
  );

  useEffect(() => {
    if (receipt) successHeadingRef.current?.focus();
  }, [receipt]);

  const reviewItems = [
    ["خودرو", `${values.brand ?? ""} ${values.model ?? ""}`.trim()],
    ["سال ساخت", values.year ? String(values.year) : "—"],
    [
      "کارکرد",
      typeof values.mileage === "number" && values.mileage >= 0
        ? `${values.mileage.toLocaleString("fa-IR")} کیلومتر`
        : "—",
    ],
    ["رنگ", `${values.exteriorColor ?? "—"} / ${values.interiorColor ?? "—"}`],
    ["وضعیت", values.condition ? conditionLabels[values.condition] : "—"],
    ["نام", values.name || "—"],
    ["تماس", values.phone || "—"],
    [
      "تصاویر محلی",
      previews.length ? `${previews.length} تصویر` : "بدون تصویر",
    ],
  ];

  async function nextStep() {
    const isValid = await form.trigger(activeStep.fields, {
      shouldFocus: true,
    });
    if (isValid) setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function handleFiles(files: FileList | null) {
    previews.forEach((preview) => URL.revokeObjectURL(preview));
    const next = Array.from(files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 4)
      .map((file) => URL.createObjectURL(file));
    setPreviews(next);
  }

  async function submit(valuesToSubmit: SellCarFormValues) {
    setSubmitError(undefined);
    try {
      setReceipt(await service.submitSellCar(valuesToSubmit));
    } catch {
      setSubmitError(
        "تکمیل نسخه نمایشی ممکن نشد. اطلاعات شما ارسال یا ذخیره نشده است.",
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
          بازبینی اطلاعات کامل شد
        </h2>
        <p>
          این نسخه نمایشی هیچ اطلاعاتی را برای اتو سفیر ارسال یا ذخیره نکرده
          است. برای پیگیری واقعی، لطفاً مستقیم تماس بگیرید.
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
            form.reset(defaultValues);
            setStep(0);
            setPreviews([]);
            setReceipt(undefined);
            setSubmitError(undefined);
          }}
        >
          ثبت نمایشی دیگر
        </button>
      </motion.section>
    );
  }

  return (
    <div className="lead-flow">
      <nav className="lead-progress" aria-label="مراحل فروش خودرو">
        <ol>
          {steps.map((item, index) => (
            <li
              key={item.eyebrow}
              aria-current={index === step ? "step" : undefined}
            >
              <span className="font-technical">{item.eyebrow}</span>
              <strong>{item.title}</strong>
            </li>
          ))}
        </ol>
        <p aria-live="polite">
          مرحله {step + 1} از {steps.length}: {activeStep.title}
        </p>
      </nav>

      <form onSubmit={form.handleSubmit(submit)} noValidate>
        <AnimatePresence mode="wait" initial={false}>
          <motion.fieldset
            key={step}
            className="lead-step"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <legend className="sr-only">{activeStep.title}</legend>
            <header className="lead-step__heading">
              <span className="font-technical" dir="ltr">
                {activeStep.eyebrow} / 05
              </span>
              <h2>{activeStep.title}</h2>
            </header>

            {step === 0 && (
              <div className="lead-fields-grid">
                <FieldFrame
                  label="برند"
                  htmlFor="sell-brand"
                  error={form.formState.errors.brand?.message}
                >
                  <LeadInput
                    {...form.register("brand")}
                    {...fieldA11yProps(
                      "sell-brand",
                      form.formState.errors.brand?.message,
                    )}
                    autoComplete="organization"
                    enterKeyHint="next"
                  />
                </FieldFrame>
                <FieldFrame
                  label="مدل"
                  htmlFor="sell-model"
                  error={form.formState.errors.model?.message}
                >
                  <LeadInput
                    {...form.register("model")}
                    {...fieldA11yProps(
                      "sell-model",
                      form.formState.errors.model?.message,
                    )}
                    enterKeyHint="next"
                  />
                </FieldFrame>
                <FieldFrame
                  label="سال ساخت"
                  htmlFor="sell-year"
                  error={form.formState.errors.year?.message}
                >
                  <LeadInput
                    type="number"
                    inputMode="numeric"
                    {...form.register("year", { valueAsNumber: true })}
                    {...fieldA11yProps(
                      "sell-year",
                      form.formState.errors.year?.message,
                    )}
                  />
                </FieldFrame>
                <FieldFrame
                  label="کارکرد (کیلومتر)"
                  htmlFor="sell-mileage"
                  error={form.formState.errors.mileage?.message}
                >
                  <LeadInput
                    type="number"
                    min="0"
                    inputMode="numeric"
                    {...form.register("mileage", { valueAsNumber: true })}
                    {...fieldA11yProps(
                      "sell-mileage",
                      form.formState.errors.mileage?.message,
                    )}
                  />
                </FieldFrame>
              </div>
            )}

            {step === 1 && (
              <div className="lead-fields-grid">
                <FieldFrame
                  label="رنگ بدنه"
                  htmlFor="sell-exterior"
                  error={form.formState.errors.exteriorColor?.message}
                >
                  <LeadInput
                    {...form.register("exteriorColor")}
                    {...fieldA11yProps(
                      "sell-exterior",
                      form.formState.errors.exteriorColor?.message,
                    )}
                  />
                </FieldFrame>
                <FieldFrame
                  label="رنگ کابین"
                  htmlFor="sell-interior"
                  error={form.formState.errors.interiorColor?.message}
                >
                  <LeadInput
                    {...form.register("interiorColor")}
                    {...fieldA11yProps(
                      "sell-interior",
                      form.formState.errors.interiorColor?.message,
                    )}
                  />
                </FieldFrame>
                <FieldFrame
                  label="وضعیت خودرو"
                  htmlFor="sell-condition"
                  error={form.formState.errors.condition?.message}
                >
                  <LeadSelect
                    {...form.register("condition")}
                    {...fieldA11yProps(
                      "sell-condition",
                      form.formState.errors.condition?.message,
                    )}
                  >
                    <option value="excellent">بسیار خوب</option>
                    <option value="good">خوب</option>
                    <option value="needs-review">نیازمند بررسی</option>
                  </LeadSelect>
                </FieldFrame>
                <FieldFrame
                  label="توضیحات"
                  htmlFor="sell-description"
                  error={form.formState.errors.description?.message}
                  hint="هر نکته‌ای که برای ارزیابی اولیه مفید است."
                >
                  <LeadTextarea
                    rows={5}
                    {...form.register("description")}
                    {...fieldA11yProps(
                      "sell-description",
                      form.formState.errors.description?.message,
                      true,
                    )}
                  />
                </FieldFrame>
              </div>
            )}

            {step === 2 && (
              <div className="lead-media-step">
                <label className="lead-upload" htmlFor="sell-photos">
                  <Camera size={28} weight="light" aria-hidden="true" />
                  <strong>انتخاب تصویر از دستگاه</strong>
                  <span>حداکثر ۴ تصویر؛ فقط پیش‌نمایش محلی و بدون آپلود</span>
                </label>
                <input
                  id="sell-photos"
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => handleFiles(event.target.files)}
                />
                {previews.length > 0 && (
                  <div
                    className="lead-previews"
                    aria-label="پیش‌نمایش تصاویر انتخاب‌شده"
                  >
                    {previews.map((preview, index) => (
                      <Image
                        key={preview}
                        src={preview}
                        alt={`پیش‌نمایش محلی ${index + 1}`}
                        width={240}
                        height={180}
                        unoptimized
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="lead-fields-grid">
                <FieldFrame
                  label="نام و نام خانوادگی"
                  htmlFor="sell-name"
                  error={form.formState.errors.name?.message}
                >
                  <LeadInput
                    {...form.register("name")}
                    {...fieldA11yProps(
                      "sell-name",
                      form.formState.errors.name?.message,
                    )}
                    autoComplete="name"
                    enterKeyHint="next"
                  />
                </FieldFrame>
                <FieldFrame
                  label="شماره موبایل"
                  htmlFor="sell-phone"
                  error={form.formState.errors.phone?.message}
                  hint="برای نسخه نمایشی ذخیره یا ارسال نمی‌شود."
                >
                  <LeadInput
                    type="tel"
                    inputMode="tel"
                    dir="ltr"
                    {...form.register("phone")}
                    {...fieldA11yProps(
                      "sell-phone",
                      form.formState.errors.phone?.message,
                      true,
                    )}
                    autoComplete="tel"
                    enterKeyHint="done"
                  />
                </FieldFrame>
              </div>
            )}

            {step === 4 && (
              <div className="lead-review">
                <dl>
                  {reviewItems.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                {values.description && <p>{values.description}</p>}
                <div className="lead-demo-note">
                  این دکمه فقط تجربه نسخه نمایشی را کامل می‌کند؛ هیچ اطلاعاتی به
                  اتو سفیر ارسال نمی‌شود.
                </div>
              </div>
            )}
          </motion.fieldset>
        </AnimatePresence>

        {submitError && (
          <p className="lead-submit-error" role="alert">
            {submitError}
          </p>
        )}

        <div className="lead-form-actions">
          {step > 0 && (
            <button
              type="button"
              className="lead-quiet-action"
              onClick={() => setStep((current) => current - 1)}
            >
              <ArrowRight size={18} /> مرحله قبل
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              type="button"
              className="lead-primary-action"
              onClick={(event) => {
                event.preventDefault();
                void nextStep();
              }}
            >
              مرحله بعد <ArrowLeft size={18} />
            </button>
          ) : (
            <button
              type="submit"
              className="lead-primary-action"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "در حال آماده‌سازی…"
                : "تکمیل نسخه نمایشی"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
