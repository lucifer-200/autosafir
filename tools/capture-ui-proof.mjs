import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const output = path.resolve("review", "frontend-proof");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await context.addInitScript(() => {
    localStorage.setItem("autosafir-theme-v1", "light");
    sessionStorage.setItem("autosafir:admin-demo-session", "active");
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator(".home-hero")
    .screenshot({ path: path.join(output, "01-home.png") });
  await page.evaluate(() =>
    window.scrollTo(
      0,
      document.querySelector(".home-selected").getBoundingClientRect().top +
        scrollY +
        140,
    ),
  );
  await page.screenshot({ path: path.join(output, "02-selection.png") });
  await page.goto("http://127.0.0.1:4173/admin/vehicles/new/", {
    waitUntil: "networkidle",
  });
  await page
    .locator(".admin-form-section")
    .first()
    .screenshot({ path: path.join(output, "03-form.png") });
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("http://127.0.0.1:4173/admin/vehicles/", {
    waitUntil: "networkidle",
  });
  await page.screenshot({ path: path.join(output, "04-tablet-admin.png") });
  await context.close();
} finally {
  await browser.close();
}
console.log(`Saved proof screenshots in ${output}`);
