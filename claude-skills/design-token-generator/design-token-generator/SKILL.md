---
name: design-token-generator
description: Generate a complete, semantic design token system (CSS custom properties for colors, spacing, radius, shadows, typography) plus base component styles (buttons, cards, form fields, badges) and a visual style-guide preview page, given a business's brand colors, vibe, or an existing site to extract from. Use when starting a new website project, redesigning one, or when the user asks for a "design system," "style guide," wants brand colors turned into code, or wants to avoid ad hoc/inconsistent styling. Also trigger proactively before writing the first line of CSS on any new client project — starting from real tokens instead of hardcoded values prevents the exact inconsistent-styling problems a website-audit typically finds later.
---

# Design Token Generator

## What this skill is for

Most small-site projects (and a fair number of larger ones) start writing CSS before anyone's decided on a real color/spacing/type system, and inconsistency creeps in from the first commit — one spacing value here, a slightly different shade of the brand blue there, inline `style="margin-bottom: 22px"` scattered through the markup because there was no token to reach for instead. This skill exists to front-load that decision: produce a small, real design system before any page markup gets written, so every component pulls from the same source instead of improvising.

The output is not just a color palette — it's a working `tokens.css` file with semantic custom properties, functional base styles for the components every site needs (buttons, cards, form fields, badges), and a style-guide preview page to actually look at before committing to it.

## Step 1: Gather the brand input

You need, at minimum, a primary color. Get this from context — the user may give you hex codes directly, describe a vibe ("khaki and orange, professional, not too colourful"), point at an existing site/brand to match, or hand you a logo/screenshot to pull colors from. If nothing concrete is given, ask rather than guessing a palette out of thin air.

Also establish:
- **A secondary/accent color** (optional but recommended) — used sparingly for highlights, not as a second dominant color. If the user only gives one color, either propose a complementary accent or keep the system monochrome — ask if it's unclear which they want.
- **Light or dark mode** as the primary UI surface (most brochure/local-business sites are light; ask if ambiguous).
- **Font pairing** — use what's given, or propose a pairing based on the business's vibe (e.g. a serif heading + sans body reads more established/trustworthy; an all-sans pairing reads more modern/startup-y). A small set of safe, broadly-licensed pairings via Google Fonts is a reasonable default if nothing else is specified.

If the user gave qualitative direction ("not too much colour, stay professional" — the kind of note that's come up before), treat that as a real constraint on the output: keep the accent color usage genuinely restrained in the base component styles you generate (e.g. don't default every component to using the accent — reserve it for one or two things), not just in prose.

## Step 2: Generate the token set

Use `scripts/generate_palette.js` — copy it into your working directory, edit the `config` object at the top with the real brand input from Step 1, then run it with `node generate_palette.js`.

The script:
- Computes a full semantic token set from just the 1-2 brand colors you provide: surface/surface-alt/border/text/text-muted neutrals, primary + computed dark/light variants, accent + dark variant, and sensible fixed success/warning/error colors.
- **Automatically picks readable (black or white) text color for buttons** based on actual computed contrast against the button background — this isn't guessed.
- Writes a fixed, sensible spacing scale (`--space-1` through `--space-8`), radius tokens, and shadow tokens — every project gets these regardless of brand, since the point is having *a* scale, not a brand-specific one.
- Writes `tokens.css` (the actual CSS custom properties plus base component styles for buttons/cards/form fields/badges built on those tokens) and `tokens.json` (the same data, structured, for the preview page).
- **Prints a contrast report to the console** checking body text, muted text, and button text against their backgrounds against WCAG AA (4.5:1). This is the deterministic, non-negotiable verification step — read it. If anything fails, adjust the offending color in `config` and rerun before treating the tokens as final. Don't ship a palette with a failing pair just because it "looks fine" — the whole point of running the numbers is not having to eyeball it.

Naming matters: the tokens this script generates are semantic (`--color-surface`, `--color-text`) rather than literal (`--black`, `--white`). Keep it that way if you extend the token set by hand — literal color names that invert their meaning between themes is a real bug pattern worth avoiding (a site can end up with a variable called `--black` that holds a light color after a redesign, which is exactly as confusing as it sounds).

## Step 3: Build the style-guide preview

Copy `assets/style-guide-template.html` next to your generated `tokens.css` (same directory, no path changes needed — it references `tokens.css` directly via a relative link). This gives you a single page showing every color swatch with its token name, the type scale, all three button variants, badges, a sample card, and a sample form field — everything built from the tokens, nothing hardcoded.

If you have a way to render and screenshot a web page (Chrome MCP in Cowork/Claude apps, or Playwright if you're running in a terminal-based environment like Claude Code with normal machine permissions), open the preview page and actually look at it before calling this done — check that the accent color reads as restrained rather than dominant if that was a stated constraint, that spacing feels consistent, and that nothing looks obviously off despite passing the numeric contrast check (numbers and eyes catch different kinds of problems).

If you have no way to render a page in your current environment, that's fine — the contrast report from Step 2 is the non-negotiable check, and the preview HTML is still valid output the user can open themselves in any browser.

## Step 4: Output

Hand over `tokens.css`, `tokens.json`, and the style-guide preview page (`style-guide.html` or similar). If there's an active project folder, save them there — a `tokens.css` sitting at the project root (or in a `styles/` folder matching the project's existing conventions) is normally exactly where the next step (writing the actual page markup) will expect to find it. Mention the contrast report results and any color you adjusted along the way, so the user knows the palette was actually checked, not just assumed to look fine.
