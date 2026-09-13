/**
 * Responsive QA capture script — Playwright-based.
 *
 * USE THIS SCRIPT ONLY IN A TERMINAL/CODING ENVIRONMENT (e.g. Claude Code on a normal
 * machine). In a locked-down container sandbox (some Cowork sessions), headless Chromium
 * can fail to launch due to missing system libraries with no way to install them —
 * if `node capture_breakpoints.js` fails with a "missing dependencies" error, STOP and
 * use the Chrome MCP path described in SKILL.md instead (control the user's real browser),
 * rather than fighting the sandbox.
 *
 * HOW TO USE:
 * 1. `npm install playwright` if `require('playwright')` fails, then
 *    `npx playwright install chromium` (one-time, downloads the browser binary).
 * 2. Edit TARGET below — a live URL, or a local file path (file:// URL) if you started
 *    a local server (e.g. `python3 -m http.server 8080` in the project folder, then
 *    TARGET = "http://localhost:8080").
 * 3. Run: node capture_breakpoints.js
 * 4. It writes one PNG per breakpoint into ./responsive-screenshots/, plus a
 *    console-log.json capturing any JS console errors/warnings seen during load at
 *    each width — genuinely useful, verified data for the "Technical issues" and
 *    "Mobile responsiveness" sections of a website-audit, not a guess.
 * 5. Actually open/view each screenshot afterward and look for real problems: text
 *    overflow, overlapping elements, tap targets that look too small, horizontal
 *    scrollbars, a nav that doesn't fit, images that crop awkwardly. The script gets
 *    you the evidence; only a human (or you, looking at the image) can judge whether
 *    something looks broken.
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

// =========================================================
// CONFIG
// =========================================================
const TARGET = "http://localhost:8080"; // live URL or local server URL — edit this
const OUT_DIR = "responsive-screenshots";

// A reasonably complete real-device breakpoint set — trim if you only care about a
// couple of these, but these four catch the large majority of real responsive bugs.
const BREAKPOINTS = [
  { name: "mobile-small", width: 360, height: 780 },   // small Android phones
  { name: "mobile-standard", width: 390, height: 844 }, // modern iPhone
  { name: "tablet", width: 768, height: 1024 },         // iPad portrait
  { name: "desktop", width: 1440, height: 900 },        // common laptop
];

// =========================================================
(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    console.error("Could not launch a headless browser in this environment.");
    console.error("If the error mentions missing system dependencies, this environment");
    console.error("can't run Playwright — switch to the Chrome MCP path in SKILL.md instead.");
    console.error("\nOriginal error:", e.message);
    process.exit(1);
  }

  const consoleLog = {};

  for (const bp of BREAKPOINTS) {
    const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
    const messages = [];
    page.on("console", (msg) => messages.push({ type: msg.type(), text: msg.text() }));
    page.on("pageerror", (err) => messages.push({ type: "pageerror", text: err.message }));

    try {
      await page.goto(TARGET, { waitUntil: "networkidle", timeout: 20000 });
    } catch (e) {
      console.error(`Failed to load ${TARGET} at ${bp.name}:`, e.message);
      await page.close();
      continue;
    }

    // small settle delay for animations/lazy content
    await page.waitForTimeout(400);

    const outPath = path.join(OUT_DIR, `${bp.name}-${bp.width}w.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    consoleLog[bp.name] = messages;
    console.log(`Captured ${bp.name} (${bp.width}x${bp.height}) -> ${outPath}`);

    await page.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT_DIR, "console-log.json"), JSON.stringify(consoleLog, null, 2));
  console.log(`\nDone. Screenshots + console-log.json are in ./${OUT_DIR}/`);
  console.log("Now actually open and look at each screenshot before writing up findings.");
})();
