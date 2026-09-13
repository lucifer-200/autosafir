import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DEMO_VEHICLE_SEED } from "@/data/demo-vehicles";
import type { Vehicle } from "@/types/vehicle";

import { VehicleDetailExperience } from "./vehicle-detail";
import { VehicleGallery } from "./vehicle-gallery";

describe("VehicleDetailExperience", () => {
  it("keeps a sold vehicle visible and replaces booking with alternatives", () => {
    const sold = DEMO_VEHICLE_SEED.find((item) => item.status === "SOLD")!;
    const { container } = render(
      <VehicleDetailExperience vehicle={sold} related={[]} />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "DemoStudioThree",
    );
    expect(screen.getByText("فروخته شده")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /مشاهده خودروهای مشابه/ }),
    ).toHaveAttribute("href", "/collection");
    expect(
      screen.queryByRole("link", { name: /رزرو بازدید/ }),
    ).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/قیمت|price/i);
  });

  it("renders only recorded specifications and the missing-media state", () => {
    render(
      <VehicleDetailExperience vehicle={DEMO_VEHICLE_SEED[0]} related={[]} />,
    );

    expect(
      screen.getByRole("img", { name: "تصویر خودرو موجود نیست" }),
    ).toBeInTheDocument();
    expect(screen.getByText("صفر کیلومتر")).toBeInTheDocument();
    expect(screen.getByText("هماهنگی عمومی")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /افزودن به مقایسه/ }),
    ).toHaveAttribute("data-compare-slug", "demo-aurora-one-2024");
  });
});

describe("VehicleGallery", () => {
  it("opens an accessible lightbox, closes on Escape, and restores focus", async () => {
    const vehicle: Vehicle = {
      ...DEMO_VEHICLE_SEED[0],
      media: [
        { id: "one", type: "IMAGE", src: "/one.jpg", alt: "نمای جلو" },
        { id: "two", type: "IMAGE", src: "/two.jpg", alt: "نمای عقب" },
      ],
    };
    Element.prototype.scrollIntoView = vi.fn();
    render(
      <VehicleGallery media={vehicle.media} vehicleName="Demo Aurora One" />,
    );

    const trigger = screen.getByRole("button", { name: /باز کردن رسانه ۱/ });
    trigger.focus();
    fireEvent.click(trigger);
    expect(
      screen.getByRole("dialog", { name: /نمایش بزرگ Demo Aurora One/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "بستن نمایش بزرگ" }),
    ).toHaveFocus();

    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });
});
