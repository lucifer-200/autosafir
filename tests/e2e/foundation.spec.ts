import { expect, test, type Page } from "@playwright/test";

import { DEMO_VEHICLE_SEED } from "../../src/data/demo-vehicles";

async function installSeedStatuses(
  page: Page,
  statuses: Record<string, "AVAILABLE" | "SOLD" | "RESERVED">,
) {
  const vehicles = DEMO_VEHICLE_SEED.map((vehicle) => ({
    ...vehicle,
    status: statuses[vehicle.slug] ?? vehicle.status,
  }));
  await page.addInitScript((seed) => {
    localStorage.setItem(
      "autosafir:vehicles",
      JSON.stringify({ version: 1, revision: 1, vehicles: seed }),
    );
  }, vehicles);
}

async function gotoHomeWithoutIntro(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("autosafir:intro-complete", "1");
  });
  await page.goto("/");
}

test("exports an RTL foundation page with a persistent theme", async ({
  page,
}, testInfo) => {
  await gotoHomeWithoutIntro(page);

  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "اتو سفیر",
  );

  if (testInfo.project.name === "mobile-chromium") {
    await page.getByRole("button", { name: "باز کردن منوی اصلی" }).click();
  }
  await page.getByRole("button", { name: "فعال‌کردن پوسته روشن" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("signature intro is skippable, unlocks scroll, and stays skipped in-session", async ({
  page,
}) => {
  await page.goto("/");
  const intro = page.getByRole("dialog", { name: "معرفی اتو سفیر" });
  await expect(intro).toBeVisible();
  await page.getByRole("button", { name: "رد شدن از معرفی" }).click();
  await expect(intro).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(
    page.getByRole("heading", { level: 1, name: "اتو سفیر" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /مشاهده خودروها/ }),
  ).toHaveAttribute("href", "/collection/");

  await page.reload();
  await expect(intro).toHaveCount(0);
});

test("signature intro honors reduced motion without trapping the page", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "معرفی اتو سفیر" })).toBeHidden(
    {
      timeout: 2_000,
    },
  );
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator("[data-render-tier]")).toHaveAttribute(
    "data-render-tier",
    "static",
  );
  await expect(page.locator(".adaptive-hero-media__canvas")).toHaveCount(0);
  await expect(
    page.getByAltText("تصویر مفهومی خودروی لوکس در فضای معماری گرم"),
  ).toBeVisible();
});

test("adaptive WebGL falls back cleanly after context loss", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "single capable-device coverage",
  );
  await page.addInitScript(() => {
    sessionStorage.setItem("autosafir:intro-complete", "1");
    Object.defineProperty(navigator, "deviceMemory", {
      configurable: true,
      value: 8,
    });
    Object.defineProperty(navigator, "hardwareConcurrency", {
      configurable: true,
      value: 8,
    });
  });
  await page.goto("/");

  const media = page.locator("[data-render-tier]");
  await expect(media).toHaveAttribute("data-render-tier", "webgl");
  const canvas = page.locator(".adaptive-hero-media__canvas canvas");
  await expect(canvas).toBeVisible();
  await canvas.dispatchEvent("webglcontextlost");

  await expect(media).toHaveAttribute("data-render-tier", "cinematic");
  await expect(canvas).toHaveCount(0);
  await expect(
    page.getByAltText("تصویر مفهومی خودروی لوکس در فضای معماری گرم"),
  ).toBeVisible();
});

test("publishes a restrictive robots file", async ({ request }) => {
  const response = await request.get("/robots.txt");

  expect(response.ok()).toBe(true);
  await expect(response.text()).resolves.toContain("Disallow: /");
});

