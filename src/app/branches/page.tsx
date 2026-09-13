import { ArrowLeft, Phone } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { CopyAddressButton } from "@/components/content/copy-address-button";
import {
  CONTACT_PHONES,
  PRIMARY_CONTACT_PHONE,
  SHOWROOM_BRANCHES,
} from "@/data/branches";

export const metadata: Metadata = {
  title: "شعب اتو سفیر | دموی اتو سفیر",
  description: "نشانی‌های تأییدشده شعب و راه‌های تماس اتو سفیر.",
};

export default function BranchesPage() {
  return (
    <main id="main-content" className="content-page branches-page">
      <header className="content-hero content-hero--compact">
        <div className="content-hero__copy">
          <p className="font-technical" dir="ltr">
            OUR LOCATIONS
          </p>
          <h1>دو نشانی، یک مسیر مستقیم.</h1>
          <p>
            پیش از مراجعه برای هماهنگی تماس بگیرید. نشانی‌ها همان اطلاعات
            تأییدشده برای نسخه دمو هستند.
          </p>
        </div>
      </header>

      <section className="branch-ledger" aria-labelledby="branches-heading">
        <header>
          <p className="font-technical" dir="ltr">
            TEHRAN · SHOWROOMS
          </p>
          <h2 id="branches-heading">نشانی شعب</h2>
        </header>
        <ol>
          {SHOWROOM_BRANCHES.map((branch, index) => (
            <li key={branch.id}>
              <span className="branch-ledger__number font-technical" dir="ltr">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="branch-ledger__address">
                <p className="font-technical" dir="ltr">
                  {branch.id.toUpperCase()}
                </p>
                <h3>{branch.name}</h3>
                <address>{branch.address}</address>
              </div>
              <div className="branch-ledger__actions">
                <CopyAddressButton address={branch.address} />
                <a href={`tel:${PRIMARY_CONTACT_PHONE}`}>
                  <Phone size={18} aria-hidden="true" />
                  تماس برای هماهنگی
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <aside className="branch-callout">
        <div>
          <p>خطوط تماس ثبت‌شده</p>
          <p>برای هماهنگی و انتخاب شعبه مناسب، یکی از شماره‌ها را لمس کنید.</p>
        </div>
        <ul dir="ltr">
          {CONTACT_PHONES.map((phone) => (
            <li key={phone.value}>
              <a
                href={`tel:${phone.value}`}
                aria-label={`${phone.label} ${phone.display}`}
              >
                {phone.display}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <div className="branches-contact-link">
        <Link href="/contact">
          همه راه‌های ارتباطی
          <ArrowLeft size={19} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
