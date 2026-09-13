import {
  InstagramLogo,
  PaperPlaneTilt,
  Phone,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";

import { AkhWordmark } from "@/components/branding/akh-wordmark";
import { SafirLockup } from "@/components/branding/safir-lockup";
import {
  footerNavigation,
  siteContact,
  toTelephoneHref,
} from "@/data/site-navigation";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <SafirLockup />
          <p>مقصدهای بهتر، با هم نزدیک‌ترند.</p>
        </div>

        <nav aria-label="دسترسی‌های پایین صفحه">
          <h2>دسترسی سریع</h2>
          <ul>
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-contact-heading">
          <h2 id="footer-contact-heading">تماس با اتو سفیر</h2>
          <ul className="site-footer__phones" dir="ltr">
            {siteContact.phones.map((phone) => (
              <li key={phone}>
                <a href={toTelephoneHref(phone)}>{phone}</a>
              </li>
            ))}
          </ul>
          <div className="site-footer__social" aria-label="شبکه‌های اجتماعی">
            <a
              href={siteContact.social.instagram}
              aria-label="اینستاگرام اتو سفیر"
            >
              <InstagramLogo size={21} aria-hidden="true" />
            </a>
            <a href={siteContact.social.telegram} aria-label="تلگرام اتو سفیر">
              <PaperPlaneTilt size={21} aria-hidden="true" />
            </a>
            <a
              href={siteContact.social.whatsapp}
              aria-label="کانال واتساپ اتو سفیر"
            >
              <WhatsappLogo size={21} aria-hidden="true" />
            </a>
            <a
              href={toTelephoneHref(siteContact.phones[0])}
              aria-label="تماس با اتو سفیر"
            >
              <Phone size={21} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section
          className="site-footer__branches"
          aria-labelledby="footer-branches-heading"
        >
          <h2 id="footer-branches-heading">شعب</h2>
          {siteContact.branches.map((branch) => (
            <p key={branch}>{branch}</p>
          ))}
        </section>
      </div>

      <div className="site-footer__bottom">
        <p className="font-technical" dir="ltr">
          Concept demo · Not an official production website
        </p>
        <a
          href="https://akhavan.dev"
          className="site-footer__akh"
          aria-label="Developed by AKH"
        >
          <span className="font-technical">Developed by</span>
          <AkhWordmark className="h-8 w-24" />
        </a>
      </div>
    </footer>
  );
}
