import type { VehicleStatus } from "@/types/vehicle";

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  AVAILABLE: "موجود",
  RESERVED: "رزرو شده",
  SOLD: "فروخته شده",
};

export type VehiclePrimaryAction =
  "BOOK_VISIT" | "CONTACT_ADVISOR" | "VIEW_SIMILAR";

export function getVehiclePrimaryAction(
  status: VehicleStatus,
): VehiclePrimaryAction {
  if (status === "SOLD") return "VIEW_SIMILAR";
  if (status === "RESERVED") return "CONTACT_ADVISOR";
  return "BOOK_VISIT";
}

export function isVehicleBookable(status: VehicleStatus): boolean {
  return status === "AVAILABLE";
}

export function isVehiclePubliclyVisible(status: VehicleStatus): boolean {
  void status;
  return true;
}
