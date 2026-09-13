---
name: website-audit-report
description: Turn a raw, messy website/codebase audit (like the output of the website-audit skill, or any similarly detailed markdown audit notes) into a polished, client-ready Word document. Rewrites technical findings into clear, non-technical language, identifies and prioritizes what actually matters, and structures the result as Title Page, Executive Summary, What's Working, Key Opportunities, Prioritized Recommendations, and Recommended Next Steps. Use this whenever the user asks to turn an audit into a report, make an audit "client-ready" or "presentable," polish/clean up audit notes, summarize findings for a client, or turn website-audit.md (or similar raw notes) into a Word document/deliverable. Trigger this even if the user just says something like "make this presentable" or "turn this into something I can send a client" right after an audit was produced.
---

# Website Audit → Client Report

## What this skill is for

The raw audit this skill consumes (see the `website-audit` skill) is deliberately messy: repetitive, exhaustive, full of technical detail, hedged assumptions, and unfiltered stream-of-consciousness notes. That's the right format for *capturing* everything. It is the wrong format for *handing to a client*.

This skill does the opposite job: take that raw material and produce something a business owner with no technical background would find clear, credible, and genuinely useful — the kind of document that makes them trust the person who sent it, not overwhelm them. The final document should read like strategic advice from someone who understands their business, not like a QA bug list or a code review.

Two failure modes to avoid, in tension with each other:
1. **Copying the audit too closely.** If the report still has file paths, CSS selectors, severity tags like `[ASSUMPTION]`, or 40 individually-listed findings, you haven't done the job — you've just reformatted. The client doesn't care that `.hero` is excluded from a CSS selector; they care that the homepage might not look as intended and it's worth a quick look.
2. **Losing the substance.** The temptation once you start "polishing" is to smooth everything into generic, forgettable statements ("the website could be improved in several areas"). Don't. Every point in the final report should still be specific and traceable to something real that was actually found — just described in plain language and business terms instead of technical ones.

Read `references/synthesis-guide.md` before writing anything — it has the selection/prioritization rules, tone guidance, and worked before/after rewrite examples. Then use `assets/build_report_template.js` as the starting point for the actual Word document — it's a working docx-js script with the structure, styling, and known-good formatting already solved; you're adapting its content, not building the mechanics from scratch.

## Step 1: Read and absorb the source audit

Read the full raw audit markdown file, not just the table of contents or headings. The good material is often in the details of individual findings (the "why it may be a problem" and "business impact" fields especially), not just the finding titles.

As you read, keep a running mental model of:
- What's genuinely strong or well-done (every real audit has some of this — if you can't find anything, look harder before concluding there's nothing, but don't invent positives that aren't supported).
- What's actually broken or actively costing the business something (not just "could be nicer").
- What's a bigger strategic theme versus a small tactical fix.
- Which findings in the raw audit are really the same underlying issue described from different angles (the raw audit does this on purpose — e.g. a broken contact form might show up under User Journeys, Conversion, *and* Forms). These should collapse into **one** item in the client report, not three.

If the audit file has a name like `website-audit.md` sitting next to the actual project it audited, you may have access to that project too — you generally won't need it (the audit should be self-contained), but it's there if something in the audit is unclear and you want to sanity-check before including it.

## Step 2: Synthesize — select, merge, prioritize, rewrite

Follow `references/synthesis-guide.md` in full for this step. In brief:
- Cap each section to a small, deliberately curated set of items (guidance on exact counts is in the reference file) — this is a synthesis exercise, not a transcription exercise.
- Merge overlapping/repeated raw findings into single, clearly-stated client-facing points.
- Rewrite every included point in plain business language: no file paths, line numbers, CSS/HTML/JS syntax, or internal severity-tag jargon (`[ASSUMPTION]`, `[UNVERIFIED]`, category labels like "Technical issues"). If something is genuinely unverified and important enough to mention, say so in a natural sentence ("worth confirming this once the site's live") rather than a bracketed tag.
- Prioritize with the client's business outcomes in mind, not the audit's original category structure. A broken contact form matters more than inconsistent CSS variable names, regardless of which section of the raw audit either one came from.
- Do not invent facts, data, or specifics that weren't in the source audit. If the audit flagged something as an assumption, you can still include it if it's important, but don't upgrade it to a stated fact in the rewrite.

## Step 3: Build the document

Use `assets/build_report_template.js` as your starting point (copy it into your working directory rather than editing the bundled copy). The script is organized around a single `reportData` object near the top — populate that object with your synthesized content, then run the script. The document structure, styling, page setup, and layout logic are already handled; you shouldn't need to touch the rendering functions unless the content genuinely doesn't fit the existing shapes (e.g., you need a 7th "what's working" item when the template assumes up to 6 — the functions are written to handle variable-length arrays, so this is usually fine as-is).

Structure, in this exact order:

1. **Title Page** — report title, the client/business name, prepared-by line, date. Keep it clean — this is the first thing they see and it should look considered, not busy.
2. **Executive Summary** — 3-6 sentences of prose (not bullets) that a busy business owner could read in isolation and understand: overall state of the site, the single most important thing to know, and the overall shape of the opportunity. This is the section most likely to actually get read in full — make it count.
3. **What's Working** — genuine strengths worth naming and protecting. This section matters more than it might seem: it builds trust that the report is balanced and specific (not a sales pitch dressed up as an audit), and it tells the client what *not* to accidentally break in any redesign.
4. **Key Opportunities** — the handful of bigger, strategic-level themes (not a list of every finding) framed around business upside — what could be gained, not just what's wrong.
5. **Prioritized Recommendations** — the concrete, actionable list, ordered/grouped by priority. This is the section that should most directly answer "okay, so what do I actually do." Each item should be a clear action with a one-line reason it matters — not an implementation spec.
6. **Recommended Next Steps** — a short, practical sequence (not a repeat of section 5) — e.g., what to tackle first and roughly why, and a closing line that invites the next conversation. This is about sequencing and momentum, not another list of findings.

## Step 4: Verify before delivering

Follow the same render-and-look discipline as the `docx` skill: after generating the `.docx`, convert it to PDF and render each page to an image, then actually look at the images before calling it done. Check specifically for:
- No orphaned blank pages (a common docx-js pitfall when a manual page break collides with an automatic section break — see the template's comments).
- Tables/lists don't split awkwardly across a page boundary.
- The document reads as 4-8 pages, not 15 — if it's running long, that's a sign you didn't cut enough in Step 2, not a sign to shrink margins/fonts to fit more in.

## Step 5: Output

Save the final file as a `.docx` with a client-appropriate name (e.g. `<BusinessName> - Website Audit & Recommendations.docx`), not the generic template filename. If a project folder is available (the same one the audit came from), save it there; otherwise save it to the current working directory and tell the user where it landed.

Briefly tell the user what got prioritized to the top and what got left out or condensed, so they can sanity-check the editorial judgment calls before sending it anywhere.
