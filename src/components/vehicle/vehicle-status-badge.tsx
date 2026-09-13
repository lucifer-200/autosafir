import { VEHICLE_STATUS_LABELS } from "@/features/vehicles/status";
import type { VehicleStatus } from "@/types/vehicle";

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <span className="vehicle-status" data-status={status}>
      <span aria-hidden="true" />
      {VEHICLE_STATUS_LABELS[status]}
    </span>
  );
}
