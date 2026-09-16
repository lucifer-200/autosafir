import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    prefetch,
  }: {
    href: string;
    children: ReactNode;
    prefetch?: boolean;
  }) => (
    <a href={href} data-prefetch={String(prefetch)}>
      {children}
    </a>
  ),
}));

import { StaticLink } from "./static-link";

describe("static-safe internal navigation", () => {
  it("preserves the destination and link content", () => {
    render(<StaticLink href="/collection/?status=SOLD">Collection</StaticLink>);
    expect(screen.getByRole("link", { name: "Collection" })).toHaveAttribute(
      "href",
      "/collection/?status=SOLD",
    );
  });
  it("never relies on speculative segment prefetch, even when requested", () => {
    render(
      <StaticLink href="/compare/" prefetch>
        Compare
      </StaticLink>,
    );
    expect(screen.getByRole("link", { name: "Compare" })).toHaveAttribute(
      "data-prefetch",
      "false",
    );
  });
});
