/**
 * Generates the placeholder artwork in /public/images.
 *
 * These are vector stand-ins drawn in the brand palette so the layout reads
 * correctly before real photography exists. Replace the files with real
 * photographs (same filenames, ideally 3:2 or 4:5 JPEG/WebP) — or upload
 * through the admin gallery — and nothing else needs to change.
 *
 *   node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(process.cwd(), "public", "images");

/* ------------------------------------------------------------------ utils */

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
}

function mix(from, to, amount) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return (
    "#" +
    a
      .map((channel, i) =>
        Math.round(channel + (b[i] - channel) * amount)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

const PALETTES = {
  ivory: { fabric: "#e9dfcb", light: "#fbf6ec", shadow: "#9d8f74", wall: "#efe9dd" },
  charcoal: { fabric: "#2b2724", light: "#4a423c", shadow: "#0d0c0b", wall: "#1c1a18" },
  sand: { fabric: "#d6c6a9", light: "#f1e6d2", shadow: "#8d7c5e", wall: "#e7dfd1" },
  gold: { fabric: "#c99a3d", light: "#efd9a4", shadow: "#6f5220", wall: "#241f18" },
  taupe: { fabric: "#b9ab97", light: "#ded4c3", shadow: "#6c6154", wall: "#e5ded2" },
  espresso: { fabric: "#3a2f27", light: "#6b5748", shadow: "#120e0b", wall: "#241d18" },
  linen: { fabric: "#ded3bf", light: "#f6f0e4", shadow: "#9a8e78", wall: "#f2ece0" },
  slate: { fabric: "#3c3f42", light: "#646a70", shadow: "#16181a", wall: "#202325" },
};

/* --------------------------------------------------------------- elements */

/** Vertical fabric folds across [x0, x1]. */
function folds({ x0, x1, top, bottom, palette, count, rand, hemCurve = 18, opacity = 1 }) {
  const width = x1 - x0;

  // Uneven band widths read as cloth; perfectly even ones read as wallpaper.
  const weights = Array.from({ length: count }, () => 0.55 + rand() * 0.9);
  const total = weights.reduce((sum, value) => sum + value, 0);

  let cursor = x0;
  let out = `<g opacity="${opacity}">`;

  for (let i = 0; i < count; i += 1) {
    const bandWidth = (weights[i] / total) * width;
    const fx0 = cursor;
    const fx1 = cursor + bandWidth + 0.7;
    cursor += bandWidth;

    // Each pleat rolls from a lit crest into a deep shadow at its edge.
    const crest = Math.sin((i / count) * Math.PI * 2 * 3.5 + rand() * 0.5);
    const lift = (crest + 1) / 2;
    const tone =
      lift > 0.5
        ? mix(palette.fabric, palette.light, (lift - 0.5) * 1.9)
        : mix(palette.fabric, palette.shadow, (0.5 - lift) * 1.8);

    const sag = hemCurve * Math.sin((i / count) * Math.PI) + rand() * 6;
    out += `<path d="M${fx0.toFixed(1)} ${top} H${fx1.toFixed(1)} V${(bottom + sag * 0.3).toFixed(1)} Q${((fx0 + fx1) / 2).toFixed(1)} ${(bottom + sag).toFixed(1)} ${fx0.toFixed(1)} ${(bottom + sag * 0.3).toFixed(1)} Z" fill="${tone}"/>`;

    // Hairline crease on the shadow side of each pleat.
    out += `<line x1="${fx1.toFixed(1)}" y1="${top}" x2="${fx1.toFixed(1)}" y2="${(bottom + sag * 0.3).toFixed(1)}" stroke="${mix(tone, palette.shadow, 0.55)}" stroke-width="0.8" opacity="0.5"/>`;
  }

  out += `<rect x="${x0}" y="${top}" width="${width}" height="${bottom - top + 40}" fill="url(#panelShade)"/></g>`;
  return out;
}

/** Horizontal slats for blinds. */
function slats({ x0, x1, top, bottom, palette, count }) {
  const height = bottom - top;
  const step = height / count;
  let out = `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${height}" fill="${palette.fabric}"/>`;

  for (let i = 0; i < count; i += 1) {
    const y = top + i * step;
    out += `<rect x="${x0}" y="${y.toFixed(1)}" width="${x1 - x0}" height="${(step * 0.62).toFixed(2)}" fill="${mix(palette.fabric, palette.light, 0.5)}"/>`;
    out += `<rect x="${x0}" y="${(y + step * 0.62).toFixed(1)}" width="${x1 - x0}" height="${(step * 0.38).toFixed(2)}" fill="${mix(palette.fabric, palette.shadow, 0.45)}"/>`;
  }

  out += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${height}" fill="url(#panelShade)"/>`;
  // Control chain
  out += `<line x1="${x1 - 14}" y1="${top}" x2="${x1 - 14}" y2="${bottom - 30}" stroke="#c99a3d" stroke-width="1.4" opacity="0.7"/>`;
  return out;
}

/** Gold rod with finials. */
function rod({ x0, x1, y }) {
  return `
    <rect x="${x0 - 26}" y="${y - 5}" width="${x1 - x0 + 52}" height="7" rx="3.5" fill="url(#brass)"/>
    <circle cx="${x0 - 30}" cy="${y - 1.5}" r="9" fill="url(#brass)"/>
    <circle cx="${x1 + 30}" cy="${y - 1.5}" r="9" fill="url(#brass)"/>`;
}

function defs() {
  return `
  <defs>
    <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e4c477"/>
      <stop offset="0.45" stop-color="#c99a3d"/>
      <stop offset="1" stop-color="#8a6520"/>
    </linearGradient>
    <linearGradient id="panelShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.26"/>
      <stop offset="0.35" stop-color="#000000" stop-opacity="0.03"/>
      <stop offset="0.82" stop-color="#000000" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.34"/>
    </linearGradient>
    <linearGradient id="daylight" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="#f6efe1"/>
      <stop offset="0.5" stop-color="#e8dcc6"/>
      <stop offset="1" stop-color="#cbbda2"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.32" r="0.72">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.42" r="0.76">
      <stop offset="0.4" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
  </defs>`;
}

/* ----------------------------------------------------------------- scenes */

function curtainScene({ w, h, paletteName, seed, sheer = false, tieback = false }) {
  const palette = PALETTES[paletteName];
  const rand = mulberry32(seed);

  const rodY = Math.round(h * 0.1);
  const hem = Math.round(h * 0.9);
  const winX0 = Math.round(w * 0.2);
  const winX1 = Math.round(w * 0.8);
  const panelW = Math.round(w * (tieback ? 0.17 : 0.24));

  const sheerLayer = sheer
    ? `${folds({
        x0: winX0 + 6,
        x1: winX1 - 6,
        top: rodY + 6,
        bottom: hem - 6,
        palette: PALETTES.linen,
        count: 22,
        rand: mulberry32(seed + 9),
        hemCurve: 10,
        opacity: 0.55,
      })}`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Curtain interior illustration">
  ${defs()}
  <rect width="${w}" height="${h}" fill="${palette.wall}"/>
  <rect x="${winX0}" y="${rodY + 10}" width="${winX1 - winX0}" height="${hem - rodY - 10}" fill="url(#daylight)"/>
  <rect x="${winX0}" y="${rodY + 10}" width="${winX1 - winX0}" height="${hem - rodY - 10}" fill="url(#glow)"/>
  <line x1="${(winX0 + winX1) / 2}" y1="${rodY + 10}" x2="${(winX0 + winX1) / 2}" y2="${hem}" stroke="#f2ead9" stroke-opacity="0.35" stroke-width="3"/>
  ${sheerLayer}
  ${folds({ x0: winX0 - panelW, x1: winX0 + w * 0.045, top: rodY, bottom: hem, palette, count: 12, rand })}
  ${folds({ x0: winX1 - w * 0.045, x1: winX1 + panelW, top: rodY, bottom: hem, palette, count: 12, rand })}
  ${rod({ x0: winX0 - panelW, x1: winX1 + panelW, y: rodY })}
  <rect x="0" y="${hem + 30}" width="${w}" height="${h - hem - 30}" fill="${mix(palette.wall, "#000000", 0.3)}"/>
  <rect x="0" y="${hem + 30}" width="${w}" height="5" fill="${mix(palette.wall, "#ffffff", 0.25)}"/>
  <rect width="${w}" height="${h}" fill="url(#vignette)"/>
</svg>
`;
}

function blindScene({ w, h, paletteName, seed }) {
  const palette = PALETTES[paletteName];
  const rodY = Math.round(h * 0.11);
  const hem = Math.round(h * 0.78);
  const winX0 = Math.round(w * 0.16);
  const winX1 = Math.round(w * 0.84);
  const rand = mulberry32(seed);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Window blind illustration">
  ${defs()}
  <rect width="${w}" height="${h}" fill="${palette.wall}"/>
  <rect x="${winX0 - 14}" y="${rodY - 14}" width="${winX1 - winX0 + 28}" height="${h * 0.82}" fill="${mix(palette.wall, "#000000", 0.22)}"/>
  <rect x="${winX0}" y="${rodY}" width="${winX1 - winX0}" height="${h * 0.78}" fill="url(#daylight)"/>
  ${slats({ x0: winX0, x1: winX1, top: rodY, bottom: hem, palette, count: 22 })}
  <rect x="${winX0 - 8}" y="${rodY - 12}" width="${winX1 - winX0 + 16}" height="14" fill="url(#brass)"/>
  <rect x="${winX0}" y="${hem - 6}" width="${winX1 - winX0}" height="9" fill="${mix(palette.shadow, "#000000", 0.25)}"/>
  ${folds({ x0: winX1 + 6, x1: w, top: rodY - 30, bottom: h * 0.92, palette: PALETTES.linen, count: 8, rand })}
  <rect width="${w}" height="${h}" fill="url(#vignette)"/>
</svg>
`;
}

/** Tileable geometric motif used as a light background texture. */
function pattern() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <g fill="none" stroke="#c99a3d" stroke-width="0.7" opacity="0.5">
    <path d="M40 4 52 16 64 28 52 40 40 52 28 40 16 28 28 16Z"/>
    <path d="M40 16 52 28 40 40 28 28Z"/>
    <path d="M0 28 12 40 0 52M80 28 68 40 80 52M40 52 52 64 40 76 28 64Z"/>
  </g>
</svg>
`;
}

/* ------------------------------------------------------------------ write */

function write(relativePath, contents) {
  const target = join(OUT, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents);
}

const files = [
  ["hero.svg", curtainScene({ w: 1600, h: 1100, paletteName: "espresso", seed: 11, sheer: true })],
  ["about.svg", curtainScene({ w: 1000, h: 1250, paletteName: "ivory", seed: 23, sheer: true })],
  ["promo.svg", curtainScene({ w: 1400, h: 900, paletteName: "gold", seed: 31 })],
  ["pattern.svg", pattern()],

  ["services/custom-curtains.svg", curtainScene({ w: 900, h: 675, paletteName: "sand", seed: 41 })],
  ["services/blackout-curtains.svg", curtainScene({ w: 900, h: 675, paletteName: "charcoal", seed: 47 })],
  ["services/curtain-stitching.svg", curtainScene({ w: 900, h: 675, paletteName: "linen", seed: 53 })],
  ["services/professional-fitting.svg", curtainScene({ w: 900, h: 675, paletteName: "taupe", seed: 59, tieback: true })],
  ["services/curtain-measurement.svg", curtainScene({ w: 900, h: 675, paletteName: "ivory", seed: 61, sheer: true })],
  ["services/blinds.svg", blindScene({ w: 900, h: 675, paletteName: "slate", seed: 67 })],
  ["services/home-curtain-solutions.svg", curtainScene({ w: 900, h: 675, paletteName: "espresso", seed: 71, sheer: true })],
  ["services/office-curtain-solutions.svg", blindScene({ w: 900, h: 675, paletteName: "taupe", seed: 73 })],

  ["collections/blackout.svg", curtainScene({ w: 900, h: 1125, paletteName: "charcoal", seed: 83 })],
  ["collections/sheer.svg", curtainScene({ w: 900, h: 1125, paletteName: "linen", seed: 89, sheer: true })],
  ["collections/custom.svg", curtainScene({ w: 900, h: 1125, paletteName: "sand", seed: 97 })],
  ["collections/modern.svg", curtainScene({ w: 900, h: 1125, paletteName: "slate", seed: 101 })],
  ["collections/luxury.svg", curtainScene({ w: 900, h: 1125, paletteName: "gold", seed: 103, sheer: true })],
  ["collections/office-blinds.svg", blindScene({ w: 900, h: 1125, paletteName: "slate", seed: 107 })],
  ["collections/home-blinds.svg", blindScene({ w: 900, h: 1125, paletteName: "linen", seed: 109 })],
  ["collections/modern-blinds.svg", blindScene({ w: 900, h: 1125, paletteName: "espresso", seed: 113 })],
];

const galleryRecipes = [
  ["01", curtainScene({ w: 1000, h: 1250, paletteName: "espresso", seed: 211, sheer: true })],
  ["02", curtainScene({ w: 1000, h: 800, paletteName: "charcoal", seed: 223 })],
  ["03", blindScene({ w: 1000, h: 800, paletteName: "slate", seed: 227 })],
  ["04", curtainScene({ w: 1000, h: 1250, paletteName: "taupe", seed: 229, tieback: true })],
  ["05", curtainScene({ w: 1000, h: 900, paletteName: "linen", seed: 233, sheer: true })],
  ["06", curtainScene({ w: 1000, h: 1250, paletteName: "sand", seed: 239 })],
  ["07", blindScene({ w: 1000, h: 900, paletteName: "taupe", seed: 241 })],
  ["08", curtainScene({ w: 1000, h: 800, paletteName: "gold", seed: 251 })],
  ["09", curtainScene({ w: 1000, h: 1100, paletteName: "ivory", seed: 257, sheer: true })],
];

for (const [name, svg] of files) write(name, svg);
for (const [name, svg] of galleryRecipes) write(`gallery/${name}.svg`, svg);

console.log(`Wrote ${files.length + galleryRecipes.length} placeholder images to public/images`);
