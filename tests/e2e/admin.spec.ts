import { expect, test, type Page } from "@playwright/test";

async function enterAdmin(page: Page) {
  await page.goto("/admin/login/");
  await page.getByLabel("نام کاربری").fill("demo");
  await page.getByLabel("رمز نمایشی").fill("autosafir");
  await page.getByRole("button", { name: "ورود به نسخه نمایشی" }).click();
  await expect(page).toHaveURL(/\/admin\/$/);
}

test("static login cannot submit before JavaScript is ready", async ({
  browser,
}, info) => {
  test.skip(info.project.name !== "desktop-chromium", "static HTML contract");
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/admin/login/");
    await expect(page.getByLabel("نام کاربری")).toBeDisabled();
    await expect(page.getByLabel("رمز نمایشی")).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "ورود به نسخه نمایشی" }),
    ).toBeDisabled();
    await expect(
      page.getByText(/JavaScript مرورگر باید فعال باشد/),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("mobile admin navigation traps focus and closes with Escape", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile-chromium", "mobile navigation");
  await enterAdmin(page);
  const trigger = page.getByRole("button", { name: "باز کردن ناوبری مدیریت" });
  const sidebar = page.locator(".admin-sidebar");
  await expect(sidebar).toHaveCSS("visibility", "hidden");
  await trigger.click();
  await expect(
    sidebar.getByRole("button", { name: "بستن ناوبری مدیریت" }),
  ).toBeFocused();
  await sidebar.getByRole("button", { name: "خروج از دمو" }).focus();
  await page.keyboard.press("Tab");
  await expect(sidebar.getByRole("link", { name: /AutoSafir/ })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(sidebar).toHaveCSS("visibility", "hidden");
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});

test("admin validation associates errors with controls", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop-chromium", "single validation flow");
  await enterAdmin(page);
  await page.goto("/admin/vehicles/new/");
  await page.getByRole("button", { name: "ثبت خودرو" }).click();
  const brand = page.getByLabel("برند");
  await expect(brand).toHaveAttribute("aria-invalid", "true");
  const description = await brand.getAttribute("aria-describedby");
  expect(description).toBeTruthy();
  await expect(page.locator(`[id="${description}"]`)).toHaveAttribute(
    "role",
    "alert",
  );
  await expect(page.locator(`[id="${description}"]`)).not.toBeEmpty();
});

test("admin gate is explicit about insecurity and exposes no secret claim", async ({
  page,
}) => {
  await page.goto("/admin/");
  await expect(page).toHaveURL(/\/admin\/login\/$/);
  await expect(
    page.getByRole("heading", { name: "ورود به پنل دمو" }),
  ).toBeVisible();
  await expect(page.getByText("دروازه نمایشی ناامن")).toBeVisible();
  await expect(page.getByText(/احراز هویت واقعی/)).toBeVisible();
});

test("admin dashboard loads without missing static prefetch payloads", async ({
  page,
}) => {
  const failedResponses: string[] = [];
  page.on("response", (response) => {
    if (response.status() >= 400) failedResponses.push(response.url());
  });

  await enterAdmin(page);
  await page.waitForLoadState("networkidle");

  expect(failedResponses).toEqual([]);
});

