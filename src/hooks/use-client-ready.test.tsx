import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AdminLogin } from "@/components/admin/admin-login";
import { useClientReady } from "./use-client-ready";

function ClientForm() {
  const ready = useClientReady();
  return <button disabled={!ready}>Submit</button>;
}

describe("client-only form readiness", () => {
  it("renders a disabled submit in static HTML", () => {
    expect(renderToStaticMarkup(<ClientForm />)).toContain('disabled=""');
  });
  it("enables submission after client hydration", () => {
    render(<ClientForm />);
    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });
  it("disables all login controls before the UI gate is active", () => {
    const html = renderToStaticMarkup(<AdminLogin />);
    expect(html.match(/disabled=""/g)).toHaveLength(3);
  });
});
