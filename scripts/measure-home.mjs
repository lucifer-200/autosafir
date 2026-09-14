import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] || "after";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const runs = [];
for (let run = 0; run < 3; run++) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: 200000,
    uploadThroughput: 93750,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    window.__homeMetrics = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__homeMetrics.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.__homeMetrics.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  runs.push(
    await page.evaluate(() => {
      const resources = performance.getEntriesByType("resource");
      const bytes = (pattern) =>
        resources
          .filter((e) => pattern.test(e.name))
          .reduce((sum, e) => sum + e.encodedBodySize, 0);
      return {
        ...window.__homeMetrics,
        jsBytes: bytes(/\.js(?:\?|$)/),
        imageBytes: bytes(/\.(png|webp|avif|svg)(?:\?|$)/),
      };
    }),
  );
  await context.close();
}
await browser.close();
await mkdir("docs/home-redesign", { recursive: true });
await writeFile(
  `docs/home-redesign/performance-${label}.json`,
  JSON.stringify(
    {
      profile: "Chrome, 390x844, cold cache, 1.6Mbps / 150ms RTT, CPU 4x",
      runs,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(runs));
