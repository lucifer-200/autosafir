import type { ComponentProps, ReactNode } from "react";

interface FieldFrameProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FieldFrame({
  label,
  htmlFor,
  error,
  hint,
  children,
}: FieldFrameProps) {
  const descriptionId = `${htmlFor}-description`;

  return (
    <div className="lead-field" data-invalid={error ? "true" : undefined}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {(error || hint) && (
        <p id={descriptionId} role={error ? "alert" : undefined}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function fieldA11yProps(id: string, error?: string, hasHint = false) {
  return {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error || hasHint ? `${id}-description` : undefined,
  };
}

export function LeadInput(props: ComponentProps<"input">) {
  return <input {...props} />;
}

export function LeadSelect(props: ComponentProps<"select">) {
  return <select {...props} />;
}

export function LeadTextarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} />;
}
