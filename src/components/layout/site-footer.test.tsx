import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("keeps navigation and AKH without duplicating showroom contact data", () => {
    render(<SiteFooter />);

    expect(
      screen.queryByRole("link", { name: "اینستاگرام اتو سفیر" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "AKH" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Developed by AKH" }),
    ).toBeInTheDocument();
  });
});
