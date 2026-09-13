---
name: responsive-qa
description: Actually render a website at real phone, tablet, and desktop widths and screenshot each one, then look at the images to flag genuine visual breakage — text overflow, overlapping elements, broken layouts, tap targets that look too small, horizontal scrollbars. Use whenever the user asks to check mobile responsiveness, "see how this looks on mobile," test breakpoints, do responsive QA, or check a site across devices — and especially as a follow-up to the website-audit skill, which can only infer mobile behavior from CSS media queries and explicitly cannot verify real rendered layout on its own. Trigger this whenever mobile/responsive behavior needs to be confirmed rather than assumed.
---

# Responsive QA

## What this skill is for

A codebase-only audit can read media queries and guess what should happen at a given screen width, but it can't actually see whether the result looks right — a `@media (max-width: 760px)` rule might exist and still produce a layout that overlaps, overflows, or looks cramped in practice. This skill closes that gap: it actually renders the page at real widths, takes screenshots, and has you look at them, so mobile findings become verified observations instead of inferences.

## Step 0: Figure out which rendering path is available — this matters

There are two ways to do this, and which one applies depends entirely on where you're running:

**Path A — Chrome MCP (when available, e.g. in Cowork or a Claude app with the Chrome extension connected).** This controls the user's actual installed Chrome browser. It's the more reliable path in a sandboxed agent environment, because it doesn't depend on the sandbox having a working headless browser installed. Use `resize_window` (or equivalent) to set the viewport to each breakpoint below, navigate to the target (a live URL, or a local `file://` path to an HTML file, or `http://localhost:PORT` if you started a local server the user's browser can reach), and take a screenshot at each size. Request access to Chrome first if you haven't already.

**Path B — Playwright, run from a terminal (e.g. Claude Code on the user's own machine).** Use the bundled `scripts/capture_breakpoints.js`. This works well on a normal developer machine but can fail inside certain locked-down sandbox containers with a "missing system dependencies" error that you cannot fix without root access — if you hit that, don't keep fighting it; switch to Path A if it's available, or tell the user directly that browser automation isn't possible in the current environment and they should try again from a terminal on their own machine.

Try to determine which path applies *before* starting rather than assuming — check what tools you actually have available in the current session.

## Step 1: Decide what to test

You need a reachable target:
- A live URL — the simplest case, works with either path.
- A local codebase with no live URL — for Path A (Chrome MCP), navigate directly to the local `index.html` via a `file://` path if the browser you're controlling has filesystem access to it (i.e. it's the same machine the files live on). For Path B (Playwright, terminal), start a quick local server first (`python3 -m http.server 8080` from the project root) and point at `http://localhost:8080`.

## Step 2: Capture screenshots at real breakpoints

Use this set unless the user wants something different — it covers the large majority of real responsive bugs:

| Name | Width | Notes |
|---|---|---|
| mobile-small | 360px | Small Android phones |
| mobile-standard | 390px | Modern iPhone |
| tablet | 768px | iPad portrait |
| desktop | 1440px | Common laptop |

**Path A:** resize to each width, navigate/reload, wait briefly for layout/animations to settle, screenshot, repeat.

**Path B:** edit `TARGET` at the top of `scripts/capture_breakpoints.js`, run `node capture_breakpoints.js` (install playwright / run `npx playwright install chromium` first if needed). It captures all four breakpoints in one run, full-page, into `./responsive-screenshots/`, and also saves any JS console errors/warnings seen at each width into `console-log.json` — genuinely useful, verified evidence rather than a guess about whether something's throwing errors on load.

## Step 3: Actually look at every screenshot

This is the step that matters most and is easy to rush. Open/view each image and look specifically for:
- Text that's cut off, overlapping, or overflowing its container.
- A nav that doesn't fit, wraps badly, or has no visible way to open it.
- Elements that visually collide or stack in a way that looks unintentional.
- Images that crop awkwardly or look stretched/distorted.
- Buttons/links that look too small to comfortably tap (a rough eyeball check — anything that looks meaningfully smaller than surrounding tap targets is worth flagging).
- Horizontal scroll/overflow that shouldn't be there (content wider than the viewport).
- Anything that renders fine at 1440px but visibly breaks at 768px or below.

If you captured console errors (Path B), check whether any relate to layout/rendering (a failed resource load, a JS error in something that positions elements) rather than being unrelated noise.

## Step 4: Write up findings

Use the same finding structure as the `website-audit` skill if this is feeding into or supplementing an existing audit (merge into that document's Mobile Responsiveness section rather than creating a competing one, if `website-audit.md` already exists for this project) — otherwise produce a standalone `responsive-qa.md`. For each real issue found:

```markdown
### [Short, specific title]
- **Where it appears:** [breakpoint name + width, e.g. "mobile-standard, 390px"]
- **What I saw:** [plain description of what the screenshot shows]
- **Screenshot:** [file reference, e.g. responsive-screenshots/mobile-standard-390w.png]
- **Why it matters:** [user/business impact]
- **Possible fix:** [concrete direction]
```

Since this skill produces *verified* observations (you're describing something you actually saw rendered, not inferring from CSS), don't hedge these with `[ASSUMPTION]`/`[UNVERIFIED]` tags the way the raw codebase audit does — that tagging convention is specifically for things that couldn't be confirmed. These findings are the confirmation.

If everything looked genuinely fine at every breakpoint, say so plainly rather than manufacturing minor nitpicks — a clean result is a real, useful finding too (and worth noting explicitly if it resolves an `[UNVERIFIED]` item from an earlier audit).

## Step 5: Output

Save screenshots and the findings file in the project folder (a `responsive-screenshots/` subfolder is a reasonable default). If this run was specifically meant to verify something an earlier `website-audit.md` flagged as unverified, go back and note in that file that it's now confirmed (or turned out not to be an issue) — don't leave a stale `[UNVERIFIED]` sitting next to evidence that resolves it.
