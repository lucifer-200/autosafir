"use client";

import { ArrowLeft, List, Phone, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { SafirLockup } from "@/components/branding/safir-lockup";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  publicNavigation,
  siteContact,
  toTelephoneHref,
} from "@/data/site-navigation";

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavigation({
  alwaysVisible = false,
}: {
  alwaysVisible?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dialogId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(focusableSelector);
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`touch-target items-center justify-center text-current ${alwaysVisible ? "inline-flex" : "inline-flex lg:hidden"}`}
        aria-label="باز کردن منوی اصلی"
        aria-expanded={isOpen}
        aria-controls={dialogId}
        onClick={() => setIsOpen(true)}
      >
        <List size={27} weight="light" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id={dialogId}
            ref={dialogRef}
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-title`}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: "4%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: "4%" }}
            transition={{
              duration: reducedMotion ? 0 : 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="mobile-menu__image" aria-hidden="true">
              <Image
                src="/images/home/showroom-mobile-480.webp"
                alt=""
                fill
                priority
                sizes="28vw"
                className="object-cover object-[47%_center]"
              />
              <span className="mobile-menu__image-shade" />
            </div>

            <div className="mobile-menu__panel">
              <div className="mobile-menu__topline">
                <SafirLockup inverse />
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="touch-target mobile-menu__close"
                  aria-label="بستن منوی اصلی"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={30} weight="light" aria-hidden="true" />
                </button>
              </div>

              <h2 id={`${dialogId}-title`} className="sr-only">
                منوی اصلی
              </h2>
              <nav aria-label="ناوبری موبایل" className="mobile-menu__nav">
                <ol>
                  {publicNavigation.map((item, index) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          prefetch={false}
                          aria-current={active ? "page" : undefined}
                          className="mobile-menu__link"
                          onClick={() => setIsOpen(false)}
                        >
                          <span
                            className="mobile-menu__arrow"
                            aria-hidden="true"
                          >
                            <ArrowLeft size={22} weight="light" />
                          </span>
                          <span className="mobile-menu__label">
                            <strong>{item.label}</strong>
                            <small dir="ltr">{item.englishLabel}</small>
                          </span>
                          <span
                            className="mobile-menu__number font-technical"
                            dir="ltr"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <div className="mobile-menu__actions">
                <ThemeToggle variant="compact" />
                <a
                  className="mobile-menu__call"
                  href={toTelephoneHref(siteContact.phones[0])}
                  aria-label={`تماس مستقیم با اتو سفیر، ${siteContact.phones[0]}`}
                >
                  <span className="mobile-menu__call-icon" aria-hidden="true">
                    <Phone size={22} weight="fill" />
                  </span>
                  <span>
                    <strong>تماس مستقیم</strong>
                    <small dir="ltr">Call us</small>
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
