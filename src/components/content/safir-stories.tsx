import { ArrowUpLeft } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

import { SOCIAL_STORIES } from "@/data/social-stories";

export function SafirStories() {
  return (
    <section className="stories-section" aria-labelledby="stories-heading">
      <header className="stories-section__heading">
        <div>
          <p className="font-technical" dir="ltr">
            SOCIAL EDITIONS
          </p>
          <h2 id="stories-heading" className="font-technical" dir="ltr">
            SAFIR STORIES
          </h2>
        </div>
        <p>
          گزیده‌ای منبع‌دار از پست‌های عمومی اتو سفیر؛ هر قاب مستقیماً همان پست
          را در اینستاگرام باز می‌کند.
        </p>
      </header>

      <div className="stories-rail">
        {SOCIAL_STORIES.map((story) => (
          <article className="story-card" key={story.id}>
            <a
              href={story.outboundUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${story.title}؛ باز کردن پست اینستاگرام اتو سفیر در پنجره جدید`}
            >
              <Image
                src={story.poster}
                alt="نمای نزدیک یک خودروی تیره در فضای معماری با نور طلایی"
                fill
                sizes="(max-width: 639px) 72vw, (max-width: 1023px) 38vw, 24vw"
                style={{ objectPosition: story.posterPosition }}
              />
              <span className="story-card__shade" aria-hidden="true" />
              <span className="story-card__index font-technical" dir="ltr">
                {String(SOCIAL_STORIES.indexOf(story) + 1).padStart(2, "0")}
              </span>
              <span className="story-card__content">
                <span className="font-technical" dir="ltr">
                  {story.eyebrow}
                </span>
                <strong>{story.title}</strong>
                <small>{story.description}</small>
                <span className="story-card__action">
                  مشاهده پست اصلی
                  <ArrowUpLeft size={17} aria-hidden="true" />
                </span>
              </span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
