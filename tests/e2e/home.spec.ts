import { expect, test } from "@playwright/test";

test("home exposes the complete editorial journey with natural scrolling", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "انتخابی برای",
  );
  await expect(page.locator("canvas, .signature-intro")).toHaveCount(0);
  await expect(page.locator("[data-three-slot]")).toHaveCount(1);
  await expect(page.locator(".home-primary-action")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "انتخاب‌های امروز" }),
  ).toBeAttached();
  await expect(
    page.getByRole("heading", { name: "دو نقطه، یک تجربه." }),
  ).toBeAttached();

  await page.mouse.wheel(0, 900);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  expect(errors).toEqual([]);
});

test("home navigation, contact and theme persistence remain functional", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /شعبه بهشتی/ })).toHaveAttribute(
    "href",
    "tel:09122222346",
  );
  await expect(
    page.locator('.home-header a[href*="sell-your-car"]'),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "فعال‌کردن پوسته تیره" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("mobile keeps a compact quick-action dock without trapping scroll", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile-chromium", "mobile layout");
  await page.goto("/");
  const dock = page.getByRole("navigation", { name: "دسترسی سریع" });
  await expect(dock).toBeVisible();
  await expect(dock.getByRole("link")).toHaveCount(5);
  await page.mouse.wheel(0, 1000);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);
});

test("reduced motion keeps content accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "انتخاب را دقیق‌تر کنید." }),
  ).toBeAttached();
  await expect(page.getByRole("link", { name: "شروع مقایسه" })).toHaveAttribute(
    "href",
    /\/compare\/?/,
  );
});
