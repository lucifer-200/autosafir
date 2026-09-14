export interface SocialStory {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  poster: string;
  posterPosition: string;
  outboundUrl: string;
}

// Direct links to public AutoSafir posts. The local atmospheric poster is an
// intentional fallback until the showroom approves original social media files.
export const SOCIAL_STORIES: readonly SocialStory[] = [
  {
    id: "tiguan-2018",
    eyebrow: "02 SEP 2026",
    title: "Volkswagen Tiguan",
    description: "مدل ۲۰۱۸ با ۴۰ هزار کیلومتر کارکرد.",
    poster: "/images/navigation/showroom-portrait.png",
    posterPosition: "38% center",
    outboundUrl: "https://www.instagram.com/autosafirgallery/p/Dc0EIIlDPju/",
  },
  {
    id: "rav4-hybrid-2026",
    eyebrow: "31 AUG 2026",
    title: "Toyota RAV4 Hybrid",
    description: "نسخه ژاپن، مدل ۲۰۲۶ و صفر کیلومتر.",
    poster: "/images/navigation/showroom-portrait.png",
    posterPosition: "74% center",
    outboundUrl: "https://www.instagram.com/autosafirgallery/p/Dcu6iXHDBTW/",
  },
  {
    id: "land-cruiser-300-2024",
    eyebrow: "25 AUG 2026",
    title: "Toyota Land Cruiser 300",
    description: "VXR Limited مدل ۲۰۲۴ با ۸ هزار کیلومتر کارکرد.",
    poster: "/images/navigation/showroom-portrait.png",
    posterPosition: "17% center",
    outboundUrl: "https://www.instagram.com/autosafirgallery/p/DcfxOEjjP4e/",
  },
] as const;
