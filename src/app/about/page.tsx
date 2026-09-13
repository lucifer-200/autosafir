import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "درباره اتو سفیر | دموی اتو سفیر",
  description:
    "روایتی کوتاه از رویکرد انتخاب، ارائه و همراهی در تجربه نمایشی اتو سفیر.",
};

const values = [
  {
    title: "انتخاب سنجیده",
    description:
      "هر خودرو با اطلاعات روشن و فضایی برای بررسی دقیق‌تر ارائه می‌شود.",
  },
  {
    title: "تجربه پریمیوم",
    description:
      "از مرور آنلاین تا بازدید حضوری، مسیر باید آرام، دقیق و بدون شلوغی باشد.",
  },
  {
    title: "گفت‌وگوی قابل اتکا",
    description:
      "پرسش‌های مهم باید پاسخ روشن بگیرند و موارد نیازمند تأیید، همان‌طور باقی بمانند.",
  },
] as const;

export default function AboutPage() {
  return (
    <main id="main-content" className="content-page about-page">
      <header className="content-hero content-hero--editorial">
        <div className="content-hero__copy">
          <p className="font-technical" dir="ltr">
            ABOUT AUTOSAFIR
          </p>
          <h1>فضایی برای انتخابِ آرام‌تر.</h1>
          <p>
            اتو سفیر در این تجربه دیجیتال، خودرو را با روایت تصویری سنجیده،
            اطلاعات قابل مرور و مسیر مستقیم گفت‌وگو ارائه می‌کند.
          </p>
        </div>
        <figure className="about-portrait">
          <Image
            src="/images/navigation/showroom-portrait.png"
            alt="خودروی تیره در یک فضای معماری با نور گرم"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 48vw"
          />
        </figure>
      </header>

      <section className="about-statement" aria-labelledby="about-intent">
        <p className="font-technical" dir="ltr">
          OUR APPROACH
        </p>
        <h2 id="about-intent">
          زیباییِ خودرو آغاز گفت‌وگوست؛ تصمیم خوب به وضوح اطلاعات و فرصت بررسی
          نیاز دارد.
        </h2>
        <p>
          این نسخه یک کانسپت نمایشی است. محتوای نهایی، تصاویر و جزئیات موجودی
          پیش از انتشار رسمی باید با اتو سفیر بازبینی و تأیید شوند.
        </p>
      </section>

      <section className="about-values" aria-labelledby="values-heading">
        <header>
          <p className="font-technical" dir="ltr">
            THREE PRINCIPLES
          </p>
          <h2 id="values-heading">سه اصل در تجربه</h2>
        </header>
        <ol>
          {values.map((value, index) => (
            <li key={value.title}>
              <span className="font-technical" dir="ltr">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <aside className="content-next-step" aria-label="گام بعدی">
        <div>
          <p className="font-technical" dir="ltr">
            CONTINUE THE JOURNEY
          </p>
          <h2>خودروها را با ریتم خودتان مرور کنید.</h2>
        </div>
        <Link href="/collection">
          مشاهده مجموعه
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
      </aside>
    </main>
  );
}
