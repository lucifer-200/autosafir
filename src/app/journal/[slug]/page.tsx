import { ArrowRight, CarProfile } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { staticJournalContentSource } from "@/features/journal/journal-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return staticJournalContentSource
    .getAll()
    .map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = staticJournalContentSource.getBySlug(slug);

  if (!article) return { title: "یادداشت پیدا نشد | دموی اتو سفیر" };

  return {
    title: `${article.title} | ژورنال دموی اتو سفیر`,
    description: article.dek,
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = staticJournalContentSource.getBySlug(slug);
  if (!article) notFound();

  return (
    <main id="main-content" className="content-page journal-article-page">
      <article>
        <header className="journal-article__hero">
          <Link href="/journal" className="journal-article__back">
            <ArrowRight size={18} aria-hidden="true" />
            بازگشت به ژورنال
          </Link>
          <div className="journal-article__meta">
            <span>{article.category}</span>
            <span>{article.readingTime}</span>
          </div>
          <h1>{article.title}</h1>
          <p>{article.dek}</p>
        </header>

        <div className="journal-article__layout">
          <aside aria-label="درباره این یادداشت">
            <span className="font-technical" dir="ltr">
              AUTOSAFIR JOURNAL
            </span>
            <p>
              محتوای آموزشیِ ثابت برای نسخه دمو؛ جزئیات هر خودرو باید به‌صورت
              مستقل بررسی و تأیید شود.
            </p>
          </aside>
          <div className="journal-article__body">
            <p className="journal-article__lead">{article.lead}</p>
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.checklist ? (
                  <ul>
                    {section.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </article>

      <aside className="journal-related" aria-label="خودروهای مرتبط">
        <CarProfile size={31} weight="thin" aria-hidden="true" />
        <div>
          <p className="font-technical" dir="ltr">
            RELATED VEHICLES
          </p>
          <h2>{article.relatedLabel}</h2>
          <p>
            موجودی نمایشی را مرور کنید و برای جزئیات، پرونده هر خودرو را باز
            کنید.
          </p>
        </div>
        <Link href="/collection">مشاهده مجموعه</Link>
      </aside>
    </main>
  );
}
