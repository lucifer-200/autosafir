import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { THEME_STORAGE_KEY } from "@/lib/theme";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  it("switches from the default dark theme to light and persists the choice", async () => {
    document.documentElement.dataset.theme = "dark";

    render(<ThemeToggle />);

    const toggle = await screen.findByRole("button", {
      name: "فعال‌کردن پوسته روشن",
    });

    fireEvent.click(toggle);

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("responds to a valid theme change from another tab", async () => {
    render(<ThemeToggle />);

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: THEME_STORAGE_KEY,
        newValue: "light",
      }),
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "light");
    });
  });
});
