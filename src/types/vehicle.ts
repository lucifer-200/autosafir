export const VEHICLE_STATUSES = ["AVAILABLE", "SOLD", "RESERVED"] as const;

export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export interface VehicleAdvisor {
  name: string;
  phone: string;
}

export interface VehicleMedia {
  id: string;
  type: "IMAGE" | "VIDEO";
  src: string;
  alt?: string;
  poster?: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  trim?: string;
  year: number;
  mileage: number;
  exteriorColor?: string;
  interiorColor?: string;
  bodyType?: string;
  engine?: string;
  horsepower?: number;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  condition?: string;
  plateType?: string;
  features: string[];
  description?: string;
  media: VehicleMedia[];
  status: VehicleStatus;
  advisor?: VehicleAdvisor;
  instagramUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export type VehicleCreateInput = Omit<
  Vehicle,
  "id" | "slug" | "createdAt" | "updatedAt"
> & {
  slug?: string;
};

export type VehicleUpdateInput = Partial<VehicleCreateInput>;
