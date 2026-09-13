export type PublishingStep =
  | "PREPARING"
  | "OPTIMIZING"
  | "WEBSITE"
  | "DIVAR"
  | "BAMA"
  | "INSTAGRAM"
  | "COMPLETE";

export interface PublishingProgress {
  step: PublishingStep;
  state: "ACTIVE" | "COMPLETE" | "FAILED";
  message: string;
}

export interface PublishingProvider {
  readonly mode: "DEMO" | "PRODUCTION";
  simulate(
    onProgress: (progress: PublishingProgress) => void,
    options?: { failAt?: PublishingStep; delayMs?: number },
  ): Promise<void>;
}

const STEPS: readonly PublishingStep[] = [
  "PREPARING",
  "OPTIMIZING",
  "WEBSITE",
  "DIVAR",
  "BAMA",
  "INSTAGRAM",
  "COMPLETE",
];

const MESSAGES: Record<PublishingStep, string> = {
  PREPARING: "آماده‌سازی رکورد خودرو",
  OPTIMIZING: "شبیه‌سازی بهینه‌سازی تصاویر",
  WEBSITE: "وب‌سایت آماده نمایش است",
  DIVAR: "انتشار آزمایشی دیوار",
  BAMA: "انتشار آزمایشی باما",
  INSTAGRAM: "انتشار آزمایشی اینستاگرام",
  COMPLETE: "شبیه‌سازی کامل شد",
};

export class DemoPublishingProvider implements PublishingProvider {
  readonly mode = "DEMO" as const;

  async simulate(
    onProgress: (progress: PublishingProgress) => void,
    options: { failAt?: PublishingStep; delayMs?: number } = {},
  ) {
    const delayMs = options.delayMs ?? 420;
    for (const step of STEPS) {
      onProgress({ step, state: "ACTIVE", message: MESSAGES[step] });
      if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs));
      if (options.failAt === step) {
        onProgress({
          step,
          state: "FAILED",
          message: `خطای نمایشی در مرحله «${MESSAGES[step]}»`,
        });
        throw new Error("DEMO_PUBLISHING_FAILURE");
      }
      onProgress({ step, state: "COMPLETE", message: MESSAGES[step] });
    }
  }
}
