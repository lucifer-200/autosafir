import type { Metadata } from "next";

import { HomeExperience } from "@/components/home/home-experience";

export const metadata: Metadata = {
  title: "اتو سفیر — دموی نمایشگاه دیجیتال",
  description:
    "نسخه نمایشی و خصوصی نمایشگاه دیجیتال اتو سفیر؛ بدون قیمت عمومی و بدون ادعای سایت رسمی.",
};

export default function HomePage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem("autosafir:hero-video:v2")==="ready"){document.documentElement.dataset.homeVideoCached="true"}else{delete document.documentElement.dataset.homeVideoCached}}catch{}`,
        }}
      />
      <HomeExperience />
    </>
  );
}
