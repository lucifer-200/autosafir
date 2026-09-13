import type { Metadata } from "next";
import { Suspense } from "react";

import { CompareRoute } from "@/components/compare/compare-experience";

export const metadata: Metadata = {
  title: "مقایسه خودروها | دموی اتو سفیر",
  description: "مقایسه دقیق دو تا سه خودرو در دموی خصوصی اتو سفیر.",
};

export default function ComparePage() {
  return (
    <Suspense fallback={<main id="main-content" className="compare-page" />}>
      <CompareRoute />
    </Suspense>
  );
}
