import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import type { JournalArticle } from "@/features/journal/journal-content";

export function JournalCard({
  article,
  index,
}: {
  article: JournalArticle;
  index: number;
}) {
  return (
    <article className="journal-card">
      <Link href={`/journal/${article.slug}`}>
        <span className="journal-card__number font-technical" dir="ltr">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="journal-card__body">
          <span className="journal-card__meta">
            <span>{article.category}</span>
            <span>{article.readingTime}</span>
          </span>
          <strong>{article.title}</strong>
          <small>{article.dek}</small>
        </span>
        <span className="journal-card__arrow" aria-hidden="true">
          <ArrowLeft size={24} weight="light" />
        </span>
      </Link>
    </article>
  );
}
