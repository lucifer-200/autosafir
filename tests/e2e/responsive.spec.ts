import { expect, test } from "@playwright/test";

const viewports = [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 844, height: 390 },
];

for (const viewport of viewports) {
  for (const theme of ["light", "dark"] as const) {
    test(`${viewport.width}x${viewport.height} ${theme}: public and admin stay within the viewport`, async ({
      page,
    }, info) => {
      test.skip(
        info.project.name !== "desktop-chromium",
        "explicit viewport matrix",
      );
      test.setTimeout(90_000);
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await page.addInitScript((savedTheme) => {
        localStorage.setItem("autosafir-theme-v1", savedTheme);
        sessionStorage.setItem("autosafir:admin-demo-session", "active");
      }, theme);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", (response) => {
        if (response.status() >= 400) errors.push(response.url());
      });

      for (const route of [
        "/",
        "/collection/",
        "/vehicle/?slug=volkswagen-tiguan-2018",
        "/compare/",
        "/sell-your-car/",
        "/book-visit/",
        "/admin/",
        "/admin/vehicles/",
        "/admin/vehicles/new/",
      ]) {
        await page.goto(route, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        const geometry = await page.evaluate(() => {
          const title = document.querySelector<HTMLElement>(
            ".vehicle-detail-hero h1 span",
          );
          const copy = document.querySelector<HTMLElement>(
            ".vehicle-detail-hero__copy",
          );
          const titleBox = title?.getBoundingClientRect();
          const copyBox = copy?.getBoundingClientRect();
          const fields = ["mileage", "slug"].map((name) => {
            const box = document
              .querySelector<HTMLInputElement>(`input[name="${name}"]`)
              ?.getBoundingClientRect();
            return box ? { top: box.top, height: box.height } : null;
          });
          const action = document
            .querySelector(".home-primary-action")
            ?.getBoundingClientRect();
          const feature = document
            .querySelector(".home-feature-float")
            ?.getBoundingClientRect();
          const count = document
            .querySelector(".home-feature-float__count")
            ?.getBoundingClientRect();
          const featureAction = document
            .querySelector(".home-feature-float > a")
            ?.getBoundingClientRect();
          const headings = Array.from(
            document.querySelectorAll<HTMLElement>(".admin-ledger-head > span"),
          ).map((element) => element.getBoundingClientRect().right);
          const row = document.querySelector(".admin-vehicle-ledger li");
          const columns = row
            ? [
                ".admin-ledger-name",
                ".admin-ledger-spec",
                ".admin-status",
                ".admin-ledger-actions",
              ].map(
                (selector) =>
                  row.querySelector(selector)?.getBoundingClientRect().right,
              )
            : [];
          return {
            overflow:
              Math.max(
                document.documentElement.scrollWidth,
                document.body.scrollWidth,
              ) - innerWidth,
            titleFits:
              !title ||
              (!!titleBox &&
                !!copyBox &&
                title.scrollWidth <= title.clientWidth + 1 &&
                titleBox.right <= copyBox.right + 1),
            fields,
            headings,
            columns,
            heroClearance:
              action && feature ? feature.top - action.bottom : null,
            featureClearance:
              count && featureAction ? featureAction.top - count.bottom : null,
          };
        });
        expect(geometry.overflow, route).toBeLessThanOrEqual(1);
        expect(geometry.titleFits, route).toBe(true);
        if (route === "/" && viewport.width > 960) {
          expect(geometry.heroClearance).toBeGreaterThanOrEqual(16);
        }
        if (route === "/" && viewport.width <= 960) {
          expect(geometry.featureClearance).toBeGreaterThanOrEqual(8);
        }
        if (route === "/admin/vehicles/" && viewport.width >= 1280) {
          expect(geometry.headings).toHaveLength(4);
          geometry.headings.forEach((right, index) =>
            expect(
              Math.abs(right - geometry.columns[index]!),
            ).toBeLessThanOrEqual(1),
          );
        }
        if (route === "/admin/vehicles/new/" && viewport.width >= 640) {
          expect(geometry.fields[0]).not.toBeNull();
          expect(geometry.fields[1]).not.toBeNull();
          expect(
            Math.abs(geometry.fields[0]!.top - geometry.fields[1]!.top),
          ).toBeLessThanOrEqual(1);
          expect(
            Math.abs(geometry.fields[0]!.height - geometry.fields[1]!.height),
          ).toBeLessThanOrEqual(1);
        }
      }
      expect(errors).toEqual([]);
    });
  }
}
