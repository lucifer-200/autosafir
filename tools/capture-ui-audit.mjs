import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.AUTOSAFIR_AUDIT_URL ?? "http://127.0.0.1:4173";
const outputRoot = path.resolve(
  process.env.AUTOSAFIR_AUDIT_OUTPUT ?? path.join("review", "audit-before"),
);

const routes = [
  ["home", "/"],
  ["collection", "/collection/"],
  ["vehicle", "/vehicle/?slug=volkswagen-tiguan-2018"],
  ["compare", "/compare/"],
  ["sell", "/sell-your-car/"],
  ["book", "/book-visit/"],
  ["about", "/about/"],
  ["branches", "/branches/"],
  ["contact", "/contact/"],
  ["journal", "/journal/"],
  ["admin-login", "/admin/login/"],
  ["admin-dashboard", "/admin/", true],
  ["admin-vehicles", "/admin/vehicles/", true],
  ["admin-vehicle-new", "/admin/vehicles/new/", true],
  ["admin-integrations", "/admin/integrations/", true],
  ["admin-settings", "/admin/settings/", true],
];

const selectedRoutes =
  process.env.AUTOSAFIR_AUDIT_SCOPE === "home"
    ? routes.filter(([name]) => name === "home")
    : process.env.AUTOSAFIR_AUDIT_SCOPE === "admin"
      ? routes.filter(([, route]) => route.startsWith("/admin"))
      : process.env.AUTOSAFIR_AUDIT_SCOPE === "responsive"
        ? routes.filter(([name]) =>
            [
              "home",
              "collection",
              "vehicle",
              "compare",
              "sell",
              "book",
              "admin-dashboard",
              "admin-vehicles",
              "admin-vehicle-new",
            ].includes(name),
          )
        : routes;

const matrix = process.env.AUTOSAFIR_AUDIT_MATRIX === "1";
const viewports = matrix
  ? [
      ["360x640", { width: 360, height: 640 }],
      ["390x844", { width: 390, height: 844 }],
      ["430x932", { width: 430, height: 932 }],
      ["768x1024", { width: 768, height: 1024 }],
      ["1024x768", { width: 1024, height: 768 }],
      ["1280x720", { width: 1280, height: 720 }],
      ["1440x900", { width: 1440, height: 900 }],
      ["1920x1080", { width: 1920, height: 1080 }],
      ["844x390", { width: 844, height: 390 }],
    ]
  : [
      ["mobile", { width: 390, height: 844 }],
      ["desktop", { width: 1440, height: 900 }],
    ];
const themes = matrix ? ["light", "dark"] : ["light"];

await mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const report = [];

try {
  for (const [viewportName, viewport] of viewports) {
    for (const theme of themes) {
      const context = await browser.newContext({
        colorScheme: theme,
        reducedMotion: matrix ? "reduce" : "no-preference",
        viewport,
      });
      await context.addInitScript((savedTheme) => {
        window.localStorage.setItem("autosafir-theme-v1", savedTheme);
      }, theme);

      for (const [routeName, route, authenticated] of selectedRoutes) {
        const page = await context.newPage();
        const consoleErrors = [];
        const failedResponses = [];
        const pageErrors = [];

        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        page.on("pageerror", (error) => pageErrors.push(error.message));
        page.on("response", (response) => {
          if (response.status() >= 400) {
            failedResponses.push({
              status: response.status(),
              url: response.url(),
            });
          }
        });

        if (authenticated) {
          await page.addInitScript(() => {
            window.sessionStorage.setItem(
              "autosafir:admin-demo-session",
              "active",
            );
          });
        }

        await page.goto(new URL(route, baseUrl).href, {
          waitUntil: "networkidle",
        });
        await page.evaluate(() => document.fonts.ready);

        const metrics = await page.evaluate(() => {
          const documentElement = document.documentElement;
          const body = document.body;
          const rect = (selector) => {
            const element = document.querySelector(selector);
            if (!(element instanceof HTMLElement)) return null;
            const box = element.getBoundingClientRect();
            return {
              bottom: Math.round(box.bottom),
              height: Math.round(box.height),
              left: Math.round(box.left),
              right: Math.round(box.right),
              top: Math.round(box.top),
              width: Math.round(box.width),
            };
          };

          return {
            bodyHeight: Math.round(body.getBoundingClientRect().height),
            cards: Array.from(
              document.querySelectorAll(
                ".home-vehicle-card, .vehicle-card, [data-vehicle-card]",
              ),
            ).map((element) => {
              const box = element.getBoundingClientRect();
              return {
                height: Math.round(box.height),
                width: Math.round(box.width),
              };
            }),
            contactCard: rect(".home-contact-float"),
            featureCard: rect(".home-feature-float"),
            heroFrame: rect(".home-frame"),
            horizontalOverflow:
              Math.max(documentElement.scrollWidth, body.scrollWidth) -
              documentElement.clientWidth,
            overflowElements: Array.from(document.querySelectorAll("body *"))
              .map((element) => {
                const box = element.getBoundingClientRect();
                return {
                  className:
                    element instanceof HTMLElement ? element.className : "",
                  left: Math.round(box.left),
                  right: Math.round(box.right),
                  tag: element.tagName.toLowerCase(),
                };
              })
              .filter(
                ({ left, right }) =>
                  right > documentElement.clientWidth + 1 || left < -1,
              )
              .slice(0, 20),
            viewport: {
              height: window.innerHeight,
              width: window.innerWidth,
            },
          };
        });

        const screenshotPath = path.join(
          outputRoot,
          `${viewportName}-${matrix ? `${theme}-` : ""}${routeName}.png`,
        );
        await page.screenshot({ fullPage: true, path: screenshotPath });

        report.push({
          consoleErrors,
          failedResponses,
          metrics,
          pageErrors,
          route,
          screenshotPath,
          theme,
          viewport: viewportName,
        });

        await page.close();
      }

      await context.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(outputRoot, "report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log(`Captured ${report.length} routes in ${outputRoot}`);
