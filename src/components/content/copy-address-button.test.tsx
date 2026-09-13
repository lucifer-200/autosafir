import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CopyAddressButton } from "./copy-address-button";

describe("CopyAddressButton", () => {
  const writeText = vi.fn();

  beforeEach(() => {
    writeText.mockReset();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  it("copies the exact address and announces success", async () => {
    writeText.mockResolvedValue(undefined);
    render(<CopyAddressButton address="خیابان بهشتی، تقاطع احمد قصیر" />);

    fireEvent.click(screen.getByRole("button", { name: "کپی نشانی" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("خیابان بهشتی، تقاطع احمد قصیر");
      expect(
        screen.getByRole("button", { name: "نشانی کپی شد" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent("نشانی کپی شد");
    });
  });

  it("reports a rejected clipboard write without claiming success", async () => {
    writeText.mockRejectedValue(new Error("permission denied"));
    render(<CopyAddressButton address="خیابان مطهری، تقاطع مفتح" />);

    fireEvent.click(screen.getByRole("button", { name: "کپی نشانی" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "کپی نشد؛ نشانی را دستی انتخاب کنید",
        }),
      ).toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent("کپی نشد");
    });
  });
});
