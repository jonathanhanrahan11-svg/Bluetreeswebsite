/**
 * Design token generator — computes a full semantic color/spacing/type/radius/shadow
 * token system from a small brand config, and checks contrast so nothing gets shipped
 * that fails WCAG AA. No external dependencies — plain color math.
 *
 * HOW TO USE:
 * 1. Edit the `config` object below with the real brand input (colors, mode, fonts).
 * 2. Run: node generate_palette.js
 * 3. It writes tokens.css, tokens.json, and prints a contrast report to the console.
 *    READ THE CONTRAST REPORT. If anything is flagged as failing, adjust the offending
 *    color in `config` and rerun rather than shipping a failing pair — this check is
 *    the deterministic replacement for "eyeballing" contrast when no screenshot/browser
 *    is available.
 * 4. Feed tokens.json into the style-guide preview template (see assets/style-guide-template.html)
 *    to produce a visual preview page.
 */

const fs = require("fs");

// =========================================================
// CONFIG — the only section you normally need to edit
// =========================================================
const config = {
  businessName: "[Business Name]",
  primary: "#2453B0",     // main brand color — buttons, links, primary actions
  accent: "#C1622C",      // secondary/highlight color — used sparingly (badges, one accent detail)
  mode: "light",          // "light" or "dark" — which the main UI surface should be
  headingFont: "'Playfair Display', Georgia, serif",
  bodyFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

// =========================================================
// Color math (no dependencies)
// =========================================================
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function rgbToHex({ r, g, b }) {
  return "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
}
function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
function hslToRgb({ h, s, l }) {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = l * 255; return { r: v, g: v, b: v }; }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return { r: hue2rgb(p, q, h + 1 / 3) * 255, g: hue2rgb(p, q, h) * 255, b: hue2rgb(p, q, h - 1 / 3) * 255 };
}
function adjustLightness(hex, deltaPercent) {
  const hsl = rgbToHsl(hexToRgb(hex));
  hsl.l = Math.max(0, Math.min(100, hsl.l + deltaPercent));
  return rgbToHex(hslToRgb(hsl));
}
function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const chan = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}
function contrastRatio(hexA, hexB) {
  const L1 = relativeLuminance(hexA) + 0.05;
  const L2 = relativeLuminance(hexB) + 0.05;
  return L1 > L2 ? L1 / L2 : L2 / L1;
}
function readableTextColor(bgHex) {
  return contrastRatio(bgHex, "#000000") > contrastRatio(bgHex, "#ffffff") ? "#111111" : "#ffffff";
}

// =========================================================
// Build the token set
// =========================================================
const isLight = config.mode === "light";

const colors = {
  "color-surface": isLight ? "#FBFAF8" : "#12141A",
  "color-surface-alt": isLight ? "#F1EFEA" : "#1B1E26",
  "color-border": isLight ? "#DEDAD1" : "#2B2F3A",
  "color-text": isLight ? "#1F2320" : "#F2F3F5",
  "color-text-muted": isLight ? "#5C6259" : "#A6ACB8",
  "color-primary": config.primary,
  "color-primary-dark": adjustLightness(config.primary, -14),
  "color-primary-light": adjustLightness(config.primary, 16),
  "color-accent": config.accent,
  "color-accent-dark": adjustLightness(config.accent, -14),
  "color-success": "#2E7D4F",
  "color-warning": "#B8860B",
  "color-error": "#C0392B",
};
colors["color-on-primary"] = readableTextColor(colors["color-primary"]);
colors["color-on-accent"] = readableTextColor(colors["color-accent"]);

const spacing = { "space-1": "4px", "space-2": "8px", "space-3": "12px", "space-4": "16px", "space-5": "24px", "space-6": "32px", "space-7": "48px", "space-8": "64px" };
const radius = { "radius-sm": "6px", "radius-md": "12px", "radius-lg": "20px", "radius-pill": "999px" };
const shadow = {
  "shadow-sm": "0 1px 3px rgba(0,0,0,0.08)",
  "shadow-md": "0 8px 24px rgba(0,0,0,0.10)",
  "shadow-lg": "0 20px 50px rgba(0,0,0,0.14)",
};
const typography = {
  "font-heading": config.headingFont,
  "font-body": config.bodyFont,
};

