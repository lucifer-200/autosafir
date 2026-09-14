import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("docs/home-redesign", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
for (const [width, height] of [
  [360, 640],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [844, 390],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  for (const theme of ["light", "dark"]) {
    if (theme === "dark")
      await page.locator(".showroom-tools button").first().click();
    for (const scene of ["collection", "showroom"]) {
      await page.evaluate((value) => {
        location.hash = value;
      }, scene);
      await page.waitForTimeout(600);
      await page.screenshot({
        path: `docs/home-redesign/${width}x${height}-${theme}-${scene}.png`,
      });
      const layout = await page.evaluate(() => {
        const visible = (element) =>
          element.checkVisibility({ checkVisibilityCSS: true }) &&
          !element.closest("[inert]");
        const candidates = [
          ...document.querySelectorAll(
            ".showroom-home button, .showroom-home a",
          ),
        ].filter(visible);
        return {
          scrollHeight: document.documentElement.scrollHeight,
          scrollWidth: document.documentElement.scrollWidth,
          height: innerHeight,
          width: innerWidth,
          offscreenControls: candidates
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return (
                r.top < 0 ||
                r.bottom > innerHeight ||
                r.left < 0 ||
                r.right > innerWidth
              );
            })
            .map((e) => e.getAttribute("aria-label") || e.textContent),
          obscuredControls: candidates
            .filter((e) => !e.closest(".showroom-contact-scroll"))
            .filter((e) => {
              const r = e.getBoundingClientRect();
              const top = document.elementFromPoint(
                r.x + r.width / 2,
                r.y + r.height / 2,
              );
              return top && !e.contains(top);
            })
            .map((e) => e.getAttribute("aria-label") || e.textContent),
          image: document.querySelector(".showroom-backdrop img").currentSrc,
        };
      });
      results.push({ width, height, theme, scene, ...layout, errors });
    }
  }
  await page.close();
}
await browser.close();
await writeFile(
  "docs/home-redesign/responsive-checks.json",
  JSON.stringify(results, null, 2),
);
const failed = results.filter(
  (r) =>
    r.scrollHeight > r.height ||
    r.scrollWidth > r.width ||
    r.offscreenControls.length ||
    r.obscuredControls.length ||
    r.errors.length,
);
console.log(JSON.stringify({ states: results.length, failed }, null, 2));
if (failed.length) process.exitCode = 1;
