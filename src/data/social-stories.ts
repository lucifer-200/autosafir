import { SOCIAL_LINKS } from "./branches";

export interface SocialStory {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  poster: string;
  posterPosition: string;
  outboundUrl: string;
}

export const SOCIAL_STORIES: readonly SocialStory[] = [
  {
    id: "light-line",
    eyebrow: "LIGHT STUDY",
    title: "خط نور",
    description: "مطالعه فرم و انعکاس در قاب عمودی دموی اتو سفیر.",
    poster: "/images/navigation/showroom-portrait.png",
    posterPosition: "38% center",
    outboundUrl: SOCIAL_LINKS.instagram,
  },
  {
    id: "quiet-architecture",
    eyebrow: "SHOWROOM FRAME",
    title: "معماری آرام",
    description:
      "پوستر محلی و ثابت؛ بدون وابستگی به امبد یا توکن شبکه اجتماعی.",
    poster: "/images/navigation/showroom-portrait.png",
    posterPosition: "74% center",
    outboundUrl: SOCIAL_LINKS.instagram,
  },
  {
    id: "close-detail",
    eyebrow: "CLOSE DETAIL",
    title: "جزئیات نزدیک",
    description: "روایتی تصویری از متریال، سایه و تناسب در نمایش خودرو.",
    poster: "/images/navigation/showroom-portrait.png",
    posterPosition: "17% center",
    outboundUrl: SOCIAL_LINKS.instagram,
  },
] as const;
