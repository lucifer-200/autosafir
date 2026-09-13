"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { AdminVehicleForm } from "@/components/admin/admin-vehicle-form";

function EditVehicleFromQuery() {
  const id = useSearchParams().get("id") ?? undefined;
  return <AdminVehicleForm vehicleId={id} />;
}

export default function EditVehiclePage() {
  return (
    <Suspense
      fallback={
        <main className="admin-page">
          <p className="admin-loading">در حال خواندن رکورد…</p>
        </main>
      }
    >
      <EditVehicleFromQuery />
    </Suspense>
  );
}
