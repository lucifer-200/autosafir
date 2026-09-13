import { access, readFile } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("out");
const requiredFiles = [
  "index.html",
  "404.html",
  "robots.txt",
  "about/index.html",
  "branches/index.html",
  "contact/index.html",
  "journal/index.html",
  "journal/premium-car-visit-checklist/index.html",
  "journal/how-to-compare-trims/index.html",
  "journal/cabin-technology-review/index.html",
  "journal/vehicle-documentation-file/index.html",
];

for (const file of requiredFiles) {
  await access(path.join(outputDirectory, file));
}

const indexHtml = await readFile(
  path.join(outputDirectory, "index.html"),
  "utf8",
);
const robotsTxt = await readFile(
  path.join(outputDirectory, "robots.txt"),
  "utf8",
);

if (!indexHtml.includes('lang="fa"') || !indexHtml.includes('dir="rtl"')) {
  throw new Error("The exported document is missing Persian RTL metadata.");
}

if (!indexHtml.includes("noindex") || !indexHtml.includes("nofollow")) {
  throw new Error(
    "The exported document is missing noindex/nofollow metadata.",
  );
}

if (!robotsTxt.includes("Disallow: /")) {
  throw new Error("The exported robots.txt does not block crawling.");
}

console.log(`Static export verified in ${outputDirectory}`);
