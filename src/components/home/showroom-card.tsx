import {
  InstagramLogo,
  PaperPlaneTilt,
  WhatsappLogo,
  ArrowUpLeft,
  Phone,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import {
  CONTACT_PHONES,
  SHOWROOM_BRANCHES,
  SOCIAL_LINKS,
} from "@/data/branches";

export function ShowroomCard() {
  return (
    <article className="showroom-contact-card" aria-label="اطلاعات فروشگاه">
      <div className="showroom-contact-heading">
        <div>
          <span className="font-technical" dir="ltr">
            THE SHOWROOM
          </span>
          <h2>اتو سفیر</h2>
        </div>
        <Link
          href="/contact"
          prefetch={false}
          aria-label="صفحه تماس با اتو سفیر"
        >
          <ArrowUpLeft size={23} aria-hidden="true" />
        </Link>
      </div>
      <details className="showroom-contact-details" open>
        <summary>
          <MapPin size={17} aria-hidden="true" /> تماس و نشانی شعب
        </summary>
        <div className="showroom-contact-scroll" data-gesture-ignore>
          <ul className="showroom-phones">
            {CONTACT_PHONES.map((phone) => (
              <li key={phone.value}>
                <a
                  href={`tel:${phone.value}`}
                  aria-label={`${phone.label}، ${phone.display}`}
                >
                  <span>{phone.label}</span>
                  <Phone size={15} aria-hidden="true" />
                  <b dir="ltr" className="font-technical">
                    {phone.display}
                  </b>
                </a>
              </li>
            ))}
          </ul>
          <div className="showroom-addresses">
            {SHOWROOM_BRANCHES.map((branch) => (
              <p key={branch.id}>{branch.address}</p>
            ))}
          </div>
        </div>
      </details>
      <div className="showroom-social" aria-label="شبکه‌های اجتماعی">
        <a href={SOCIAL_LINKS.instagram} aria-label="اینستاگرام اتو سفیر">
          <InstagramLogo size={21} aria-hidden="true" />
        </a>
        <a href={SOCIAL_LINKS.telegram} aria-label="تلگرام اتو سفیر">
          <PaperPlaneTilt size={21} aria-hidden="true" />
        </a>
        <a href={SOCIAL_LINKS.whatsapp} aria-label="کانال واتساپ اتو سفیر">
          <WhatsappLogo size={21} aria-hidden="true" />
        </a>
        <span dir="ltr" className="font-technical">
          @autosafirgallery
        </span>
      </div>
    </article>
  );
}
