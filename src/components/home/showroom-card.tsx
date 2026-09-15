import { ArrowUpLeft, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { CONTACT_PHONES, SHOWROOM_BRANCHES } from "@/data/branches";

export function ShowroomCard() {
  return (
    <article
      className="home-showroom-card"
      aria-label="تماس و نشانی شعب اتو سفیر"
    >
      <header>
        <div>
          <p className="font-technical" dir="ltr">
            THE SHOWROOM
          </p>
          <h2>ارتباط مستقیم</h2>
        </div>
        <Link
          href="/contact"
          prefetch={false}
          aria-label="صفحه تماس با اتو سفیر"
        >
          <ArrowUpLeft size={22} />
        </Link>
      </header>
      <div className="home-showroom-card__phones">
        {CONTACT_PHONES.slice(0, 2).map((phone, index) => (
          <a key={phone.value} href={`tel:${phone.value}`}>
            <Phone size={15} />
            <span>{SHOWROOM_BRANCHES[index]?.name ?? phone.label}</span>
            <strong className="font-technical" dir="ltr">
              {phone.display}
            </strong>
          </a>
        ))}
      </div>
      <div className="home-showroom-card__branches">
        {SHOWROOM_BRANCHES.map((branch) => (
          <p key={branch.id}>
            <MapPin size={15} />
            <span>
              {branch.name}
              <small>{branch.address}</small>
            </span>
          </p>
        ))}
      </div>
    </article>
  );
}
