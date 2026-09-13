# Synthesis Guide: Raw Audit → Client Report

## The core judgment call

A raw audit optimizes for coverage: capture everything, even half-formed and overlapping thoughts, so nothing useful gets lost. A client report optimizes for the opposite: say only what matters, once, clearly. Your job in this step is to be the editor standing between those two documents — reading everything, and being genuinely selective about what earns a place in the final report.

A useful test for each candidate item: *if the client only read this one sentence and did nothing else, would it change what they do next?* If yes, it probably belongs in the report. If it's true-but-inconsequential ("uses `@import` instead of a `<link>` tag for fonts"), it doesn't — even though it was worth capturing in the raw audit.

## Roughly how much to include

These are guides, not hard limits — let the actual content decide, but treat going meaningfully over these as a signal to cut harder, not a green light to keep going:

- **What's Working:** 3-6 items. Fewer, more confidently-stated positives beat a padded list.
- **Key Opportunities:** 3-5 themes. These should be big enough that a client immediately understands why each matters — if you have 10 "opportunities," they're really recommendations in disguise; group them.
- **Prioritized Recommendations:** 5-10 concrete items. This is the actionable heart of the report — a little longer here is fine, but each item still needs to earn its place.
- **Recommended Next Steps:** 3-5 steps. This is sequencing, not a full re-list of the recommendations above.

If the raw audit contained 40+ findings (typical for a thorough first pass), you should expect to be leaving out roughly half or more of them, and merging many of the rest. That's the job working correctly, not a shortfall.

## What to cut entirely

Leave out, don't just soften:
- Pure code-quality/maintainability notes with no visible business or customer consequence (variable naming, code organization, absence of a build pipeline, unused files that aren't otherwise relevant).
- Anything the raw audit itself flagged as low severity *and* low business impact.
- Meta-commentary about the audit process itself ("could not verify X without a browser").
- Redundant restatements — if the same underlying issue appears three times in the raw audit from three category angles, that's one item here, not three, and definitely not three separately-worded near-duplicates.

## What to keep, and how to reframe it

- Anything genuinely broken that stops the site doing its job (non-functional forms, dead links, missing critical pages) — always keep, always put near the top.
- Anything with a clear, explainable business impact even if the audit hedged it as an assumption — keep, but phrase the hedge naturally instead of as a tag. E.g. raw `[ASSUMPTION] likely reduces mobile call conversions` becomes "this likely costs you some mobile enquiries, especially from people calling urgently."
- Genuine strengths, even small ones — these go in What's Working. If the raw audit flagged something as "positive, no issue found," that's exactly what belongs here.
- Strategic-level patterns that show up across multiple findings (e.g., several small findings all pointing at "the site doesn't yet show enough proof of real work") — these should become one Key Opportunity, framed as the upside, rather than living as scattered individual complaints.

## Rewriting language: before → after

The rewrite should sound like a knowledgeable person talking to a business owner they respect, not like a bug tracker. Strip: file paths, line numbers, CSS/HTML/JS syntax or property names, category labels from the source taxonomy (e.g. "Technical issues," "Design system consistency"), severity tags, and the phrase "the audit found."

**Example 1 — a broken/critical finding**

Raw: *"The Formspree endpoint is still the literal placeholder `YOUR_FORM_ID`... js/script.js explicitly detects this and blocks submission with `e.preventDefault()`... Severity: Critical... 100% of visitors attempting to convert via the form [affected]."*

Client-ready: *"Your contact form isn't actually connected yet — right now, anyone who fills it out and hits submit gets an error instead of their message being sent. This is almost certainly the single highest-priority fix, since it's the main way new customers currently try to reach you."*

**Example 2 — an assumption-flagged finding**

Raw: *"[ASSUMPTION, UNVERIFIED] The header's click-to-call phone number is hidden entirely on mobile below 760px... mobile is plausibly the most likely device for someone dealing with urgent storm damage."*

Client-ready: *"On mobile, the phone number in the header disappears — visitors have to scroll down to find another way to contact you. Since mobile is likely where people go first in an urgent, storm-damage situation, this is worth fixing so a call is always one tap away."*

**Example 3 — a positive finding**

Raw: *"Real, specific, named testimonials — 9 testimonials with full names, specific job details... Severity: N/A (strong positive — protect this in any redesign)."*

Client-ready: *"Your testimonials are a real strength — specific, credible, and clearly written by real customers about real jobs. This is exactly the kind of proof that builds trust, and it's worth protecting and even featuring more prominently, not just preserving."*

**Example 4 — a strategic-level merge of several smaller findings**

Raw findings (three separate ones): empty "Google Reviews — coming soon" placeholder card, mostly-placeholder Gallery section, and an unfinished Certifications/Insurance section.

Client-ready (merged into one Key Opportunity): *"A few sections of the site are currently placeholders — the project gallery, certifications/insurance, and Google reviews. Right now these draw attention to gaps rather than staying neutral. Filling these in (even partially) would likely do more for trust than almost anything else on the site, since they sit right next to your strongest asset — genuine customer testimonials."*

## Prioritization framework for the Recommendations section

Order recommendations by actual consequence to the business, not by the order they appeared in the raw audit. A simple, explainable way to think about it:

1. **Fix first — actively broken or losing business right now** (e.g., a non-functional contact form, a dead critical link). If anything like this exists, it should be recommendation #1, full stop, regardless of how "technical" it sounds.
2. **High-value, straightforward** — clearly worth doing, and not a large effort (e.g., adding real photos where placeholders exist, adding a missing phone number on mobile).
3. **High-value, bigger effort** — clearly worth doing, but a genuine project (e.g., a fuller SEO pass, a content overhaul).
4. **Worth doing, lower urgency** — real but smaller improvements.

You don't need to label every item with this tier explicitly in the document (a simple numbered list in this order is often cleaner than visible tier headers), but use this as the ordering logic. If the template's table/priority-column format is used, plain labels like "Do first," "Do next," and "Worth planning" read better to a client than "P1/P2/P3" or severity words like "Critical/High/Medium" (those read like the client is being graded, not advised).

## A note on tone

Confident, plain, and specific beats hedgy and vague. Avoid stacking qualifiers ("might potentially in some cases possibly reduce"). If the source audit was genuinely uncertain about something important enough to include, say so once, plainly, and move on — don't let the hedge dominate the sentence.

Avoid negative or blunt framing where a neutral one serves the same purpose — "the certifications section isn't finished yet" reads better than "the certifications section is embarrassing and undermines everything." Same information, no need for the editorializing.
