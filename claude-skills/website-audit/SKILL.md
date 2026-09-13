---
name: website-audit
description: Deeply audit a live website, a local website/app codebase, or both, producing a raw, intentionally messy, extremely detailed first-pass markdown audit (website-audit.md) covering UX, UI, layout, visual hierarchy, navigation, IA, user journeys, messaging, content, CTAs, conversion, trust, accessibility, mobile responsiveness, forms, interactions, empty/loading/error/success states, SEO, performance, technical issues, missing pages, design system consistency, repeated components, code quality, confusing decisions, and opportunities. Use whenever the user asks to audit, review, critique, or "go through" a website or web app — phrases like "audit my site," "review this website," "what's wrong with my site," "feedback on the codebase/design," "check my site for issues," or when they hand over a URL or web project folder wanting an honest assessment. This is a raw capture step, NOT a polished client-ready report — don't clean it up or summarize it away. Trigger even with just a URL or just a folder.
---

# Website Audit

## What this skill is for

This produces a **raw first-pass audit**, not a polished deliverable. The point is to get everything useful out of your head (and off the screen/codebase) and onto the page in one pass, so a later step can refine it into something client-facing. Optimize for **coverage and honesty over tidiness**. A messy 3,000-word audit that surfaces 40 real things is a better outcome than a clean 500-word summary that surfaces 8.

Do not polish, do not consolidate, do not pick "the top 5 issues." Write down what you actually notice, as you notice it, including half-formed thoughts, contradictions, and things you're not sure about. It is fine — good, even — for the document to feel like a messy notebook rather than a report.

Read `references/categories.md` before starting the audit itself — it has a checklist of concrete things to look for in each of the 23 areas. Read `references/finding-format.md` for the exact structure each finding should follow.

## Step 1: Figure out what you're auditing

You need at least one of: a live URL, or a local codebase path. Figure out which you have from context (the user may have already given you one or both, or a folder may already be connected). If you have neither, ask.

- **Live URL only** — you're auditing the experience a real visitor gets: rendered UI, real navigation, actual page-load behavior, whatever you can observe about performance and SEO from the outside.
- **Local codebase only** — you're auditing the source: how it's built, structural/consistency issues, code quality, things that are technically present but might not be visible without running the app (unused components, dead states, inconsistent patterns).
- **Both** — the deepest audit. Cross-reference: does what's live match what's in the code? Are there components in the code that never get used? Is there a design system in the CSS that the live pages ignore in places? This combination catches things neither source catches alone.

Don't assume the audit needs to be exhaustive on day one at the expense of ever finishing — but do err heavily toward "too much detail" per the instructions above.

## Step 2: Tool setup depending on what's available

**For a live URL:**
- If you have browser tooling (e.g. Chrome MCP / computer-use), actually navigate the site: click through the main pages and user journeys, resize the viewport to check mobile/tablet breakpoints, open dev tools equivalents (console messages, network requests) if available, and take screenshots of anything you want to reference in the audit.
- If you only have basic page fetching (no rendering), say so explicitly in the audit — you can still check raw HTML (meta tags, heading structure, alt text, semantic markup) but flag that you couldn't verify rendered layout, JS-driven interactions, or actual load performance, and label those sections as unverified/assumed rather than guessing.
- Never take any action that changes the live site. This is a read-only, look-and-report exercise — no form submissions with real data, no clicking anything destructive, no account creation unless the user explicitly asks you to test that specific flow.

**For a local codebase:**
- Get the lay of the land first: `Glob`/directory listing for structure, then check for a design system or shared styles (CSS variables, a theme file, a components folder), routing/page structure, and any obvious framework conventions.
- Read the actual markup/component files, not just filenames — a lot of the interesting findings (repeated inline styles, inconsistent spacing values, missing alt text, form fields with no associated label) only show up when you read the real content.
- If there's a `.claude` folder with existing agents or prior audit files, skim them for context on what's already been flagged or attempted — don't duplicate work silently, but it's fine to re-surface something if you see it differently.

