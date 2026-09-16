import { StaticLink as Link } from "@/components/ui/static-link";

type SafirLockupProps = {
  inverse?: boolean;
  compact?: boolean;
};

export function SafirLockup({
  inverse = false,
  compact = false,
}: SafirLockupProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex min-h-11 flex-col justify-center ${
        inverse ? "text-[#f5f2ea]" : "text-foreground"
      }`}
      aria-label="اتو سفیر، صفحه اصلی"
      title="لوگوتایپ موقت تا تحویل نشان نهایی SAFIR"
    >
      <span
        className={`font-technical leading-none font-light tracking-[-0.045em] ${
          compact ? "text-[1.55rem]" : "text-[1.8rem]"
        }`}
        dir="ltr"
        aria-hidden="true"
      >
        AutoSafir
      </span>
      <span
        className="mt-1 text-[0.68rem] leading-none font-medium tracking-[0.02em]"
        aria-hidden="true"
      >
        اتو سفیر
      </span>
      <span
        className={`bg-accent mt-2 h-px w-8 origin-right transition-transform duration-300 group-hover:scale-x-150 ${
          inverse ? "bg-[#d8be82]" : ""
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">نشان نوشتاری موقت</span>
    </Link>
  );
}
