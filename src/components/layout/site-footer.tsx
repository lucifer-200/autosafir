import { AkhWordmark } from "@/components/branding/akh-wordmark";
import { footerNavigation } from "@/data/site-navigation";

export function SiteFooter() {
  return (
    <footer className="site-footer site-footer--minimal">
      <nav aria-label="دسترسی‌های پایین صفحه">
        <ul>
          {footerNavigation.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="site-footer__bottom">
        <p>نسخهٔ نمایشی اتو سفیر</p>
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
