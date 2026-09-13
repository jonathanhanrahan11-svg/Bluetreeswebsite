---
name: competitor-teardown
description: Analyze 2-3 real competitor websites for a local business and produce a polished, client-ready Word document comparing positioning, services, trust signals, pricing transparency, content/SEO depth, and calls to action — structured with a clear layout, prioritized recommendations, and clearly highlighted assumptions, written in plain language a client can understand at a glance. Use whenever the user wants to research competitors, prepare for a sales pitch or client conversation, or asks something like "check out what my competitors are doing," "help me position this against other {industry} sites," or wants a competitor comparison they can actually hand to a client. Unlike the website-audit skill, this produces a polished, shareable deliverable, not a raw messy capture — think of it as the competitive-research sibling of the website-audit-report skill.
---

# Competitor Teardown

## What this skill is for

When pitching a prospective client on a redesign (or deciding how to position a new build), it helps enormously to know what the competition actually looks like — not in vague terms, but specifically: what they say about themselves, what trust signals they lean on, how transparent they are about pricing, how deep their content/SEO footprint is. This skill does that research and turns it directly into a document a client could realistically be handed: clean layout, a short prioritized action list, plain language throughout, and anything uncertain clearly flagged rather than quietly smoothed over.

This is the competitive-research sibling of the `website-audit-report` skill — same spirit (polished, client-facing, prioritized, plain language) applied to competitor research instead of a codebase audit. If that skill is available, match its tone and level of polish rather than reinventing a different style.

## Step 1: Gather inputs

You need: the business being positioned (the client or prospect), and 2-3 real competitor URLs. If given directly, use those. If only an industry and location are given ("other tree surgeons in Essex"), search for real, currently-operating competitors — pick ones that look like genuine, comparable local businesses rather than national chains or directory listings, unless a chain comparison is specifically wanted.

Note explicitly if you're comparing unlike things (a one-person trade business vs. a large regional franchise) — that context matters and should be mentioned in the report rather than silently ignored.

## Step 2: Gather material on each competitor

For each competitor site:
- **Fetch the page content** (works everywhere, no special tooling needed) — read the actual text: headline/value proposition, services listed, pricing information if any, testimonials/reviews, credentials/certifications shown, calls to action, and site structure (single page vs. many dedicated pages — a real, verifiable SEO signal, not a guess).
- **If you have a way to render and screenshot a page** (Chrome MCP in Cowork/Claude apps, or Playwright in a terminal environment — same dual-path situation as the `responsive-qa` skill: try Chrome MCP first if available, fall back to Playwright in a terminal-only context, don't fight a sandbox that can't launch a browser), screenshot the homepage above the fold to actually assess visual quality rather than inferring it. Note in the report which competitors got this treatment and which didn't.
- If you can't render/screenshot, that's fine — do the comparison from content and structure alone, and say so plainly rather than guessing at visual quality you didn't see.

## Step 3: Assess each competitor across the same fixed dimensions

Keep the dimensions identical across every competitor so the comparison is genuinely comparative, not just separate impressions:
- **Positioning & messaging** — generic or specific/differentiated?
- **Services** — breadth and how clearly presented.
- **Trust signals** — reviews (how many, how specific), certifications, real photos vs. generic imagery.
- **Pricing transparency** — real information available, or "contact us" only?
- **Content/SEO depth** — number of pages, location or service-specific landing pages, blog/FAQ presence.
- **Visual quality** — only if actually seen; otherwise mark not assessed.
- **Calls to action** — clear and specific, multiple contact channels, or thin?

## Step 4: Write the report in plain, client-friendly language

This is the step that most needs discipline. Write every section the way you'd explain it out loud to the business owner across a table, not the way you'd write internal research notes:
- No jargon (avoid "SEO depth," "conversion path," "trust signals" as bare technical terms — say what they mean: "how easy they are to find in search," "how likely a visitor is to actually get in touch," "how much evidence of real, trustworthy work they show").
- Short sentences over long compound ones.
- Every claim should be something the client could repeat back in their own words after one read.

If you're unsure whether a sentence is too technical, imagine reading it aloud to someone who has never built or marketed a website — if it would need a follow-up explanation, simplify it before it goes in the report.

## Step 5: Build the document

Build a Word document (see the `docx` skill for the create/verify workflow — US Letter page size, verify by rendering to PDF and looking at every page, avoid orphaned blank pages from redundant page breaks) with this structure:

1. **Title Page** — report title (e.g. "Competitor Landscape & Positioning"), client name, prepared-by line, date.
2. **Executive Summary** — 3-5 plain-language sentences: where the client stands relative to the competitors reviewed, and the single biggest opportunity to differentiate.
3. **Competitors at a Glance** — a short, plain-language profile of each competitor (3-4 sentences each — what they do well, where they're weak) followed by a compact comparison table across the fixed dimensions from Step 3. Include the client's own column in this table (visually tinted so it stands out, first column) alongside the competitors — a reader should be able to see directly where they stand next to the field, not just read about it in prose. This is the section that most needs a genuinely clear layout.
4. **Where You Can Win** — 3-5 concrete opportunities framed as upside for the client, based on real gaps observed across the competitors (not generic advice) — this plays the same role as "Key Opportunities" in the `website-audit-report` skill.
5. **Prioritized Recommendations** — a short table (Priority | Recommendation | Why it matters), ordered by what would move the needle most against this specific competitive field first. Use plain tier labels ("Do first," "Do next," "Worth planning") rather than technical severity language.
6. **Recommended Next Steps** — 3-4 sequenced, practical steps plus a short closing line.
7. **Assumptions & Things We Couldn't Confirm** — a clearly visually separated section (a shaded callout, not blended into regular paragraphs) listing anything not directly verified: competitors whose visual design wasn't actually seen, pricing pages that were referenced but not opened, review counts that could have changed since being checked, anything inferred rather than observed. This section exists specifically so nothing in the report gets mistaken for more certain than it actually is — don't skip it or bury it at the very end in small print; give it its own clearly labeled section people will actually notice.

Keep the whole document to roughly 4-7 pages. If it's running long, cut description and sharpen the table and recommendations rather than trimming the assumptions section — that section should stay complete even if it makes the document longer, since its whole purpose is honesty about what's certain and what isn't.

## Step 6: Output

Save as a `.docx` with a client-appropriate filename (e.g. `<BusinessName> - Competitor Landscape.docx`). Save it in the active project folder if there is one, otherwise the current working directory, and tell the user where it landed. Mention which competitors got a full visual review versus content-only, so that distinction isn't lost between the research and the final document.
