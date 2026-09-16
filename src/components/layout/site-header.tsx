"use client";

import { usePathname } from "next/navigation";
import { StaticLink as Link } from "@/components/ui/static-link";
import { useEffect, useState } from "react";

import { SafirLockup } from "@/components/branding/safir-lockup";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { publicNavigation } from "@/data/site-navigation";

import { MobileNavigation } from "./mobile-navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 18);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={isHome ? "site-header site-header--showroom" : "site-header"}
      data-overlay={isHome || undefined}
      data-scrolled={isScrolled || undefined}
    >
      <div className="site-header__inner">
        <SafirLockup compact />
        <nav className="site-header__desktop-nav" aria-label="ناوبری اصلی">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="site-header__tools">
          <div className={isHome ? "hidden" : "block"}>
            <ThemeToggle variant="icon" />
          </div>
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