test("mobile menu supports keyboard dismissal and exposes no admin entry", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-chromium",
    "mobile shell behavior",
  );
  await gotoHomeWithoutIntro(page);

  const trigger = page.getByRole("button", { name: "باز کردن منوی اصلی" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "منوی اصلی" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /خودروها/ })).toHaveAttribute(
    "href",
    "/collection/",
  );
  await expect(dialog.getByRole("link", { name: /ادمین/i })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("desktop shell shows primary navigation and footer signature", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "desktop shell behavior",
  );
  await gotoHomeWithoutIntro(page);

  await expect(
    page.getByRole("navigation", { name: "ناوبری اصلی" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Developed by AKH" }),
  ).toBeVisible();
  await expect(page.getByRole("img", { name: "AKH" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "باز کردن منوی اصلی" }),
  ).toBeHidden();
});

test("collection filters local inventory and keeps sold vehicles visible", async ({
  page,
}) => {
  await installSeedStatuses(page, { "mitsubishi-pajero-2022": "SOLD" });
  await page.goto("/collection/");

  await expect(
    page.getByRole("heading", { level: 1, name: "مجموعه خودروها" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("link", { name: "مشاهده Mitsubishi Pajero" })
      .locator('[data-status="SOLD"]'),
  ).toContainText("فروخته شده");
  await page.getByRole("button", { name: "فروخته‌شده" }).click();
  await expect(
    page.getByRole("link", { name: "مشاهده Mitsubishi Pajero" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "مشاهده Volkswagen Tiguan" }),
  ).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/قیمت|price/i);
});

test("mobile collection filter sheet handles reserved and keyboard dismissal", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-chromium",
    "mobile collection behavior",
  );
  await installSeedStatuses(page, { "bmw-428-convertible-2015": "RESERVED" });
  await page.goto("/collection/");

  const trigger = page.getByRole("button", { name: "فیلترها" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "فیلتر خودروها" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("وضعیت موجودی").selectOption("RESERVED");
  await dialog.getByRole("button", { name: "نمایش نتیجه" }).click();
  await expect(
    page.getByRole("link", { name: "مشاهده BMW 428" }),
  ).toBeVisible();

  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("vehicle detail is static-safe, complete, and exposes no public price", async ({
  page,
}) => {
  await page.goto("/vehicle/?slug=volkswagen-tiguan-2018");

  await expect(
    page.getByRole("heading", { level: 1, name: /Volkswagen.*Tiguan/ }),
  ).toBeVisible();
  await expect(page.locator(".vehicle-detail-hero .vehicle-status")).toHaveText(
    "موجود",
  );
  await expect(
    page.getByRole("region", { name: /گالری تصویر و ویدیوی/ }),
  ).toBeVisible();
  await expect(page.getByText("تصویر اختصاصی این خودرو")).toBeVisible();
  await expect(page.getByRole("link", { name: /رزرو بازدید/ })).toHaveAttribute(
    "href",
    "/book-visit/?vehicle=volkswagen-tiguan-2018",
  );
  await expect(
    page.getByRole("link", { name: /افزودن به مقایسه/ }),
  ).toHaveAttribute("href", "/compare/?add=volkswagen-tiguan-2018");
  await expect(page.locator("body")).not.toContainText(/قیمت|price/i);
});

test("sold detail remains available with an alternatives action", async ({
  page,
}) => {
  await installSeedStatuses(page, { "mitsubishi-pajero-2022": "SOLD" });
  await page.goto("/vehicle/?slug=mitsubishi-pajero-2022");

  await expect(page.getByText("SOLD ARCHIVE")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /مشاهده خودروهای مشابه/ }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /رزرو بازدید/ })).toHaveCount(0);
});

test("invalid and missing vehicle slugs have premium recovery states", async ({
  page,
}) => {
  await page.goto("/vehicle/?slug=not-a-demo-record");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "این خودرو در مجموعه پیدا نشد",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "بازگشت به مجموعه خودروها" }),
  ).toBeVisible();

  await page.goto("/vehicle/");
  await expect(
    page.getByRole("heading", { level: 1, name: "آدرس خودرو کامل نیست" }),
  ).toBeVisible();
});

