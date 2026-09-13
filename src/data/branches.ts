export interface ShowroomBranch {
  id: string;
  name: string;
  address: string;
  label: string;
  phone: string;
  phoneDisplay: string;
}

export interface ContactPhone {
  label: string;
  display: string;
  value: string;
}

export const CONTACT_PHONES: readonly ContactPhone[] = [
  {
    label: "تماس همراه یک",
    display: "0912-2222-346",
    value: "09122222346",
  },
  {
    label: "تماس همراه دو",
    display: "0912-7777-427",
    value: "09127777427",
  },
  {
    label: "تلفن ثابت",
    display: "021-88527000-5",
    value: "021885270005",
  },
] as const;

export const SHOWROOM_BRANCHES: readonly ShowroomBranch[] = [
  {
    id: "beheshti",
    name: "شعبه بهشتی",
    label: "بهشتی / احمد قصیر",
    address: "خیابان بهشتی، تقاطع احمد قصیر",
    phone: "02188527000",
    phoneDisplay: "021-88527000-5",
  },
  {
    id: "motahari",
    name: "شعبه مطهری",
    label: "مطهری / مفتح",
    address: "خیابان مطهری، تقاطع مفتح",
    phone: "02188527000",
    phoneDisplay: "021-88527000-5",
  },
] as const;

export const PRIMARY_CONTACT_PHONE = CONTACT_PHONES[0].value;

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/autosafirgallery",
  telegram: "https://t.me/autosafirgallery1",
  whatsapp: "https://whatsapp.com/channel/0029VaZuzPzJJhzbIJ00r21R",
} as const;
