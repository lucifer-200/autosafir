import type { VehicleStatus } from "@/types/vehicle";

const labels: Record<VehicleStatus, string> = {
  AVAILABLE: "موجود",
  RESERVED: "رزرو شده",
  SOLD: "فروخته شده",
};

export function AdminStatus({ status }: { status: VehicleStatus }) {
  return (
    <span className="admin-status" data-status={status}>
      <span aria-hidden="true" />
      {labels[status]}
    </span>
  );
}
