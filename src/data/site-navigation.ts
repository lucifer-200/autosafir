export type PublicNavigationItem = {
  href: string;
  label: string;
  englishLabel: string;
};

export const publicNavigation: readonly PublicNavigationItem[] = [
  { href: "/", label: "خانه", englishLabel: "Home" },
  { href: "/collection", label: "خودروها", englishLabel: "Vehicles" },
  { href: "/compare", label: "مقایسه", englishLabel: "Compare" },
  {
    href: "/sell-your-car",
    label: "فروش خودرو",
    englishLabel: "Sell Your Car",
  },
  { href: "/about", label: "درباره ما", englishLabel: "About Us" },
  { href: "/branches", label: "شعب", englishLabel: "Our Locations" },
  { href: "/contact", label: "تماس", englishLabel: "Contact" },
] as const;

export const footerNavigation: readonly PublicNavigationItem[] = [
  publicNavigation[0],
  publicNavigation[1],
  { href: "/journal", label: "ژورنال", englishLabel: "Journal" },
  publicNavigation[4],
  publicNavigation[6],
] as const;

export const siteContact = {
  phones: CONTACT_PHONES.map((phone) => phone.display),
  branches: SHOWROOM_BRANCHES.map((branch) => branch.address),
  social: SOCIAL_LINKS,
} as const;

export function toTelephoneHref(phone: string) {
  return `tel:${phone.replaceAll("-", "")}`;
}
import { CONTACT_PHONES, SHOWROOM_BRANCHES, SOCIAL_LINKS } from "./branches";