test("a browser-persisted vehicle opens in detail without a rebuild", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "autosafir:vehicles",
      JSON.stringify({
        version: 1,
        revision: 7,
        vehicles: [
          {
            id: "20000000-0000-4000-8000-000000000001",
            slug: "locally-created-vehicle-2026",
            brand: "Local Demo",
            model: "Created",
            trim: "Record",
            year: 2026,
            mileage: 18,
            features: ["ویژگی ثبت‌شده محلی"],
            media: [],
            status: "RESERVED",
            createdAt: "2026-09-12T00:00:00.000Z",
          },
        ],
      }),
    );
  });

  await page.goto("/vehicle/?slug=locally-created-vehicle-2026");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Local Demo.*Created.*Record/,
    }),
  ).toBeVisible();
  await expect(page.getByText("رزرو شده")).toBeVisible();
  await expect(page.getByText("ویژگی ثبت‌شده محلی")).toBeVisible();
});

test("compare accepts detail links, persists selection, and shows subtle differences", async ({
  page,
}) => {
  await installSeedStatuses(page, { "mitsubishi-pajero-2022": "SOLD" });
  await page.goto("/compare/?add=volkswagen-tiguan-2018");
  await expect(
    page.getByRole("heading", { name: "یک خودرو دیگر انتخاب کنید" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Mitsubishi Pajero/ }).click();

  const table = page.getByRole("table");
  await expect(table).toBeVisible();
  await expect(table.getByRole("rowheader", { name: /وضعیت/ })).toBeVisible();
  await expect(table.getByRole("cell", { name: "موجود" })).toBeVisible();
  await expect(table.getByRole("cell", { name: "فروخته شده" })).toBeVisible();
  await expect(table.locator("td[data-different]").first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/قیمت|price/i);

  await page.reload();
  await expect(page.getByRole("table")).toBeVisible();
});

test("compare enforces three selections and supports removal", async ({
  page,
}) => {
  await page.goto("/compare/");
  await page.getByRole("button", { name: /Volkswagen Tiguan/ }).click();
  await page.getByRole("button", { name: /BMW 428/ }).click();
  await page.getByRole("button", { name: /Toyota RAV4/ }).click();
  await expect(page.getByText("حداکثر سه خودرو انتخاب شده است.")).toBeVisible();

  await page.getByRole("button", { name: /حذف BMW 428/ }).click();
  await expect(page.getByText("1 جای خالی")).toBeVisible();
});

test("sell-your-car completes five truthful demo steps without exposing a price", async ({
  page,
}) => {
  await page.goto("/sell-your-car/");

  await expect(
    page.getByRole("heading", { level: 1, name: "فروش خودرو" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /مرحله بعد/ }).click();
  await expect(page.getByText("برند را وارد کنید.")).toBeVisible();

  await page.getByLabel("برند").fill("Demo");
  await page.getByLabel("مدل").fill("Concierge");
  await page.getByLabel("سال ساخت").fill("2025");
  await page.getByLabel("کارکرد (کیلومتر)").fill("1200");
  await page.getByRole("button", { name: /مرحله بعد/ }).click();

  await page.getByLabel("رنگ بدنه").fill("مشکی");
  await page.getByLabel("رنگ کابین").fill("کرم");
  await page.getByRole("button", { name: /مرحله بعد/ }).click();
  await expect(page.getByText(/فقط پیش‌نمایش محلی/)).toBeVisible();
  await page.getByRole("button", { name: /مرحله بعد/ }).click();

  await page.getByLabel("نام و نام خانوادگی").fill("کاربر نمایشی");
  await page.getByLabel("شماره موبایل").fill("09121234567");
  await page.getByRole("button", { name: /مرحله بعد/ }).click();
  await expect(
    page.getByText(/هیچ اطلاعاتی به اتو سفیر ارسال نمی‌شود/),
  ).toBeVisible();
  await page.getByRole("button", { name: "تکمیل نسخه نمایشی" }).click();

  await expect(
    page.getByRole("heading", { name: "بازبینی اطلاعات کامل شد" }),
  ).toBeVisible();
  await expect(page.getByText(/ارسال یا ذخیره نکرده است/)).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/قیمت|price/i);
});

test("booking preselects the vehicle and rejects past dates before demo completion", async ({
  page,
}) => {
  await page.goto("/book-visit/?vehicle=volkswagen-tiguan-2018");

  await expect(
    page.getByRole("heading", { level: 1, name: "رزرو بازدید" }),
  ).toBeVisible();
  await expect(page.getByLabel("خودرو")).toHaveValue("volkswagen-tiguan-2018");
  await page.getByLabel("نام و نام خانوادگی").fill("کاربر نمایشی");
  await page.getByLabel("شماره موبایل").fill("09121234567");
  await page.getByLabel("شعبه").selectOption("beheshti");
  await page.getByLabel("تاریخ").fill("2020-01-01");
  await page.getByLabel("زمان").fill("12:30");
  await page.getByRole("button", { name: "تکمیل درخواست نمایشی" }).click();
  await expect(
    page.getByText("تاریخ بازدید نمی‌تواند گذشته باشد."),
  ).toBeVisible();

  const futureDate = await page.evaluate(() => {
    const value = new Date();
    value.setDate(value.getDate() + 2);
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  });
  await page.getByLabel("تاریخ").fill(futureDate);
  await page.getByRole("button", { name: "تکمیل درخواست نمایشی" }).click();

  await expect(
    page.getByRole("heading", { name: "درخواست بازدید آماده شد" }),
  ).toBeVisible();
  await expect(
    page.getByText(/هیچ رزروی را برای اتو سفیر ثبت نکرده است/),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /تماس مستقیم/ })).toHaveAttribute(
    "href",
    "tel:09122222346",
  );
});

