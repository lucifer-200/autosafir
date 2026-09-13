import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SellCarForm } from "./sell-car-form";

describe("SellCarForm", () => {
  it("associates first-step validation errors and stays on the invalid step", async () => {
    render(<SellCarForm />);

    fireEvent.click(screen.getByRole("button", { name: /مرحله بعد/ }));

    expect(await screen.findByText("برند را وارد کنید.")).toBeInTheDocument();
    expect(screen.getByLabelText("برند")).toHaveAttribute(
      "aria-describedby",
      "sell-brand-description",
    );
    expect(screen.getByText(/مرحله 1 از 5/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("برند"), {
      target: { value: "Demo" },
    });
    fireEvent.change(screen.getByLabelText("مدل"), {
      target: { value: "One" },
    });
    fireEvent.change(screen.getByLabelText("سال ساخت"), {
      target: { value: "2025" },
    });
    fireEvent.change(screen.getByLabelText("کارکرد (کیلومتر)"), {
      target: { value: "100" },
    });
    fireEvent.click(screen.getByRole("button", { name: /مرحله بعد/ }));

    expect(await screen.findByLabelText("رنگ بدنه")).toBeInTheDocument();
    expect(screen.getByText(/مرحله 2 از 5/)).toBeInTheDocument();
  });

  it("clearly labels local media as non-uploading", async () => {
    render(<SellCarForm />);
    fireEvent.change(screen.getByLabelText("برند"), {
      target: { value: "Demo" },
    });
    fireEvent.change(screen.getByLabelText("مدل"), {
      target: { value: "One" },
    });
    fireEvent.change(screen.getByLabelText("سال ساخت"), {
      target: { value: "2025" },
    });
    fireEvent.change(screen.getByLabelText("کارکرد (کیلومتر)"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByRole("button", { name: /مرحله بعد/ }));

    fireEvent.change(await screen.findByLabelText("رنگ بدنه"), {
      target: { value: "مشکی" },
    });
    fireEvent.change(screen.getByLabelText("رنگ کابین"), {
      target: { value: "کرم" },
    });
    fireEvent.click(screen.getByRole("button", { name: /مرحله بعد/ }));

    expect(
      await screen.findByText(/فقط پیش‌نمایش محلی و بدون آپلود/),
    ).toBeInTheDocument();
  });
});
