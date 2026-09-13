import type { Metadata } from "next";

import { HomeExperience } from "@/components/home/home-experience";

export const metadata: Metadata = {
  title: "اتو سفیر — دموی نمایشگاه دیجیتال",
  description:
    "نسخه نمایشی و خصوصی نمایشگاه دیجیتال اتو سفیر؛ بدون قیمت عمومی و بدون ادعای سایت رسمی.",
};

export default function HomePage() {
  return <HomeExperience />;
}
