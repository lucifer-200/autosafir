"use client";

import {
  ArrowSquareOut,
  Buildings,
  CarProfile,
  GearSix,
  HouseLine,
  List,
  SignOut,
  X,
} from "@phosphor-icons/react";
import { StaticLink as Link } from "@/components/ui/static-link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ADMIN_DEMO_SESSION_KEY } from "@/lib/admin-demo-auth";

const navigation = [
  { href: "/admin/", label: "نمای کلی", icon: HouseLine },
  { href: "/admin/vehicles/", label: "خودروها", icon: CarProfile },
  { href: "/admin/integrations/", label: "یکپارچه‌سازی", icon: Buildings },
  { href: "/admin/settings/", label: "تنظیمات دمو", icon: GearSix },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login/" || pathname === "/admin/login";
  const [ready, setReady] = useState(isLogin);
  const [openPath, setOpenPath] = useState<string>();
  const open = openPath === pathname;
  const sidebarRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPath(undefined);
        return;
      }
      if (event.key !== "Tab") return;
      const controls = sidebarRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"]',
      );
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 80rem)");
    const handleResize = () => setOpenPath(undefined);
    desktop.addEventListener("change", handleResize);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleResize);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (isLogin) return;
    // Deliberately insecure sessionStorage UI gate for the static demo only.
    if (window.sessionStorage.getItem(ADMIN_DEMO_SESSION_KEY) !== "active") {
      window.location.replace("/admin/login/");
      return;
    }
    queueMicrotask(() => setReady(true));
  }, [isLogin]);

  if (isLogin) return children;
  if (!ready)
    return (
      <main className="admin-auth-check" aria-live="polite">
        <span className="admin-kicker font-technical">UI GATE</span>
        <p>در حال بررسی نشست نمایشی…</p>
      </main>
    );

  function signOut() {
    window.sessionStorage.removeItem(ADMIN_DEMO_SESSION_KEY);
    window.location.replace("/admin/login/");
  }

  return (
    <div className="admin-frame">
      <header className="admin-mobile-bar">
        <Link href="/admin/" prefetch={false} className="admin-mobile-brand">
          <span className="font-technical">AutoSafir</span>
          <small>ADMIN / DEMO</small>
        </Link>
        <button
          ref={triggerRef}
          type="button"
          aria-label="باز کردن ناوبری مدیریت"
          aria-expanded={open}
          aria-controls="admin-navigation"
          onClick={() => setOpenPath(pathname)}
        >
          <List size={24} />
        </button>
      </header>

      <aside
        ref={sidebarRef}
        id="admin-navigation"
        className="admin-sidebar"
        data-open={open || undefined}
      >
        <div className="admin-sidebar__top">
          <Link href="/admin/" prefetch={false} className="admin-brand">
            <span className="font-technical">AutoSafir</span>
            <small className="font-technical">OPERATIONS / DEMO</small>
          </Link>
          <button
            ref={closeRef}
            type="button"
            className="admin-sidebar__close"
            aria-label="بستن ناوبری مدیریت"
            onClick={() => setOpenPath(undefined)}
          >
            <X size={22} />
          </button>
        </div>
        <div className="admin-demo-stamp">
          <span className="font-technical">DEMO 08</span>
          <p>پنل نمایشی محلی؛ فاقد احراز هویت امن و اتصال خارجی.</p>
        </div>
        <nav aria-label="ناوبری مدیریت">
          {navigation.map((item) => {
            const active =
              item.href === "/admin/"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                aria-current={active ? "page" : undefined}
                data-active={active || undefined}
              >
                <Icon size={19} weight="light" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar__footer">
          <ThemeToggle variant="compact" />
          <Link href="/" prefetch={false} target="_blank">
            <ArrowSquareOut size={18} /> مشاهده سایت
          </Link>
          <button type="button" onClick={signOut}>
            <SignOut size={18} /> خروج از دمو
          </button>
        </div>
      </aside>
      {open ? (
        <button
          className="admin-sidebar-backdrop"
          type="button"
          aria-label="بستن ناوبری مدیریت"
          onClick={() => setOpenPath(undefined)}
        />
      ) : null}
      <div className="admin-workspace" inert={open}>
        {children}
      </div>
    </div>
  );
}
