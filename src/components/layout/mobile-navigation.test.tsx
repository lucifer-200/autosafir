import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MobileNavigation } from "./mobile-navigation";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("MobileNavigation", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("opens as an accessible modal with centralized public navigation", async () => {
    render(<MobileNavigation />);
    const trigger = screen.getByRole("button", { name: "باز کردن منوی اصلی" });

    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "منوی اصلی" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("link", { name: /خودروها/ })).toHaveAttribute(
      "href",
      "/collection",
    );
    expect(
      screen.queryByRole("link", { name: /ادمین/i }),
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes with Escape and restores focus to the trigger", async () => {
    render(<MobileNavigation />);
    const trigger = screen.getByRole("button", { name: "باز کردن منوی اصلی" });
    fireEvent.click(trigger);

    await screen.findByRole("dialog", { name: "منوی اصلی" });
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "منوی اصلی" }),
      ).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });
});
