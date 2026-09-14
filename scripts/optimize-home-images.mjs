import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Encode the supplied source locally; no remote image service is needed by the static export.
const source = "public/images/navigation/showroom-portrait.png";
const output = "public/images/home";
await mkdir(output, { recursive: true });
for (const width of [480, 768]) {
  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(`${output}/showroom-mobile-${width}.webp`);
  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .avif({ quality: 52 })
    .toFile(`${output}/showroom-mobile-${width}.avif`);
}
for (const format of ["webp", "avif"]) {
  await sharp(source)
    .extract({ left: 0, top: 550, width: 853, height: 780 })
    .toFormat(format, { quality: format === "webp" ? 84 : 60 })
    .toFile(`${output}/showroom-desktop.${format}`);
}
