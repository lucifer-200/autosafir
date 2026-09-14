import { expect, test } from "@playwright/test";

test("home is immediately usable, static and has no document scroll", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "اتو سفیر" }),
  ).toBeVisible();
  await expect(page.locator("canvas, .signature-intro")).toHaveCount(0);
  await expect(page.getByText("وضعیت مجموعه روی همین دستگاه")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "مشاهده خودروها", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => ({
        x: window.scrollX,
        y: window.scrollY,
        overflow: document.documentElement.scrollHeight > innerHeight,
        wide: document.documentElement.scrollWidth > innerWidth,
      })),
    )
    .toEqual({ x: 0, y: 0, overflow: false, wide: false });
  expect(errors).toEqual([]);
});

test("card URLs support direct entry, reload, history and real navigation", async ({
  page,
}) => {
  await page.goto("/#compare");
  await expect(page.locator('[data-scene="compare"]')).toBeVisible();
  await page.getByRole("button", { name: "کارت بعدی", exact: true }).click();
  await expect(page).toHaveURL(/#book-visit$/);
  await page.reload();
  await expect(page.locator('[data-scene="book-visit"]')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/#compare$/);
  await expect(page.locator('[data-scene="compare"]')).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/#book-visit$/);
  await page.getByRole("link", { name: "هماهنگی بازدید", exact: true }).click();
  await expect(page).toHaveURL(/\/book-visit\/$/);
  await page.mouse.wheel(0, 800);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);
});

test("wheel advances once per gesture and keyboard reaches destinations", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(700);
  await expect(page.locator('[data-scene="collection"]')).toBeVisible();
  await expect(page.locator('[data-scene="compare"]')).toBeVisible();
  await expect(page.locator('[data-scene="collection"]')).toHaveAttribute(
    "data-position",
    "active",
  );
  await expect(page.locator('[data-scene="compare"]')).toHaveAttribute(
    "data-position",
    "next",
  );
  await page.locator(".showroom-title").hover();
  await page.mouse.wheel(0, 150);
  await expect(page).toHaveURL(/#compare$/);
  await expect(page.locator('[data-scene="compare"]')).toHaveAttribute(
    "data-position",
    "active",
  );
  await expect(page.locator('[data-scene="book-visit"]')).toHaveAttribute(
    "data-position",
    "next",
  );
  await page.mouse.wheel(0, 150);
  await expect(page).toHaveURL(/#compare$/);
  await page.locator("main").focus();
  await page.keyboard.press("PageDown");
  await expect(page).toHaveURL(/#book-visit$/);
  await page.keyboard.press("PageUp");
  await expect(page).toHaveURL(/#compare$/);
});

test("reduced motion, unknown fragments and showroom links remain accessible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#unknown");
  await expect(page.locator('[data-scene="collection"]')).toBeVisible();
  await page.locator(".showroom-contact-trigger").click();
  await expect(page).toHaveURL(/#showroom$/);
  await expect(
    page.getByRole("link", { name: "اینستاگرام اتو سفیر" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /تماس همراه یک/ }),
  ).toHaveAttribute("href", "tel:09122222346");
  await page.getByRole("button", { name: "فعال‌کردن پوسته تیره" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("mobile swipe changes cards and showroom inner scrolling does not navigate", async ({
  page,
  context,
}, info) => {
  test.skip(info.project.name !== "mobile-chromium", "touch behavior");
  await page.goto("/");
  await page.waitForTimeout(700);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 210, y: 370 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 210, y: 230 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page).toHaveURL(/#compare$/);
  await page.locator(".showroom-contact-trigger").click();
  await expect(page.locator('[data-scene="showroom"]')).toBeVisible();
  await page
    .locator('[data-scene="showroom"] .showroom-contact-scroll')
    .dispatchEvent("wheel", { deltaY: 200 });
  await expect(page).toHaveURL(/#showroom$/);
});
