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
  await expect(page.locator("[data-three-slot]")).toHaveCount(0);
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

test("desktop hero cards stay inside the frame and editorial cards align", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop-chromium", "desktop layout");
  await page.goto("/");
  await expect(page.locator(".home-vehicle-card__media")).toHaveCount(3);
  await page.evaluate(() => document.fonts.ready);

  const geometry = await page.evaluate(() => {
    const box = (selector: string) => {
      const element = document.querySelector(selector);
      if (!(element instanceof HTMLElement)) return null;
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        top: rect.top,
      };
    };
    const media = Array.from(
      document.querySelectorAll<HTMLElement>(".home-vehicle-card__media"),
    ).map((element) => {
      const rect = element.getBoundingClientRect();
      return { height: rect.height, width: rect.width };
    });

    return {
      contact: box(".home-contact-float"),
      feature: box(".home-feature-float"),
      frame: box(".home-frame"),
      action: box(".home-primary-action"),
      media,
    };
  });

  expect(geometry.frame).not.toBeNull();
  expect(geometry.contact).not.toBeNull();
  expect(geometry.feature).not.toBeNull();
  expect(geometry.contact!.bottom).toBeLessThanOrEqual(geometry.frame!.bottom);
  expect(geometry.feature!.bottom).toBeLessThanOrEqual(geometry.frame!.bottom);
  expect(geometry.contact!.left).toBeGreaterThanOrEqual(geometry.frame!.left);
  expect(geometry.feature!.right).toBeLessThanOrEqual(geometry.frame!.right);
  expect(geometry.action!.bottom + 16).toBeLessThanOrEqual(
    geometry.feature!.top,
  );
  expect(geometry.media).toHaveLength(3);
  expect(
    Math.max(...geometry.media.map(({ width }) => width)) -
      Math.min(...geometry.media.map(({ width }) => width)),
  ).toBeLessThanOrEqual(1);
  expect(
    Math.max(...geometry.media.map(({ height }) => height)) -
      Math.min(...geometry.media.map(({ height }) => height)),
  ).toBeLessThanOrEqual(1);
});

test("editorial arrows never overlap the vehicle brand", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".home-vehicle-card__media")).toHaveCount(3);
  await page.evaluate(() => document.fonts.ready);
  const gaps = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".home-vehicle-card__body")).map(
      (body) => {
        const brand = body.querySelector("div p")!.getBoundingClientRect();
        const arrow = body.querySelector("svg")!.getBoundingClientRect();
        return brand.left - arrow.right;
      },
    ),
  );
  gaps.forEach((gap) => expect(gap).toBeGreaterThanOrEqual(8));
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
