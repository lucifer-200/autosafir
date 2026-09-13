"use client";

import { Check, Copy, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

export async function copyTextToClipboard(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();

  try {
    if (!document.execCommand("copy")) throw new Error("Copy was rejected");
  } finally {
    field.remove();
  }
}

export function CopyAddressButton({ address }: { address: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const statusId = useId();
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copyAddress() {
    if (resetTimer.current) clearTimeout(resetTimer.current);

    try {
      await copyTextToClipboard(address);
      setState("copied");
    } catch {
      setState("failed");
    }

    resetTimer.current = setTimeout(() => setState("idle"), 3200);
  }

  const label =
    state === "copied"
      ? "نشانی کپی شد"
      : state === "failed"
        ? "کپی نشد؛ نشانی را دستی انتخاب کنید"
        : "کپی نشانی";

  return (
    <div className="copy-address">
      <button
        type="button"
        onClick={copyAddress}
        aria-describedby={statusId}
        data-state={state}
      >
        {state === "copied" ? (
          <Check size={18} aria-hidden="true" />
        ) : state === "failed" ? (
          <WarningCircle size={18} aria-hidden="true" />
        ) : (
          <Copy size={18} aria-hidden="true" />
        )}
        {label}
      </button>
      <span id={statusId} className="sr-only" role="status" aria-live="polite">
        {state === "idle" ? "" : label}
      </span>
    </div>
  );
}
