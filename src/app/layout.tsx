import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@fontsource-variable/estedad";
import "@fontsource-variable/manrope";
import "./globals.css";

import { PublicAppShell } from "@/components/layout/public-app-shell";
import { themeBootstrapScript } from "@/lib/theme";

export const metadata: Metadata = {
  title: "اتو سفیر — دموی نمایشگاه دیجیتال",
  description:
    "نسخه نمایشی و خصوصی نمایشگاه دیجیتال اتو سفیر؛ بدون قیمت عمومی و بدون ادعای سایت رسمی.",
  icons: {
    icon: "/images/navigation/showroom-portrait.png",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          رفتن به محتوای اصلی
        </a>
        <PublicAppShell>{children}</PublicAppShell>
      </body>
    </html>
  );
}
