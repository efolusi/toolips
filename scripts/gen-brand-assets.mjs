// Generates the static brand assets Next auto-detects by filename:
//   src/app/opengraph-image.png  (1200x630 social card; also used for Twitter)
//   src/app/apple-icon.png       (180x180 iOS home-screen icon)
//   src/app/favicon.ico          (32x32, PNG-in-ICO for the bare /favicon.ico)
//
// These are PRE-RENDERED with sharp and committed, so there is no runtime
// next/og (wasm) dependency — safe in the standalone Alpine image. Re-run after
// a brand change: `node scripts/gen-brand-assets.mjs` (from apps/web).
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const appDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "app");

// Canonical mark geometry (same path as src/app/icon.svg / components/BrandMark.tsx).
const MARK_VIEWBOX = "17.92 -7.08 672.16 722.16";
const MARK_PATH =
  "M 324 0 L 323 1 L 312 2 L 297 8 L 271 24 L 248 36 L 215 56 L 208 59 L 201 64 L 194 67 L 187 72 L 126 106 L 90 128 L 30 162 L 23 167 L 13 177 L 9 183 L 3 196 L 0 212 L 0 516 L 3 531 L 9 544 L 13 550 L 29 565 L 116 614 L 126 621 L 159 639 L 221 676 L 229 680 L 236 680 L 239 676 L 239 507 L 236 495 L 226 478 L 198 453 L 188 442 L 174 423 L 165 407 L 154 379 L 150 363 L 149 349 L 148 348 L 148 316 L 149 315 L 150 302 L 152 297 L 153 289 L 161 266 L 170 248 L 185 226 L 206 204 L 221 192 L 237 182 L 259 172 L 279 166 L 289 164 L 298 164 L 302 168 L 303 174 L 266 289 L 266 298 L 268 307 L 273 319 L 280 330 L 291 342 L 302 350 L 313 355 L 325 358 L 352 357 L 363 354 L 378 347 L 387 341 L 397 330 L 433 220 L 434 214 L 441 207 L 447 208 L 468 229 L 475 238 L 487 257 L 497 279 L 504 303 L 505 314 L 506 315 L 506 324 L 507 325 L 507 347 L 506 348 L 505 364 L 500 385 L 493 404 L 480 428 L 465 448 L 448 465 L 434 476 L 415 488 L 393 498 L 384 504 L 373 515 L 363 532 L 359 547 L 359 705 L 362 708 L 369 708 L 409 686 L 456 658 L 544 612 L 564 600 L 626 567 L 640 556 L 651 541 L 657 525 L 657 519 L 658 518 L 658 209 L 654 193 L 648 181 L 641 172 L 629 162 L 532 105 L 525 102 L 518 97 L 511 94 L 492 82 L 485 79 L 478 74 L 356 5 L 343 1 Z";
const mark = (x, y, size, fill) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${MARK_VIEWBOX}"><g transform="translate(25 0)"><path d="${MARK_PATH}" fill="${fill}" fill-rule="evenodd" clip-rule="evenodd"/></g></svg>`;

const OG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FAF6EE"/>
  <rect x="12" y="12" width="1176" height="606" fill="none" stroke="#1A1A1A" stroke-width="6"/>
  ${mark(92, 172, 130, "#1A1A1A")}
  <text x="252" y="292" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="150" font-weight="800" letter-spacing="-7" fill="#1A1A1A">toolips</text>
  <rect x="726" y="250" width="40" height="40" fill="#EFC650"/>
  <text x="94" y="402" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="56" font-weight="700" letter-spacing="-1" fill="#1A1A1A">Drop. Fix. Download.</text>
  <text x="94" y="468" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" font-weight="500" fill="#6B6B6B">84 browser tools · MCP + REST API · free + Pro</text>
  <text x="94" y="566" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="22" font-weight="600" letter-spacing="3" fill="#9A9A9A">TOOLIPS.XYZ</text>
</svg>`;

// Wrap a PNG buffer in a single-image ICO container (PNG payload, widely
// supported). width/height byte is 0 for 256.
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const dir = Buffer.alloc(16);
  dir.writeUInt8(size >= 256 ? 0 : size, 0);
  dir.writeUInt8(size >= 256 ? 0 : size, 1);
  dir.writeUInt16LE(1, 4);
  dir.writeUInt16LE(32, 6);
  dir.writeUInt32LE(png.length, 8);
  dir.writeUInt32LE(22, 12);
  return Buffer.concat([header, dir, png]);
}

await sharp(Buffer.from(OG)).png().toFile(join(appDir, "opengraph-image.png"));

// apple-icon: mark on a cream rounded tile (mark within the central 60%).
const APPLE = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="40" fill="#F8F4E6"/>
  ${mark(36, 36, 108, "#5C3A1F")}
</svg>`;
await sharp(Buffer.from(APPLE)).png().toFile(join(appDir, "apple-icon.png"));

const iconSvg = await readFile(join(appDir, "icon.svg"));
const png32 = await sharp(iconSvg).resize(32, 32).png().toBuffer();
await writeFile(join(appDir, "favicon.ico"), pngToIco(png32, 32));

console.log("brand assets written to", appDir);