test("admin CRUD is reflected in the static-safe public store", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "single business flow",
  );
  await enterAdmin(page);
  await expect(
    page.getByRole("heading", { name: "نمای کلی موجودی" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /افزودن خودرو/ })
    .first()
    .click();
  await page.getByLabel("برند").fill("Phase Eight");
  await page.getByLabel("مدل").fill("Ledger");
  await page.getByLabel("تریم").fill("Demo");
  await page.getByLabel("کارکرد (کیلومتر)").fill("88");
  await expect(page.getByLabel("اسلاگ")).toHaveValue(
    /phase-eight-ledger-demo-/,
  );
  await page.getByLabel("ویژگی‌ها").fill("رکورد نمایشی فاز هشت");
  await page.getByRole("button", { name: "ثبت خودرو" }).click();
  await expect(page).toHaveURL(/\/admin\/vehicles\/$/);
  await expect(page.getByText("Phase Eight Ledger Demo")).toBeVisible();

  await page.goto("/admin/vehicles/new/");
  await page.getByLabel("برند").fill("Duplicate");
  await page.getByLabel("مدل").fill("Slug");
  await page.getByLabel("اسلاگ").fill("phase-eight-ledger-demo-2026");
  await page.getByRole("button", { name: "ثبت خودرو" }).click();
  await expect(
    page.getByText("این اسلاگ قبلاً استفاده شده است."),
  ).toBeVisible();

  await page.goto("/collection/");
  await expect(
    page.getByRole("link", { name: "مشاهده Phase Eight Ledger" }),
  ).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/قیمت|price/i);

  await page.goto("/admin/vehicles/");
  const record = page.locator("li", { hasText: "Phase Eight Ledger" });
  await record.getByRole("link", { name: "ویرایش" }).click();
  await page.locator('select[name="status"]').selectOption("SOLD");
  await page.getByRole("button", { name: "ذخیره تغییرات" }).click();
  await expect(page).toHaveURL(/\/admin\/vehicles\/$/);
  await page.goto("/collection/");
  const publicCard = page.getByRole("link", {
    name: "مشاهده Phase Eight Ledger",
  });
  await expect(publicCard.locator('[data-status="SOLD"]')).toContainText(
    "فروخته شده",
  );

  await page.goto("/admin/vehicles/");
  const soldRecord = page.locator("li", { hasText: "Phase Eight Ledger" });
  await soldRecord
    .getByRole("button", { name: "حذف Phase Eight Ledger" })
    .click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "حذف قطعی رکورد" }).click();
  await expect(page.getByText("Phase Eight Ledger Demo")).toHaveCount(0);
});

test("settings exports, confirms reset, and rejects invalid import atomically", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "single data flow");
  await enterAdmin(page);
  await page.goto("/admin/settings/");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "دریافت فایل JSON" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/autosafir-vehicles-.*\.json/);

  const before = await page.evaluate(() =>
    localStorage.getItem("autosafir:vehicles"),
  );
  await page.locator('input[type="file"]').setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":1,"revision":0,"vehicles":[{"price":10}]}'),
  });
  await expect(page.locator(".admin-alert")).toContainText(
    "داده فعلی بدون تغییر",
  );
  const after = await page.evaluate(() =>
    localStorage.getItem("autosafir:vehicles"),
  );
  expect(after).toBe(before);

  await page.locator('input[type="file"]').setInputFiles({
    name: "valid.json",
    mimeType: "application/json",
    buffer: Buffer.from(before ?? ""),
  });
  await expect(page.getByRole("alertdialog")).toContainText("رکورد معتبر");
  await page.getByRole("button", { name: "تأیید و جایگزینی" }).click();
  await expect(page.locator(".admin-notice")).toContainText("رکورد معتبر");

  await page.getByRole("button", { name: "بازنشانی با تأیید" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "بازنشانی قطعی" }).click();
  await expect(page.getByRole("status")).toContainText("seed");
});

test("integration simulation is explicitly mocked and can fail visibly", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "single simulation");
  await enterAdmin(page);
  await page.goto("/admin/integrations/");
  await expect(page.getByText("Website", { exact: true })).toBeVisible();
  await expect(page.getByText("Divar", { exact: true })).toBeVisible();
  await expect(page.getByText("n8n", { exact: true })).toBeVisible();
  await expect(page.getByText(/هیچ درخواست شبکه/)).toBeVisible();
  await page.getByLabel("شبیه‌سازی خطا در باما").check();
  await page.getByRole("button", { name: "اجرای شبیه‌سازی" }).click();
  await expect(
    page.locator('.admin-pipeline li[data-state="FAILED"]'),
  ).toContainText("باما", { timeout: 10_000 });
});

test("390px admin stays within the viewport in light and dark reduced motion", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "mobile QA");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await page.addInitScript(() =>
    localStorage.setItem("autosafir-theme-v1", "dark"),
  );
  await enterAdmin(page);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(390);
  await page.screenshot({
    path: "test-results/phase8-admin-dashboard-390-dark-reduced.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "باز کردن ناوبری مدیریت" }).click();
  await expect(
    page.getByRole("navigation", { name: "ناوبری مدیریت" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "فعال‌کردن پوسته روشن" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.goto("/admin/vehicles/new/");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(390);
  await page.screenshot({
    path: "test-results/phase8-admin-form-390-light-reduced.png",
    fullPage: true,
  });
});
