import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { TEST_VEHICLES } from "@/test/vehicle-fixtures";
import { getCompareStore } from "@/stores/compare-store";

import { CompareExperience } from "./compare-experience";

describe("CompareExperience", () => {
  beforeEach(() => {
    getCompareStore().getState().clear();
    getCompareStore().getState().hydrate();
  });

  it("guides empty and one-selection states", () => {
    const { rerender } = render(<CompareExperience vehicles={TEST_VEHICLES} />);
    expect(
      screen.getByRole("heading", {
        name: "مقایسه را با انتخاب خودرو آغاز کنید",
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Demo Aurora One/ }));
    rerender(<CompareExperience vehicles={TEST_VEHICLES} />);
    expect(
      screen.getByRole("heading", { name: "یک خودرو دیگر انتخاب کنید" }),
    ).toBeInTheDocument();
  });

  it("renders a complete comparison and removes a selected vehicle", () => {
    getCompareStore()
      .getState()
      .replace([TEST_VEHICLES[0].slug, TEST_VEHICLES[2].slug]);
    const { container } = render(
      <CompareExperience vehicles={TEST_VEHICLES} />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("rowheader", { name: /مدل و تیپ/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("موجود", { selector: "td" })).toBeInTheDocument();
    expect(
      screen.getByText("فروخته شده", { selector: "td" }),
    ).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/قیمت|price/i);

    fireEvent.click(screen.getByRole("button", { name: /حذف Demo Aurora/ }));
    expect(
      screen.getByRole("heading", { name: "یک خودرو دیگر انتخاب کنید" }),
    ).toBeInTheDocument();
  });

  it("keeps persisted selection while vehicle inventory is still hydrating", () => {
    getCompareStore()
      .getState()
      .replace([TEST_VEHICLES[0].slug, TEST_VEHICLES[1].slug]);
    const { rerender } = render(
      <CompareExperience vehicles={[]} inventoryHydrated={false} />,
    );

    expect(screen.getByText("در حال بازیابی انتخاب‌ها…")).toBeInTheDocument();
    expect(getCompareStore().getState().slugs).toHaveLength(2);

    rerender(<CompareExperience vehicles={TEST_VEHICLES} inventoryHydrated />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(getCompareStore().getState().slugs).toHaveLength(2);
  });
});
