"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { PageTransition } from "./page-transition";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function PublicAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return children;

  return (
    <>
      {pathname !== "/" ? <SiteHeader /> : null}
      {pathname === "/" ? (
        children
      ) : (
        <PageTransition>{children}</PageTransition>
      )}
      {pathname !== "/" ? <SiteFooter /> : null}
    </>
  );
}
