import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("renders confirmed contact channels and the accessible custom AKH mark", () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("link", { name: "اینستاگرام اتو سفیر" }),
    ).toHaveAttribute("href", "https://www.instagram.com/autosafirgallery");
    expect(screen.getByRole("img", { name: "AKH" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Developed by AKH" }),
    ).toBeInTheDocument();
  });
});
