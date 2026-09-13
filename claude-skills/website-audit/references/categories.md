# Audit Category Checklist

Concrete things to look for in each area. This is a prompt for your attention, not a rigid checklist to march through — if you notice something relevant that isn't listed here, write it up anyway. Skip a category quickly if there's genuinely nothing to say; don't manufacture findings to look thorough.

## UX (overall experience)
- Does the site do what a visitor in this business's target audience would actually come to do (book a service, get a quote, find a phone number, browse a menu, etc.)?
- Are there unnecessary steps, friction, or dead ends between "arrived" and "did the thing"?
- Does anything require the visitor to already know something they wouldn't know (jargon, unexplained steps, assuming prior context)?

## UI design
- Typography: font pairing, size scale, line height, readability at body-copy sizes.
- Color: contrast, consistency of palette usage, whether color is used meaningfully (e.g. one CTA color) or randomly.
- Spacing/whitespace: cramped sections, inconsistent padding/margins between similar elements.
- Iconography and imagery: quality, consistency of style, relevance, generic stock-photo feel vs authentic.

## Layout
- Grid consistency, alignment issues, elements that don't line up with their neighbors.
- Section ordering — does the page flow in a sensible order for a first-time visitor?
- Above-the-fold content: what's visible without scrolling, and is it the right thing?

## Visual hierarchy
- Is it obvious what's most important on each page/screen?
- Do headings actually decrease in visual weight in a way that matches their semantic level?
- Are CTAs visually distinct from everything else, or do they blend in?
- Anything competing for attention that shouldn't be (e.g. three "equally loud" elements).

## Navigation
- Is the main nav clear, findable, and consistent across pages?
- Any orphaned pages (reachable but not linked from nav)?
- Mobile nav pattern — does it work, is it discoverable (hamburger icon clarity, etc.)?
- Breadcrumbs / back paths where relevant.
- Does clicking the logo go home, as expected?

## Information architecture
- Does the page/content structure match how a visitor would mentally categorize this business's offerings?
- Is content grouped logically, or does related content live in unrelated places?
- Naming of nav items/sections — do they mean anything to an outside visitor, or are they internal jargon?

## User journeys
- Map the 2-3 most likely journeys (e.g. "new visitor wants a quote," "returning customer wants contact info," "someone on mobile mid-search wants to call now") and walk each one step by step.
- Where does each journey stall, loop, or dead-end?
- Is there always an obvious "next step" available?

## Messaging
- Is the value proposition clear within the first few seconds/scroll?
- Does copy speak to the visitor's problem, or just describe the business internally ("we've been established since...")?
- Tone consistency across pages.
- Anything vague, generic, or that could apply to literally any competitor?

