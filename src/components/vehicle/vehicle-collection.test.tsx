import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DEMO_VEHICLE_SEED } from "@/data/demo-vehicles";

import { CollectionExperience } from "./vehicle-collection";

describe("CollectionExperience", () => {
  it("shows every status with stable detail links and no public price", () => {
    render(<CollectionExperience vehicles={DEMO_VEHICLE_SEED} />);

    expect(screen.getAllByText("موجود").length).toBeGreaterThan(0);
    expect(screen.getAllByText("رزرو شده").length).toBeGreaterThan(0);
    expect(screen.getAllByText("فروخته شده").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "مشاهده Demo Aurora" }),
    ).toHaveAttribute("href", "/vehicle?slug=demo-aurora-one-2024");
    expect(document.body.textContent).not.toMatch(/قیمت|price/i);
  });

  it("updates results from search and quick filters", () => {
    render(<CollectionExperience vehicles={DEMO_VEHICLE_SEED} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "جستجوی برند یا مدل" }),
      {
        target: { value: "Atelier" },
      },
    );
    expect(
      screen.getByRole("link", { name: "مشاهده Demo Atelier" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "مشاهده Demo Aurora" }),
    ).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "جستجوی برند یا مدل" }),
      {
        target: { value: "" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "فروخته‌شده" }));
    expect(
      screen.getByRole("link", { name: "مشاهده Demo Studio" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "مشاهده Demo Atelier" }),
    ).not.toBeInTheDocument();
  });

  it("opens an accessible filter dialog, filters reserved, and restores focus", () => {
    render(<CollectionExperience vehicles={DEMO_VEHICLE_SEED} />);
    const trigger = screen.getByRole("button", { name: "فیلترها" });

    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "فیلتر خودروها" });
    expect(
      within(dialog).getByRole("button", { name: "بستن فیلترها" }),
    ).toHaveFocus();

    fireEvent.change(within(dialog).getByLabelText("وضعیت موجودی"), {
      target: { value: "RESERVED" },
    });
    fireEvent.click(
      within(dialog).getByRole("button", { name: "نمایش نتیجه" }),
    );

    expect(
      screen.getByRole("link", { name: "مشاهده Demo Atelier" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "مشاهده Demo Aurora" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("presents a recoverable empty state", () => {
    render(<CollectionExperience vehicles={DEMO_VEHICLE_SEED} />);
    fireEvent.change(
      screen.getByRole("searchbox", { name: "جستجوی برند یا مدل" }),
      {
        target: { value: "وجود ندارد" },
      },
    );

    expect(
      screen.getByRole("heading", { name: "خودرویی با این انتخاب پیدا نشد" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "نمایش همه خودروها" }));
    expect(screen.getAllByRole("link", { name: /مشاهده Demo/ })).toHaveLength(
      3,
    );
  });
});
