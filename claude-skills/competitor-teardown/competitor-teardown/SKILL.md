---
name: competitor-teardown
description: Analyze 2-3 real competitor websites for a local business and produce a clear, well-organized positioning comparison — messaging, services presentation, trust signals, pricing transparency, content/SEO depth, visual quality, and calls to action — ending in concrete talking points for why a redesign or new site would win against what's currently out there. Use whenever the user wants to research competitors, understand what other local businesses in an industry are doing online, prepare for a sales pitch or client conversation, or asks something like "check out what my competitors are doing" or "help me position this against other {industry} sites." Unlike the website-audit skill, this produces a clean comparative summary, not a raw messy capture — it's meant to inform a pitch, not document everything.
---

# Competitor Teardown

## What this skill is for

When pitching a prospective client on a redesign (or just deciding how to position a new build), it helps enormously to know what the competition actually looks like — not in vague terms, but specifically: what they say about themselves, what trust signals they lean on, how transparent they are about pricing, how deep their content/SEO footprint is, and whether their site actually looks good. This skill does that homework quickly and turns it into something you can use directly in a client conversation: "here's what three other tree surgeons in Essex are doing, here's where they're weak, here's how we'd position you against that."

This is different in spirit from `website-audit`: that skill is deliberately raw and exhaustive because it's capturing everything for later refinement. This one is a comparative research summary meant to be read as-is and used in a pitch — keep it clean and organized, not a messy first-pass dump.

## Step 1: Gather inputs

You need: the business being positioned (the client or prospect), and 2-3 real competitor URLs. If the user gives you competitor names/URLs directly, use those. If they only give an industry and location ("other tree surgeons in Essex," "other dentists in Leeds"), search for real, currently-operating competitors — pick ones that look like genuine, comparable local businesses rather than national chains or directory listings, unless the user specifically wants a chain compared too.

Confirm you're comparing like with like — a one-person trade business and a large regional franchise will look different for reasons that have nothing to do with web design quality; note that context rather than ignoring it.

## Step 2: Gather material on each competitor

For each competitor site:
- **Fetch the page content** (works everywhere, no special tooling needed) — read the actual text: headline/value proposition, services listed and how they're described, any pricing information, testimonials/reviews, credentials/certifications shown, calls to action, and site structure (single page vs. many dedicated pages, e.g. per-service or per-location landing pages — this is a real, verifiable SEO signal, not a guess).
- **If you have a way to render and screenshot a page** (Chrome MCP in Cowork/Claude apps, or Playwright in a terminal environment — same dual-path situation as the `responsive-qa` skill: try Chrome MCP first if available, fall back to Playwright in a terminal-only context, and don't fight a sandbox that can't launch a browser), take a screenshot of the homepage above the fold. This lets you actually assess visual design quality, imagery, and first impression rather than inferring it from HTML alone — note clearly in the writeup whether a given observation is from reading the page or from actually seeing it rendered.
- If you can't render/screenshot, that's fine — do the comparison from content and structure alone, and say so rather than guessing at visual quality you didn't see.

## Step 3: Assess each competitor across the same fixed dimensions

Keeping the dimensions identical across every competitor (including, implicitly, the client you're positioning) is what makes the comparison useful rather than just a list of impressions:

- **Positioning & messaging** — what's the headline claim? Generic ("quality service you can trust") or specific/differentiated?
- **Services — breadth & presentation** — how many services, how clearly described, dedicated pages per service or all crammed onto one page?
- **Trust signals** — reviews (how many, how specific, which platform), certifications/accreditations shown, insurance mentioned, real photos of work/team vs. generic imagery.
- **Pricing transparency** — any real pricing/estimate information, or "contact us" only?
- **Content & SEO depth** — number of indexable pages, presence of location-specific or service-specific landing pages, blog/resources, FAQs — this is a genuine structural signal you can observe directly (page count, URL patterns), not a guess.
- **Visual design quality** — only assess this if you actually rendered/saw the page; otherwise mark as not assessed rather than inferring from HTML structure alone.
- **Calls to action** — clear and specific, or generic/absent? Multiple contact channels (phone, form, WhatsApp, live chat)?

## Step 4: Write the comparison

Produce `competitor-teardown.md` with this shape:

```markdown
# Competitor Teardown — [Industry/Location]

**Prepared for:** [client/prospect name]
**Competitors reviewed:** [names + URLs]
**Note on method:** [what was actually seen — rendered screenshots vs. content-only — be explicit about which competitors got which level of review]

## [Competitor 1 name]
Short narrative summary (3-5 sentences) covering the dimensions above — written as prose, not another exhaustive bullet dump.

## [Competitor 2 name]
...

## [Competitor 3 name]
...

## Comparison at a glance

| Dimension | [Competitor 1] | [Competitor 2] | [Competitor 3] |
|---|---|---|---|
| Positioning | | | |
| Services presentation | | | |
| Trust signals | | | |
| Pricing transparency | | | |
| Content/SEO depth | | | |
| Visual quality | | | |
| CTAs | | | |

## Where the field is weak
2-4 genuine gaps observed across multiple competitors — real, specific patterns, not "they could all be better" filler.

## How to position against this
Concrete, usable talking points for a pitch conversation — specific enough to actually say out loud to a prospective client, tied to what was actually observed rather than generic sales language.
```

Keep the per-competitor summaries genuinely comparative — always in relation to the others and to the client's situation, not just an isolated review of each site in a vacuum.

## Step 5: Output

Save `competitor-teardown.md` in the project folder if one's active, otherwise the current working directory. This is meant to be read before a client conversation, so keep it tight — if it's running long, that's a sign to cut description and sharpen the comparison table and positioning section instead, not a sign the research wasn't thorough enough.