## Content
- Typos, grammar, outdated info (old years, old team members, "coming soon" that's been there a while).
- Content gaps — claims made without support, services mentioned but not explained, no pricing/process info where a visitor would expect it.
- Content freshness signals (copyright year, last-updated dates, seasonal content that's stale).

## CTAs
- Is there a clear primary CTA per page/section, or too many competing ones?
- Wording — generic ("Submit," "Learn More") vs specific and motivating.
- Placement — visible when needed, repeated at natural decision points (not just once at the very bottom).
- Do CTAs actually lead where their wording implies?

## Conversion
- Anything creating unnecessary friction right before a conversion point (too many form fields, unclear next step, no visible price/expectation-setting).
- Trust reinforcement near conversion points (reviews, guarantees, contact info) — present or absent?
- Any leaks — points where a motivated visitor would still bounce?

## Trust
- Reviews/testimonials — present, credible-looking, specific vs generic?
- Real contact info, real address/service area, real photos vs stock imagery.
- Certifications, insurance, guarantees, association memberships if relevant to the industry.
- Anything that reads as untrustworthy: broken links, dead social icons, placeholder text left in, inconsistent business name/branding.

## Accessibility
- Color contrast (text vs background, especially for CTAs and light-on-light or khaki/pastel-style palettes).
- Alt text on meaningful images; decorative images not over-announced.
- Heading structure (single h1, logical nesting, not skipping levels).
- Form labels properly associated with inputs; focus states visible; keyboard navigability if you can test it.
- Link text that makes sense out of context (not just "click here" repeated).

## Mobile responsiveness
- Test at common breakpoints if you can render the page (phone portrait, phone landscape, tablet).
- Tap target sizes, text legibility without zooming, horizontal scroll/overflow bugs.
- Anything that works on desktop but breaks, hides, or becomes unusable on mobile.

## Forms
- Field labeling, required-field indication, inline validation/error messaging.
- What happens on success (confirmation shown? redirect? nothing visible at all — a common silent failure)?
- What happens on error (clear message, or does it fail silently/generically)?
- Any excessive fields relative to what's actually needed for a first contact.

## Interactions
- Hover/focus/active states present and sensible.
- Animation/transition quality — smooth vs janky, purposeful vs distracting.
- Any interactive element that doesn't give feedback when clicked/tapped (dead-feeling buttons).

## Empty, loading, error, and success states
- What does the site show while something is loading (spinner, skeleton, nothing/blank flash)?
- What happens on a 404 or broken link — a real branded page, or the server default?
- Empty states — e.g. a gallery/filter with no results — handled gracefully or does it look broken?
- Success states after actions (form submit, newsletter signup) — confirmed clearly or ambiguous?

## SEO
- Title tags and meta descriptions present, unique per page, reasonable length.
- Heading structure and keyword relevance to the business's actual services/area.
- Image alt text (also ties to accessibility) and file naming.
- Structured data/schema markup if present (or notably absent for a local business — e.g. no LocalBusiness schema).
- Basic crawlability signals if visible (sitemap, robots.txt) — note if you can't verify this without more tooling access.

## Performance
- Only report what you can actually observe (network requests, obviously huge unoptimized images, render-blocking resources) — do not invent load-time numbers or Lighthouse scores you haven't actually run.
- Image file sizes vs displayed size (e.g. a multi-MB hero image serving a 400px slot).
- Number of render-blocking scripts/styles if visible in the source.
- If you have no way to measure real performance, say so explicitly rather than guessing.

## Technical issues
- Console errors/warnings if you have access to them.
- Broken links, broken images (missing alt/broken src), mismatched href targets.
- Inline styles vs stylesheet, `!important` overuse, obviously duplicated CSS rules.
- Any hardcoded values that should be tokens/variables (colors, spacing, fonts).

## Missing pages or states
- Expected pages for this type of business that don't exist (e.g. no dedicated services page, no privacy policy, no about/team page if that would normally build trust).
- Missing states within existing pages (no "no results found" state, no error page, no loading indicator).

## Design system consistency
- Are colors, fonts, button styles, spacing values drawn from a consistent, limited set — or is there drift (five near-identical greens, three different button border-radius values)?
- Is there evidence of an actual design system/tokens in the code, and does the live/rendered result honor it everywhere?

## Repeated components
- Are visually/functionally identical elements actually built as one reused component, or copy-pasted with small inconsistencies each time?
- Where copy-paste drift has happened, note every location you found it, not just the first.

## Code quality
- Structure/organization of the codebase, naming conventions, obvious dead code or commented-out blocks left in.
- Separation of concerns (styles vs markup vs behavior) where relevant to the stack.
- Any obviously risky patterns (inline event handlers everywhere, global state sprawl, duplicated large blocks of markup).
- This section only applies when you have codebase access — don't guess at code quality from the rendered site alone.

## Confusing decisions
- Anything where you genuinely can't infer the reasoning and it's worth asking the client/team about directly.
- Decisions that might have been reasonable once but look stale now (old promotions, seasonal banners left up, a feature clearly built for a use case that no longer applies).

## Potential opportunities
- Things that aren't broken but represent clear upside: an easy addition, a quick win, an underused asset (e.g. great photography that's under-featured, a strong testimonial buried at the bottom).
- Ideas worth floating even if unpolished — this is the right place for a rough "what if" thought.
