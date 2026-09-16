import type { Metadata } from "next";
import { StaticLink as Link } from "@/components/ui/static-link";

import { JournalCard } from "@/components/content/journal-card";
import { SafirStories } from "@/components/content/safir-stories";
import { staticJournalContentSource } from "@/features/journal/journal-content";

export const metadata: Metadata = {
  title: "ژورنال اتو سفیر | دموی اتو سفیر",
  description:
    "یادداشت‌های ثابت و آموزشی درباره بازدید، مقایسه و فناوری خودروهای پریمیوم.",
};

export default function JournalPage() {
  const articles = staticJournalContentSource.getAll();
  const featured = articles[0];

  return (
    <main id="main-content" className="content-page journal-page">
      <header className="content-hero content-hero--journal">
        <div className="content-hero__copy">
          <p className="font-technical" dir="ltr">
            AUTOSAFIR EDITORIAL
          </p>
          <h1>ژورنال</h1>
          <p>
            یادداشت‌های کوتاه برای نگاه دقیق‌تر به انتخاب، بازدید و تجربه خودرو؛
            بدون ادعاهای تاریخ‌مصرف‌دار یا مشخصات تأییدنشده.
          </p>
        </div>
        <Link className="journal-feature" href={`/journal/${featured.slug}`}>
          <span className="font-technical" dir="ltr">
            FEATURED NOTE
          </span>
          <strong>{featured.title}</strong>
          <small>{featured.dek}</small>
          <span>{featured.readingTime} ←</span>
        </Link>
      </header>

      <section
        className="journal-index"
        aria-labelledby="journal-index-heading"
      >
        <header>
          <p className="font-technical" dir="ltr">
            READING LEDGER
          </p>
          <h2 id="journal-index-heading">یادداشت‌ها</h2>
        </header>
        <div className="journal-list">
          {articles.map((article, index) => (
            <JournalCard key={article.slug} article={article} index={index} />
          ))}
        </div>
      </section>

      <SafirStories />
    </main>
  );
}