test("about remains concise and labels the concept honestly", async ({
  page,
}) => {
  await page.goto("/about/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "فضایی برای انتخابِ آرام‌تر.",
    }),
  ).toBeVisible();
  await expect(page.getByText(/نسخه یک کانسپت نمایشی است/)).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/بزرگ‌ترین|تأسیس|قیمت/i);
});

test("branches expose confirmed addresses, click-to-call, and truthful copy feedback", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/branches/");

  const main = page.locator("#main-content");
  await expect(main.getByText("خیابان بهشتی، تقاطع احمد قصیر")).toBeVisible();
  await expect(main.getByText("خیابان مطهری، تقاطع مفتح")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /تماس همراه یک/ }),
  ).toHaveAttribute("href", "tel:09122222346");

  await page.getByRole("button", { name: "کپی نشانی" }).first().click();
  await expect(
    page.getByRole("button", { name: "نشانی کپی شد" }),
  ).toBeVisible();
  await expect(page.getByText(/نقشه|map/i)).toHaveCount(0);
});

test("contact uses the confirmed outbound channels", async ({ page }) => {
  await page.goto("/contact/");

  await expect(
    page.getByRole("heading", { level: 1, name: /گفت‌وگو/ }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Instagram/ })).toHaveAttribute(
    "href",
    "https://www.instagram.com/autosafirgallery",
  );
  await expect(page.getByRole("link", { name: /Telegram/ })).toHaveAttribute(
    "href",
    "https://t.me/autosafirgallery1",
  );
  await expect(
    page.getByRole("link", { name: /WhatsApp Channel/ }),
  ).toHaveAttribute(
    "href",
    "https://whatsapp.com/channel/0029VaZuzPzJJhzbIJ00r21R",
  );
});

test("journal exports static articles, related inventory action, and resilient stories", async ({
  page,
}) => {
  await page.goto("/journal/");

  await expect(
    page.getByRole("heading", { level: 1, name: "ژورنال" }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(7);
  await expect(
    page.getByRole("heading", { name: "SAFIR STORIES" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Volkswagen Tiguan/ }),
  ).toHaveAttribute(
    "href",
    "https://www.instagram.com/autosafirgallery/p/Dc0EIIlDPju/",
  );

  await page.getByRole("link", { name: /چطور دو تریم نزدیک/ }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: /چطور دو تریم نزدیک/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "مشاهده مجموعه" }),
  ).toHaveAttribute("href", "/collection/");
  await expect(page.locator("body")).not.toContainText(/قیمت|price/i);
});