**For both:** do the codebase pass and the live pass somewhat independently, then explicitly look for mismatches as their own category of finding (e.g., "the CSS defines a `--color-primary` token but three pages hardcode a slightly different hex value instead").

## Step 3: Work through the categories

Go through each category in `references/categories.md`. You don't have to go in order, and it's fine to jump around as you notice things — real audits don't happen in a neat sequence. For each thing you notice that seems worth flagging, write it up immediately using the finding format (see Step 4) rather than trying to hold it in your head and organize later.

It's fine, and expected, for findings to overlap or repeat across categories — e.g. a low-contrast CTA button might get flagged under both "UI design" and "conversion" and "accessibility," each time with a slightly different angle. Don't merge these into one entry just to be tidy; write it up each time it's relevant, from that category's lens. Overlap is signal, not noise — if the same thing keeps coming up from different angles, that's useful for whoever refines this later.

Also capture things that don't fit neatly into a category: confusing decisions you can't explain, things that made you go "wait, why is this like this," half-formed hypotheses, and questions you'd want to ask the client or team. There's a dedicated section for this — see the template.

## Step 4: Write up every finding with this shape

Use as many of these fields as you can for each finding — see `references/finding-format.md` for the full explanation of each field and worked examples:

- **What I noticed**
- **Where it appears** (URL, page, file path + line/selector, component name — be as specific as you can)
- **Why it may be a problem**
- **User impact**
- **Severity** (your best-judgment label: Low / Medium / High / Critical — always note this is a subjective first-pass call, not a measured metric)
- **Business impact**
- **Possible solution**
- **Implementation note** (anything relevant to how hard/easy a fix would be, dependencies, or gotchas)
- **Open questions / worth investigating further**

If you genuinely don't have enough information for a field, either skip it or write "not enough info to assess" rather than inventing something plausible-sounding.

## Hard rules

- **Never invent facts, metrics, or analytics.** No made-up bounce rates, conversion percentages, load times, or user quotes. If you don't have real data, say so.
- **Label every assumption clearly.** If you're inferring something ("this button is *probably* meant to...") or guessing at intent, prefix it or tag it so a reader can immediately tell verified observation from inference. A simple `[ASSUMPTION]` or `[UNVERIFIED]` tag inline works well and is used consistently throughout — pick a convention and stick to it.
- **Don't change the website or codebase.** This skill only reads and observes. Don't fix bugs, don't edit files, don't submit forms with real-looking data, don't commit anything. If you spot something you're itching to fix, write it up as a finding with a possible solution instead.
- **Don't over-organize or shorten for polish.** No executive summary that quietly drops half the findings. No "top 5" cut. The whole point is maximum raw material for a later editing pass.

## Step 5: Output

Write everything to a single file called `website-audit.md`.
- If auditing a local codebase, save it at the root of that codebase.
- If it's a live-URL-only audit with no local folder, save it in the current working directory and tell the user where it landed.
- If a file with that name already exists, ask whether to append, overwrite, or save as `website-audit-2.md` — don't silently clobber prior audit work.

Use `assets/audit-template.md` as your starting skeleton — copy it in and fill it out, adding/removing sections freely as the actual audit demands. Headings, bullet lists, tables, blockquoted notes, bolded questions, and even bracketed `[TODO: check this on mobile]`-style notes to yourself are all fair game. This is a working document, not a formatted report.

End the file with:
- An **Assumptions & Unverified Items** roundup (even though these are tagged inline throughout, a consolidated list at the end helps whoever refines this later triage fast).
- A **Questions for the client/team** list — anything you'd want answered before turning this into a polished report.
- A **Rough ideas / parking lot** section for anything that doesn't fit elsewhere — half-baked opportunities, "what if" ideas, things worth a second look.

When you're done, tell the user roughly how many findings you captured and flag anything you couldn't check (e.g., no browser access, no live URL, couldn't test forms) so they know what's genuinely been covered versus skipped.
