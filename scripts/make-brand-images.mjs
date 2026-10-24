/**
 * Renders the two brand images that cannot be written by hand: the Open Graph
 * card (1200x630) and the Apple touch icon (180x180).
 *
 * Both are committed to the repository, so this script is a one-off tool rather
 * than part of the build — run it only when the wordmark, the claim or the hero
 * photograph change:
 *
 *   npm i -D playwright && npx playwright install chromium   (once)
 *   npm run dev                                              (serves the fonts)
 *   node scripts/make-brand-images.mjs http://127.0.0.1:3000
 *
 * Any static server over public/ will do instead of `npm run dev`, as long as
 * it sends CORS headers (`npx http-server public -p 3200 --cors`): the card is
 * rendered from about:blank, and a font from another origin without them
 * silently falls back to Times — the image looks finished and is wrong.
 *
 * Playwright is deliberately not a project dependency: it is only used here,
 * and it would pull a browser download into every `npm install`.
 *
 * It uses the site's own font files and colour tokens so the card is the same
 * typography as the header, not an approximation of it. The photograph behind
 * the card is whatever public/images/stock/hero-bancone.webp currently is — a
 * temporary CC0 image; see docs/photo-sources.md.
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BASE = process.argv[2] || 'http://127.0.0.1:3000';
const PUBLIC = path.join(ROOT, 'public');

const BRAND = 'Cordiale';
const DESCRIPTOR = 'Bartender privato · Roma e provincia';
// The hero headline, so a shared link says the same thing the home page does.
const CLAIM = 'La tua casa. I tuoi ospiti. Il mio bancone.';
// One sentence per line: balanced wrapping alone broke it as "penso / io.".
const CLAIM_LINES = CLAIM.split(/(?<=[.!?])\s+/)
  .map((line, index, lines) => (index === lines.length - 1 && lines.length > 1 ? `<i>${line}</i>` : line))
  .join('<br>');

// Charcoal and champagne, like the site's default theme and its home page:
// the photograph under the whole card, darkened on the left where the words
// are, the last sentence of the claim in italic as on the page — so a shared
// link looks like the page it opens.
const card = /* html */ `
<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<style>
  @font-face { font-family: 'Cormorant Garamond'; src: url('${BASE}/fonts/cormorant-latin.woff2') format('woff2'); font-weight: 300 700; }
  @font-face { font-family: 'Cormorant Garamond'; font-style: italic; src: url('${BASE}/fonts/cormorant-italic-latin.woff2') format('woff2'); font-weight: 300 700; }
  @font-face { font-family: 'DM Sans'; src: url('${BASE}/fonts/dmsans-latin.woff2') format('woff2'); font-weight: 100 1000; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #100f0c; }
  .card { position: relative; width: 1200px; height: 630px; }
  .photo { position: absolute; inset: 0; }
  .photo img { width: 100%; height: 100%; object-fit: cover; object-position: 62% 50%; display: block; }
  .veil { position: absolute; inset: 0; background:
    linear-gradient(100deg, rgba(16,15,12,0.95) 0%, rgba(16,15,12,0.84) 42%, rgba(16,15,12,0.34) 74%, rgba(16,15,12,0.14) 100%),
    linear-gradient(to top, rgba(16,15,12,0.55) 0%, rgba(16,15,12,0) 45%); }
  .copy { position: absolute; top: 0; bottom: 0; left: 0; width: 760px; padding: 64px 72px;
    display: flex; flex-direction: column; justify-content: space-between; }
  .word { font-family: 'Cormorant Garamond', serif; font-size: 56px; font-weight: 500; line-height: 1; color: #f5f0e6; letter-spacing: -0.01em; }
  .desc { font-family: 'DM Sans', sans-serif; font-size: 15px; letter-spacing: 0.22em;
    text-transform: uppercase; color: #cdb689; margin-top: 12px; font-weight: 500; }
  .claim { font-family: 'Cormorant Garamond', serif; font-size: 78px; font-weight: 500; line-height: 0.98; color: #f5f0e6;
    letter-spacing: -0.02em; max-width: 640px; }
  .claim i { font-weight: 400; }
  .rule { width: 64px; height: 1px; background: #b69a68; margin-bottom: 30px; }
  .foot { font-family: 'DM Sans', sans-serif; font-size: 20px; color: rgba(245,240,230,0.82); }
  .foot b { color: #cdb689; font-weight: 600; }
</style></head>
<body><div class="card">
  <div class="photo"><img src="${BASE}/images/stock/hero-bancone.webp" alt=""></div>
  <div class="veil"></div>
  <div class="copy">
    <div><div class="word">${BRAND}</div><div class="desc">${DESCRIPTOR}</div></div>
    <div><div class="rule"></div><div class="claim">${CLAIM_LINES}</div></div>
    <div class="foot">Attrezzatura, ghiaccio e bottiglie: <b>li porto io</b></div>
  </div>
</div></body></html>`;

const icon = /* html */ `
<!doctype html><html><head><meta charset="utf-8">
<style>*{margin:0;padding:0}body{width:180px;height:180px;background:#0a0908}svg{display:block}</style>
</head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0a0908"/>
  <path d="M17 18h30L36 33.5V45h7v3H21v-3h7V33.5z" fill="none" stroke="#c9a46a" stroke-width="3"
        stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="32" cy="25" r="2.6" fill="#c9a46a"/>
</svg></body></html>`;

// PLAYWRIGHT_CHROMIUM_PATH lets a machine that already has a browser (CI
// images, sandboxes) point at it instead of downloading a second copy.
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined });

async function shoot(html, width, height, target, options) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => {})))));
  await page.waitForTimeout(300);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await page.screenshot({ path: target, ...options });
  await page.close();
  const { size } = await fs.stat(target);
  console.log(`${path.relative(ROOT, target)} — ${width}x${height}, ${(size / 1024).toFixed(0)} KB`);
}

// JPEG, not WebP: an OG card is read by scrapers (X, LinkedIn, older clients)
// that still do not all handle WebP, and this is the one image whose job is to
// render somewhere we do not control.
await shoot(card, 1200, 630, path.join(PUBLIC, 'images/og/og-default.jpg'), { type: 'jpeg', quality: 86 });
await shoot(icon, 180, 180, path.join(ROOT, 'src/app/apple-icon.png'), { type: 'png' });

await browser.close();