// =========================================================
// Contrast report — the deterministic verification step
// =========================================================
const pairsToCheck = [
  ["Body text on surface", colors["color-text"], colors["color-surface"], 4.5],
  ["Muted text on surface", colors["color-text-muted"], colors["color-surface"], 4.5],
  ["Text on button (primary)", colors["color-on-primary"], colors["color-primary"], 4.5],
  ["Text on button (accent)", colors["color-on-accent"], colors["color-accent"], 4.5],
  ["Body text on alt surface", colors["color-text"], colors["color-surface-alt"], 4.5],
];

console.log(`\nContrast report for ${config.businessName} (WCAG AA target: 4.5:1 for normal text)\n`);
let anyFailed = false;
pairsToCheck.forEach(([label, fg, bg, min]) => {
  const ratio = contrastRatio(fg, bg);
  const pass = ratio >= min;
  if (!pass) anyFailed = true;
  console.log(`${pass ? "PASS" : "FAIL"}  ${label}: ${ratio.toFixed(2)}:1 (needs ${min}:1) — ${fg} on ${bg}`);
});
if (anyFailed) {
  console.log("\nAt least one pair FAILED contrast. Adjust the offending color in `config` and rerun before using these tokens.\n");
} else {
  console.log("\nAll checked pairs pass WCAG AA.\n");
}

// =========================================================
// Write tokens.css
// =========================================================
const cssLines = [
  "/* Design tokens — generated. Semantic names on purpose: never name a token after",
  "   the literal color it happens to hold today (e.g. avoid --black/--white style names",
  "   that invert when a theme changes) — use --color-surface, --color-text, etc. */",
  ":root {",
  ...Object.entries(colors).map(([k, v]) => `  --${k}: ${v};`),
  ...Object.entries(spacing).map(([k, v]) => `  --${k}: ${v};`),
  ...Object.entries(radius).map(([k, v]) => `  --${k}: ${v};`),
  ...Object.entries(shadow).map(([k, v]) => `  --${k}: ${v};`),
  ...Object.entries(typography).map(([k, v]) => `  --${k}: ${v};`),
  "}",
  "",
  "/* ---------------- Base component styles built on the tokens above ---------------- */",
  "* { box-sizing: border-box; }",
  "body { background: var(--color-surface); color: var(--color-text); font-family: var(--font-body); line-height: 1.6; }",
  "h1, h2, h3, h4 { font-family: var(--font-heading); line-height: 1.2; margin: 0 0 var(--space-3); }",
  "",
  ".btn { display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-3) var(--space-5); border-radius: var(--radius-pill); font-weight: 600; border: 1px solid transparent; cursor: pointer; transition: transform .2s ease, box-shadow .2s ease; }",
  ".btn-primary { background: var(--color-primary); color: var(--color-on-primary); box-shadow: var(--shadow-sm); }",
  ".btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }",
  ".btn-accent { background: var(--color-accent); color: var(--color-on-accent); }",
  ".btn-outline { background: transparent; border-color: var(--color-border); color: var(--color-text); }",
  "",
  ".card { background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-5); box-shadow: var(--shadow-sm); }",
  "",
  ".field { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-4); }",
  ".field label { font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); }",
  ".field input, .field textarea, .field select { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: var(--space-3); color: var(--color-text); font-family: var(--font-body); }",
  ".field input:focus, .field textarea:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 25%, transparent); }",
  "",
  ".badge { display: inline-flex; padding: var(--space-1) var(--space-3); border-radius: var(--radius-pill); font-size: 0.78rem; font-weight: 700; }",
  ".badge-success { background: color-mix(in srgb, var(--color-success) 15%, transparent); color: var(--color-success); }",
  ".badge-warning { background: color-mix(in srgb, var(--color-warning) 15%, transparent); color: var(--color-warning); }",
  ".badge-error { background: color-mix(in srgb, var(--color-error) 15%, transparent); color: var(--color-error); }",
].join("\n");

fs.writeFileSync("tokens.css", cssLines + "\n");
fs.writeFileSync("tokens.json", JSON.stringify({ colors, spacing, radius, shadow, typography, config }, null, 2));
console.log("Wrote tokens.css and tokens.json");
