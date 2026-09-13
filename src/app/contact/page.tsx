import {
  ArrowUpLeft,
  InstagramLogo,
  PaperPlaneTilt,
  Phone,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { CONTACT_PHONES, SOCIAL_LINKS } from "@/data/branches";

export const metadata: Metadata = {
  title: "تماس با اتو سفیر | دموی اتو سفیر",
  description: "شماره‌های تماس و کانال‌های اجتماعی تأییدشده اتو سفیر.",
};

const socialChannels = [
  {
    name: "Instagram",
    label: "اینستاگرام اتو سفیر",
    href: SOCIAL_LINKS.instagram,
    icon: InstagramLogo,
  },
  {
    name: "Telegram",
    label: "تلگرام اتو سفیر",
    href: SOCIAL_LINKS.telegram,
    icon: PaperPlaneTilt,
  },
  {
    name: "WhatsApp Channel",
    label: "کانال واتساپ اتو سفیر",
    href: SOCIAL_LINKS.whatsapp,
    icon: WhatsappLogo,
  },
] as const;

export default function ContactPage() {
  return (
    <main id="main-content" className="content-page contact-page">
      <header className="contact-hero">
        <p className="font-technical" dir="ltr">
          PRIVATE CONVERSATION
        </p>
        <h1>
          گفت‌وگو،
          <br /> مستقیم و روشن.
        </h1>
        <p>
          برای پرسش درباره خودروها یا هماهنگی بازدید، تماس مستقیم سریع‌ترین مسیر
          است.
        </p>
      </header>

      <section className="contact-ledger" aria-labelledby="phone-heading">
        <div className="contact-ledger__heading">
          <Phone size={26} weight="light" aria-hidden="true" />
          <div>
            <p className="font-technical" dir="ltr">
              DIRECT LINES
            </p>
            <h2 id="phone-heading">تماس تلفنی</h2>
          </div>
        </div>
        <ul dir="ltr">
          {CONTACT_PHONES.map((phone) => (
            <li key={phone.value}>
              <a
                href={`tel:${phone.value}`}
                aria-label={`${phone.label} ${phone.display}`}
              >
                <span className="font-technical">{phone.display}</span>
                <ArrowUpLeft size={20} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="contact-social" aria-labelledby="social-heading">
        <header>
          <p className="font-technical" dir="ltr">
            SOCIAL CHANNELS
          </p>
          <h2 id="social-heading">کانال‌های اجتماعی</h2>
          <p>هر پیوند، صفحه یا کانال تأییدشده اتو سفیر را باز می‌کند.</p>
        </header>
        <ul>
          {socialChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <li key={channel.name}>
                <a href={channel.href} target="_blank" rel="noreferrer">
                  <Icon size={27} weight="light" aria-hidden="true" />
                  <span>
                    <strong className="font-technical" dir="ltr">
                      {channel.name}
                    </strong>
                    <small>{channel.label}</small>
                  </span>
                  <ArrowUpLeft size={20} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="contact-visit">
        <div>
          <p className="font-technical" dir="ltr">
            IN PERSON
          </p>
          <h2>برای بازدید حضوری آماده‌اید؟</h2>
          <p>نشانی هر دو شعبه و امکان کپی مستقیم در صفحه شعب در دسترس است.</p>
        </div>
        <Link href="/branches">مشاهده شعب</Link>
      </aside>
    </main>
  );
}
