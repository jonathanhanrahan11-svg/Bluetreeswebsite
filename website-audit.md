# Website Audit — Raw First Pass

> This is an intentionally messy, extremely detailed first-pass audit. It is not client-ready. Do not clean this up before a deliberate refinement pass. Findings may overlap or repeat on purpose — that's signal, not a mistake.

**Audited:** Local codebase only — `/Users/jonnyhanrahan/Website design/Blue trees website` (index.html, css/style.css, js/script.js, images/, plus `.claude/agents` and `.claude/settings.local.json` for context)
**Date:** 2026-07-26
**Scope/access notes:** [UNVERIFIED — no live URL was provided, so nothing here reflects actual rendered/live behavior]. Everything below is inferred from reading the source directly — HTML markup, CSS rules (including computed custom-property cascade by hand), and JS logic. No browser, no screenshots, no DevTools console, no network panel, no Lighthouse/PageSpeed run, no real analytics, no actual mobile device testing. Where I'm reasoning about visual outcome rather than something literally present in a line of code, I've tagged it `[ASSUMPTION]`. Where I simply have no way to check at all, I've tagged it `[UNVERIFIED]`. Did not modify any files — read-only pass.

Business context (inferred from copy, not confirmed): "Blue Trees" is an Essex-based tree surgery business (felling, pruning, stump grinding, hedge work, storm response, woodland management), single main contact "Louie," currently single-page site with anchor navigation. There's evidence (see Technical Issues) this was previously a multi-page site (`services.html`, `about.html`, `gallery.html` referenced in `.claude/settings.local.json` permission history) and has since been consolidated to one page. There's also evidence of a recent "light redesign" — a file `index.html.bak-pre-light-redesign` and `css/style.css.bak-pre-light-redesign` sit alongside the current versions.

---

## Table of contents

- UX
- UI design
- Layout
- Visual hierarchy
- Navigation
- Information architecture
- User journeys
- Messaging
- Content
- CTAs
- Conversion
- Trust
- Accessibility
- Mobile responsiveness
- Forms
- Interactions
- Empty / loading / error / success states
- SEO
- Performance
- Technical issues
- Missing pages or states
- Design system consistency
- Repeated components
- Code quality
- Confusing decisions
- Potential opportunities
- Assumptions & unverified items (roundup)
- Questions for the client/team
- Rough ideas / parking lot

---

## UX

### Primary "get a quote" journey is short, which is good
- **What I noticed:** From landing, a visitor can reach the contact form in one click (hero "Get A Free Quote" button → `#contact` anchor). Form itself asks for name, phone, email, service dropdown, free-text message, optional photo/video upload.
- **Where it appears:** `index.html` lines ~66-71 (hero CTA), ~610-664 (form).
- **Why it may be a problem:** It isn't a problem — flagging as a positive so it doesn't get lost/removed in a later redesign pass.
- **Severity:** N/A (positive finding)
- **Possible solution:** N/A — preserve this in any redesign.

### The site's biggest visible trust asset (real testimonials) sits below several sections a first-time visitor has to scroll through
- **What I noticed:** Testimonials section is the *second* section after hero/services, which is reasonable, but it's a long scroll on a single long page (hero → services grid of 6 cards → testimonials). See also Conversion/Trust below.
- **Where it appears:** `index.html`, section order lines 128-425.
- **Severity:** Low
- **Possible solution:** Consider pulling 1-2 short, punchy testimonial snippets higher, e.g. near the hero, similar to the "100% Recommended · 16 reviews on Facebook" badge that's already in the hero visual — that badge is arguably already doing this job. [ASSUMPTION] worth AB-testing rather than assuming.

### "Gallery" section shows almost no real work photography
- **What I noticed:** The `#gallery` "Our Work" section — the section a visitor would go to specifically to see proof of quality work — has 9 grid tiles, and only 2 of them use an actual image, and that image is the *company logo icon*, not a photo of any work. The other 7 tiles are plain SVG line-icons with a caption like "Crown Reduction — Oak" or "Sectional Felling."
- **Where it appears:** `index.html` lines 561-606, `.gallery-item` markup.
- **Why it may be a problem:** For a trade business, "show me the work" is one of the highest-trust-building things a gallery can do. Right now it's essentially a wireframe/placeholder pretending to be a finished gallery.
- **User impact:** Every visitor who clicks through to Gallery expecting to see real before/after photos.
- **Severity:** High
- **Business impact:** [ASSUMPTION] Likely undermines the "100% recommended" messaging elsewhere — visitors may wonder if there's actually a portfolio of work behind the reviews.
- **Possible solution:** Replace with real jobsite photography — even phone photos of recent jobs would out-perform icon placeholders.
- **Implementation note:** Section copy literally says "Replace these placeholders with your own site photography" — see Content section, this is a note-to-self left in live copy.
- **Open questions:** Is there a backlog of real photos not yet uploaded, or does none exist yet? Worth asking directly.

### Certifications/insurance section undermines trust rather than being neutral
- (Cross-referenced in Trust and Content below — flagging here too because it's fundamentally a UX sequencing issue: a visitor is shown a section literally titled "Qualifications & Insurance" that says "to be added" and shows three `[placeholder]` pills.)
- **Severity:** High
- **Possible solution:** Hide the section entirely until real content exists, rather than showing visitors an empty promise.

---

## UI design

### Confusingly-inverted CSS custom property names
- **What I noticed:** In `:root`, `--black: #f8f9f4` (a near-white/cream color) and `--white: #16201a` (a near-black dark green). These names are the *opposite* of what they hold.
- **Where it appears:** `css/style.css` lines 8, 25 (`:root` block).
- **Why it may be a problem:** [ASSUMPTION] This strongly looks like leftover naming from a previous dark-mode-only design (see `.bak-pre-light-redesign` files) where `--black` really was black and `--white` really was white, and then someone did a "light redesign" by just swapping the *values* assigned to those variable names without renaming the variables themselves.
- **User impact:** None directly (visitors never see variable names) — this is a maintainability/future-editor risk, not a visitor-facing issue.
- **Severity:** Medium (for anyone editing this code later, including future-me or a hired dev)
- **Business impact:** [ASSUMPTION] Increases the chance of a future styling bug when someone reads `--white` in the CSS, assumes it's white, and uses it somewhere it shouldn't be.
- **Possible solution:** Rename to semantic tokens like `--surface`, `--surface-alt`, `--text` instead of literal color-name variables.
- **Implementation note:** Would need a careful find-and-replace across the whole stylesheet since these are used dozens of times.
- **Open questions/worth investigating:** Was this naming intentional (e.g. kept for git-diff minimization) or just not revisited after the redesign?

### Same finding, different lens — likely rendering consequence
- **What I noticed:** The CSS comment at the top of the "dark bookend zones" rule explicitly says: *"header, hero, CTA banner and footer keep the original dark palette while the rest of the site runs light."* But the actual selector is `.site-header, .cta-banner, .site-footer` — **`.hero` is not included.**
- **Where it appears:** `css/style.css` lines 38-52 (comment + selector), compare to `.hero` rule starting line 287 which is a sibling selector, not nested inside the dark-override block.
- **Why it may be a problem:** Because `--black`/`--white`/etc. are re-defined only inside `.site-header, .cta-banner, .site-footer`, the `.hero` section — which sits between the header and the rest of the light-themed content — would inherit the **root (light)** values for these tokens instead of the dark ones the comment says it should have. `[ASSUMPTION, UNVERIFIED — could not render the page to confirm]` this likely means: the hero's background gradient (`linear-gradient(180deg, var(--black) 0%, var(--black-soft) 100%)`, line ~293) renders as a light cream gradient instead of dark; the very faint grid-line overlay (`.hero::before`, lines 297-307) uses `rgba(244,247,251,0.035)` — a near-invisible near-white line pattern that was clearly designed to be barely-visible *against a dark background* — against a light background this would likely be essentially invisible, i.e. a whole decorative layer silently doing nothing.
- **User impact:** Purely visual/polish — wouldn't break functionality, but could make the hero look flatter/less designed than intended, or could look totally fine by coincidence. Genuinely can't tell without rendering it.
- **Severity:** Medium — flagged as a judgment call, and specifically flagged as needing visual verification before treating it as a real bug.
- **Business impact:** [ASSUMPTION] minor at most — first impression polish, not a functional break.
- **Possible solution:** Either add `.hero` to the dark-override selector list (if the comment reflects the real intent), or update the comment to remove "hero" from the description (if the light hero is actually intentional/fine).
- **Implementation note:** One-line CSS selector change if the fix is "add .hero to the list" — very cheap either way.
- **Open questions/worth investigating:** **This is the single most important thing to actually check live before acting on it** — open the site in a browser and look at the hero section. If it already looks dark and intentional, this whole finding is moot and the selector is fine as-is for some other reason I'm not seeing from source alone (e.g., inline styles or JS I missed).

### Typography pairing
- **What I noticed:** Playfair Display (serif, headings) + Inter (sans, body) — a fairly common and generally safe trade/service-business pairing.
- **Where it appears:** `css/style.css` line 5 (font import), lines 30-31 (font variables).
- **Severity:** N/A (no issue found, noting for completeness)

### Inline one-off spacing values
- **What I noticed:** 11 instances of `style="margin-*"` directly in the HTML (values like 18px, 22px, 26px, 28px, 32px, 56px) rather than using a consistent spacing scale.
- **Where it appears:** `index.html` — e.g. line 458 (`style="margin-bottom: 32px;"`), line 506 (`style="margin-top: 56px;"`), line 618, line 621, and others; grep for `style="` returns 11 hits total.
- **Why it may be a problem:** The design system has custom properties for color, radius, font, container width, and shadow (`css/style.css` lines 7-36) but **no spacing tokens** — so these one-off pixel values aren't drawing from anything centrally defined, they're just hand-picked per instance.
- **Severity:** Low — cosmetic/maintainability, not visitor-facing.
- **Possible solution:** Add `--space-1` through `--space-6` (or similar) tokens and a couple of utility classes (`.mt-lg`, `.mb-xl`) instead of inline styles.
- **Category:** also Design system consistency, Code quality.

---

## Layout

### Grid system collapses at two breakpoints
- **What I noticed:** `@media (max-width: 980px)` and `@media (max-width: 760px)` both defined, covering hero/split/contact-layout going to single column, then nav/grids going fully mobile below 760px.
- **Where it appears:** `css/style.css` lines 973-997.
- **Severity:** N/A (positive/neutral, noting responsive coverage exists) — but see Mobile Responsiveness section for the caveat that I couldn't actually render these.

### Gallery grid has arbitrary-feeling "tall" variation with no real photos behind it
- **What I noticed:** `.gallery-item.tall` spans 2 grid rows (lines 569, 589 use the `tall` class) — a layout technique that's normally used to let a few standout/portrait photos break the grid rhythm. Here it's applied to two placeholder icon tiles with no actual photo, so the visual variation has no content reason behind it yet.
- **Where it appears:** `index.html` lines 569-573, 589-593; `css/style.css` line 624.
- **Severity:** Low
- **Possible solution:** Once real photos exist, keep this pattern — it's a good technique, just currently decorating empty content.

---

## Visual hierarchy

### Eyebrow → H2 → supporting paragraph pattern is consistent across sections
- **What I noticed:** Every major section (Services, Testimonials, About, Values, Gallery, Contact) uses the same `eyebrow` + `h2` + intro paragraph header pattern.
- **Where it appears:** Throughout `index.html`, e.g. lines 130-134, 222-226, 500-504.
- **Severity:** N/A (positive)

### Hero badge is a hardcoded-dark component regardless of the surrounding section's actual theme
- **What I noticed:** `.hero-badge` uses a hardcoded `rgba(5,7,9,0.75)` background (not a CSS variable) — so unlike the rest of `.hero`, this specific floating "100% Recommended" badge will *always* render dark, independent of whatever the `.hero` background bug above resolves to.
- **Where it appears:** `css/style.css` lines 436-452.
- **Why it may be a problem:** If the `.hero` background does turn out to render light (see UI design finding above), this hardcoded-dark badge would look intentional/fine (dark chip floating on a photo/gradient is a common pattern). If `.hero` renders dark as originally intended, it also still works. So this is actually fairly resilient either way — flagging mainly so it's on record as *not* using the token system, for consistency's sake.
- **Severity:** Low

---

## Navigation

### Header nav and footer nav have different link sets
- **What I noticed:** Header `.main-nav` has 6 items: Home, Services, Testimonials, About, Gallery, Contact. Footer "Navigate" column has only 4: Home, Services, About, Gallery — **Testimonials and Contact are missing from the footer nav.**
- **Where it appears:** `index.html` lines 20-28 (header nav) vs lines 751-759 (footer nav).
- **Why it may be a problem:** Minor inconsistency; footer nav is often the "second chance" nav for someone who scrolled all the way down, and Contact is arguably the single most important link to have there.
- **User impact:** Someone at the bottom of the page wanting to jump to Contact has to scroll back up or use the CTA banner button instead — not broken, just inconsistent.
- **Severity:** Low
- **Possible solution:** Match footer nav items to header nav items, or make the omission deliberate (e.g. footer intentionally shows a curated subset) and just confirm that's the intent.

### Footer "Services" links all point to the same anchor
- **What I noticed:** All four footer service links (Tree Felling, Pruning, Stump Grinding, Emergency Callout) point to the exact same `#services` anchor — none link to a specific service.
- **Where it appears:** `index.html` lines 763-766.
- **Why it may be a problem:** Reads like distinct links but behaves like one link repeated four times.
- **Severity:** Low-Medium
- **Possible solution:** Add `id`s to each service card (e.g. `id="felling"`) and point each footer link at its own card. Also ties into SEO — see below.

### Site nav is entirely anchor-based (single page), but there's evidence this used to be a multi-page site
- **What I noticed:** `.claude/settings.local.json` permission history includes commands referencing `services.html`, `about.html`, `gallery.html` as separate files/URLs (e.g. `curl ... http://localhost:8765/services.html`), which don't exist in the current file structure (only `index.html` exists now).
- **Where it appears:** `.claude/settings.local.json`, permissions.allow array.
- **Why it may be a problem:** [UNVERIFIED — no way to check without live hosting access] If those separate pages were ever actually published/indexed/linked externally, and the site has since been consolidated to a single page without redirects, those URLs would now 404 for anyone with an old link/bookmark.
- **Severity:** Medium if those pages were ever live and indexed; N/A if this was all pre-launch experimentation.
- **Open questions:** Were `services.html`/`about.html`/`gallery.html` ever actually deployed/public? If yes, are redirects to `index.html#services` etc. in place?

---

## Information architecture

### No per-service deep links despite 6 distinct services being presented as separate cards
- **What I noticed:** Services section presents 6 clearly separate offerings (Felling & Removal, Crown Reduction & Pruning, Stump Grinding, Hedge Trimming, Emergency Storm Response, Woodland Management) as individual cards, but none have their own anchor/id — everything links to the shared `#services` section top at best.
- **Where it appears:** `index.html` lines 135-216.
- **Severity:** Low-Medium
- **Possible solution:** Add ids per card; enables more precise footer/nav linking (see Navigation) and more specific SEO targeting (see SEO).

### Single long page consolidates all content under one URL
- **What I noticed:** Everything (services, testimonials, about, values, gallery, contact) lives under `/` with anchor scrolling, no distinct URLs/pages.
- **Why it may be a problem:** [ASSUMPTION] Fine for a small local trade site and easy to maintain, but means all SEO relevance is concentrated on one URL rather than allowing distinct pages to individually rank for distinct search terms (e.g. "stump grinding Essex" vs "emergency tree removal Essex").
- **Severity:** Low — this is a legitimate, common tradeoff for small brochure sites, not a mistake by itself.
- **Open questions:** Was the previous multi-page structure (see Navigation section) intentionally simplified for maintenance ease, or did it regress unintentionally? Worth asking, since it affects the SEO recommendation below.

---

## User journeys

### Journey: "I want a quote" (primary)
Land on hero → click "Get A Free Quote" → scroll to `#contact` → fill form (name, phone, email required; service dropdown, message, file upload optional) → click "Send Message."

- **What I noticed:** **The form's Formspree endpoint is still the literal placeholder `YOUR_FORM_ID`** (`action="https://formspree.io/f/YOUR_FORM_ID"`), and `js/script.js` explicitly detects this and blocks submission with `e.preventDefault()` plus an `alert("This form isn't connected yet — add your Formspree endpoint in index.html to enable submissions.")`.
- **Where it appears:** `index.html` line 627; `js/script.js` lines 41-50.
- **Why it may be a problem:** This is not a hypothetical risk — it's directly, unambiguously verified in the code: **as currently shipped, this form cannot deliver a single lead.** Every visitor who fills it out and hits submit gets a raw JS `alert()` telling them (in slightly technical language) that the form isn't connected.
- **User impact:** 100% of visitors attempting to convert via the form.
- **Severity:** Critical
- **Business impact:** Complete loss of all form-originated leads until fixed. [ASSUMPTION] the phone/WhatsApp/email contact paths still work and may be absorbing some of this, but anyone who specifically wanted to attach photos/video (which the form is set up for, and which the copy explicitly invites — "Tell us a little about the job... Photos or a short video... help us quote faster") has no working alternative path to do that easily via phone/email.
- **Possible solution:** Create the real Formspree form and paste the real endpoint ID in. Very fast fix.
- **Implementation note:** This looks like a one-line change (`YOUR_FORM_ID` → real ID) — clearly flagged as a to-do by whoever built this (the JS message and the HTML comment above the form both say as much), so likely just not finished yet rather than a deeper issue.
- **Open questions:** Is this genuinely not live yet (site not yet launched), or is this the current live production file? This finding's severity depends entirely on that.

### Journey: "I want to call right now" (mobile, high urgency — e.g. storm damage)
- **What I noticed:** The header's sticky contact pill (phone number + "24/7" badge + email icon) is hidden entirely on mobile: `.contact-pill { display: none; }` inside the `max-width: 760px` media query.
- **Where it appears:** `css/style.css` line 988.
- **Why it may be a problem:** [ASSUMPTION] Mobile is plausibly the *most* likely device for someone dealing with an urgent/storm-damage situation to be searching from, and the header pill is the fastest possible path to a phone call (no scrolling required). Removing it on mobile specifically removes the fastest path on the device where speed likely matters most.
- **User impact:** Mobile visitors specifically.
- **Severity:** Medium-High
- **Business impact:** [ASSUMPTION] Possible lost urgent/emergency leads if a mobile visitor doesn't scroll down to find the phone number in the Contact section or footer.
- **Possible solution:** Consider keeping a simplified click-to-call icon/button visible in the mobile header instead of hiding contact entirely — the hamburger nav toggle already has room next to it.
- **Implementation note:** Small CSS/markup change — add a compact mobile-only call button.
- **Cross-reference:** Also relevant to Mobile responsiveness and CTAs sections.

### Journey: WhatsApp contact
- **What I noticed:** A WhatsApp link exists (`https://wa.me/447380839497`) but only inside the Contact section's info card — not surfaced anywhere higher on the page (header, hero, CTA banner).
- **Where it appears:** `index.html` lines 697-705.
- **Severity:** Low
- **Possible solution:** [ASSUMPTION, speculative] If WhatsApp is a meaningfully-used channel for this business, consider surfacing it as a floating action button or in the header pill alongside phone/email.

---

## Messaging

### Clear, benefit-oriented headline
- **What I noticed:** "Tree care Essex homeowners actually trust." — specific to audience (homeowners), specific to region (Essex), and makes a trust claim rather than a generic feature claim.
- **Where it appears:** `index.html` line 63.
- **Severity:** N/A (positive)

### Heavy repetition of "100% recommend(ed)"
- **What I noticed:** The phrase "100% recommend" or "100% Recommended" appears at least 5 times across the page: hero badge, testimonials section intro, "Why Choose" feature row, About section intro paragraph, and the About section's cert-pill.
- **Where it appears:** `index.html` lines 120, 225, 462-463, 503, 517-518.
- **Why it may be a problem:** Repetition of a single proof point can read as compensating for a lack of *other* proof points (see also the empty Gallery and Certifications findings), and the claim rests entirely on 16 Facebook reviews — [UNVERIFIED, could not check the live Facebook page] whether that count/rating is current.
- **Severity:** Low-Medium
- **Possible solution:** Keep the claim, but diversify supporting proof (real photos, real credentials) so it's not the only thing being said five different ways.

---

## Content

### Live copy contains an internal instruction note
- **What I noticed:** Gallery section intro paragraph literally says: *"A selection of felling, pruning and stump grinding work carried out across Essex. **Replace these placeholders with your own site photography.**"* — the second sentence is clearly a note to whoever maintains the site, not customer-facing copy, but it's positioned exactly like customer-facing copy.
- **Where it appears:** `index.html` line 566.
- **Why it may be a problem:** If this page goes live as-is, real visitors will read a sentence addressed to the site owner, not to them.
- **Severity:** High (if this is close to going live) — this is an easy miss to make since it reads smoothly in context.
- **Possible solution:** Remove the second sentence once real photography is added, or split it into an HTML comment instead of visible text in the meantime.

### Unfinished "to be added" copy in Accreditations section
- **What I noticed:** Section literally titled "Qualifications & Insurance" with subtext "Certification and insurance details to be added." and three pills reading "[Certification placeholder]", "[Insurance placeholder]", "[Membership placeholder]".
- **Where it appears:** `index.html` lines 427-449.
- **Severity:** High (duplicate of Trust/UX findings above — intentionally repeated here since Content is a distinct lens: this is as much a copy problem as a trust problem).
- **Possible solution:** Same as above — hide until real content exists.

---

## CTAs

### CTA wording is specific rather than generic
- **What I noticed:** "Get A Free Quote," "Contact Us Today," "Send Message," "Our Services" — none are bare "Submit" or "Learn More."
- **Severity:** N/A (positive)

### Single conversion path dominates; phone/WhatsApp are visually secondary
- **What I noticed:** The visually primary CTA (`.btn-primary`, solid blue gradient button) always points to the contact form. Phone/email/WhatsApp exist but are styled as a smaller pill or listed inside an info card, never as an equally-weighted `.btn-primary`-style button.
- **Where it appears:** `index.html`, `.btn-primary` usage throughout vs `.contact-pill`/`.info-item` styling.
- **Severity:** Low — reasonable default (form captures more detail than a phone call), just noting the asymmetry, especially combined with the form currently being broken (see User journeys — Critical finding above). Right now, the visually loudest CTA on the entire site leads to the one path that doesn't work.
- **Cross-reference:** This combination (broken form + form being the visually dominant CTA everywhere) compounds the severity of the Formspree issue — worth reading these two findings together.

---

## Conversion

### The primary conversion path is currently non-functional (repeated from User journeys, different lens)
- Severity: Critical. See full write-up under User journeys → "I want a quote." Restating here because Conversion as a category should surface this even if someone skims past User journeys.

### No urgency/expectation-setting near the form about response time — actually, there is one
- **What I noticed:** Correction/positive note: the contact section intro *does* set expectations — "we'll get back to you with a free, no-obligation quote — usually within one working day." Good practice, flagging so it's not lost.
- **Where it appears:** `index.html` line 615.
- **Severity:** N/A (positive)

---

## Trust

### Real, specific, named testimonials
- **What I noticed:** 9 testimonials with full names, specific job details ("3 very large conifers," "replacing all our old fence panels"), not generic "great service!" text.
- **Where it appears:** `index.html` lines 238-384.
- **Severity:** N/A (strong positive — protect this in any redesign, don't replace with generic copy)

### Empty "Google Reviews — Coming soon" column sits right next to the full Facebook column
- **What I noticed:** The reviews section is split into two equal-width columns; the Facebook one is full of content, the Google one is a dashed-border placeholder card saying "Coming soon."
- **Where it appears:** `index.html` lines 403-422; `css/style.css` `.review-platform-card.placeholder` lines 671-676.
- **Why it may be a problem:** Advertises an absence right next to a strength, at equal visual weight.
- **Severity:** Medium
- **Possible solution:** Either hide the Google column entirely until reviews exist there, or make it visually much smaller/lower-key so it doesn't compete for attention with the real content next to it.

### Certifications section (repeated finding, Trust lens)
- Severity: High. See UX and Content sections above for full write-up — flagging here specifically because an *empty* trust section is arguably worse than *no* trust section, since it draws attention to the gap rather than simply not mentioning it.

---

## Accessibility

### Single `<h1>`, sensible heading nesting
- **What I noticed:** Exactly one `<h1>` (verified via search), h2s for section titles, h3s for card titles — a clean, standard hierarchy.
- **Severity:** N/A (positive)

### No empty `alt=""` attributes found
- **What I noticed:** Searched for `alt=""` across the file — zero matches. All `<img>` tags found had descriptive alt text (e.g. "Mature tree canopy before crown work," "Blue Trees logo").
- **Severity:** N/A (positive) — [UNVERIFIED whether alt text is *accurate* for images not yet reviewed visually by me, just confirming none are blank]

### Decorative gallery icons paired with adjacent visible text labels, no `aria-hidden`
- **What I noticed:** `.gallery-item` SVGs (purely decorative, since the adjacent `<span>` already states the label e.g. "Sectional Felling") don't have `aria-hidden="true"`.
- **Where it appears:** `index.html` lines 573-599.
- **Why it may be a problem:** [ASSUMPTION] Minor — screen readers may or may not announce anything for an unlabeled inline SVG with no title/desc, so real-world impact is likely small, but best practice is to explicitly hide purely decorative icons from assistive tech.
- **Severity:** Low
- **Possible solution:** Add `aria-hidden="true"` to purely decorative SVGs that have adjacent text already conveying the same info.

### Visible focus states defined for form fields
- **What I noticed:** `.field input:focus` etc. get a visible `box-shadow` ring plus border color change — not relying on default browser focus outline being removed with nothing to replace it.
- **Where it appears:** `css/style.css` lines 873-877.
- **Severity:** N/A (positive)

### Color contrast — could not verify
- **What I noticed:** N/A — this needs actual rendering/a contrast-checking tool against real computed colors, which I don't have access to in a codebase-only pass.
- **Severity:** [UNVERIFIED]
- **Open questions/worth investigating:** Recommend running the live site through a contrast checker (e.g. axe DevTools, Lighthouse accessibility audit) once it's viewable in a browser, especially given the confusing color-token naming noted above — that increases (doesn't confirm) the odds of an accidental low-contrast combination somewhere.

---

## Mobile responsiveness

### Breakpoints exist and look reasonably thought-through, but nothing here is visually confirmed
- **What I noticed:** Two breakpoints (980px, 760px) touch nav, hero, grids, stats, footer, forms.
- **Severity:** [UNVERIFIED] — everything in this section is inferred from reading media queries, not from an actual rendered device/viewport test.

### Contact pill (phone/email/24-7 badge) fully hidden below 760px
- Already covered in depth under User journeys — repeating here since Mobile Responsiveness is its own audit lens and someone may only skim this section.
- **Severity:** Medium-High

### Fixed hero visual height on mobile
- **What I noticed:** `.hero-visual { height: 420px; }` inside the 980px breakpoint — a fixed pixel height rather than aspect-ratio-based sizing.
- **Where it appears:** `css/style.css` line 976.
- **Why it may be a problem:** [ASSUMPTION, UNVERIFIED — didn't render] Fixed heights can crop circular slideshow content awkwardly depending on actual viewport width at various mobile screen sizes; the slideshow itself is `aspect-ratio: 1` inside this fixed-height container, so on very narrow phones there may be extra empty space above/below the circle, or on wider phones/tablets it might feel cramped. Genuinely can't tell without testing real devices/widths.
- **Severity:** Low (flagged for verification, not asserted as broken)

---

## Forms

### Formspree endpoint not configured (repeated — Critical, see User journeys)
- Severity: Critical, fully covered above.

### No custom validation error styling
- **What I noticed:** Native HTML `required` attributes exist on name/phone/email, but no `:invalid`/custom error-state CSS classes were found in `style.css`.
- **Why it may be a problem:** [ASSUMPTION] Users will get default browser validation bubbles, which are functional but inconsistent in appearance across browsers and don't match the site's design.
- **Severity:** Low
- **Possible solution:** Add styled inline error messages/`:invalid` state styling matching the design system.

### No visible loading/success state defined for the submit action
- **What I noticed:** The submit button (`btn-primary btn-block`, "Send Message") has no defined disabled/spinner state, and there's no on-page success message or thank-you state anywhere in the HTML/CSS/JS — success handling (if any) would come entirely from wherever Formspree redirects to, which isn't configured yet either (see Critical finding).
- **Severity:** Medium (compounds the Critical form issue — even once the endpoint is fixed, there's no confirmed "did it work?" moment for the user unless Formspree's default behavior/redirect is explicitly set up)
- **Open questions:** Has a Formspree "thank you" redirect or AJAX success handler been planned at all, or does the plan rely entirely on Formspree's default post-submit page?

### File upload has no size-limit messaging
- **What I noticed:** `<input type="file" ... accept="image/*,video/*" multiple>` invites photo *and video* uploads with no visible guidance on max file size/count.
- **Where it appears:** `index.html` lines 658-661.
- **Why it may be a problem:** [ASSUMPTION] Video files in particular can be large; if Formspree (or whatever endpoint eventually receives this) has a size cap, a user could fill out the whole form, attach a video, and have it fail silently or with a generic error.
- **Severity:** Low-Medium
- **Open questions:** What are Formspree's actual attachment size/count limits on the plan being used? Worth confirming and messaging it in the field hint.

---

## Interactions

### Testimonial cards are clickable with no visual affordance that they leave the site
- **What I noticed:** `.testimonial-card` has a click handler that opens Facebook in a new tab (`js/script.js` lines 90-96), and CSS gives it `cursor: pointer` and a hover lift, but there's no icon, underline, or text hinting "this opens Facebook."
- **Where it appears:** `js/script.js` lines 90-96; `css/style.css` lines 627-635.
- **Why it may be a problem:** A user could click intending to just read more of the quote (e.g. thinking it expands) and be unexpectedly taken to Facebook in a new tab.
- **User impact:** Anyone who clicks a testimonial card.
- **Severity:** Low-Medium
- **Possible solution:** Add a small Facebook icon or "View on Facebook" microcopy on hover/always-visible, so the click target's destination is signaled.

### Two separate, inconsistent carousel patterns on one page
- **What I noticed:** The testimonial slider has visible prev/next arrow buttons *and* dots. The hero slideshow has *only* dots (no visible arrows), relying on drag/swipe or the 2-second auto-advance timer instead.
- **Where it appears:** `index.html` lines 387-393 (testimonial arrows) vs lines 116 (hero dots only, no arrows); `js/script.js` lines 52-88 vs 98-168 (two separate carousel implementations).
- **Why it may be a problem:** A visitor who figures out "click the arrow" from the testimonials slider may not realize the hero slideshow needs a drag gesture instead, since there's no arrow there.
- **Severity:** Low
- **Possible solution:** Either add visible arrows to the hero slideshow too, or intentionally document why they differ (e.g. hero is meant to be a passive/ambient background element, testimonials are meant to be actively browsed).
- **Cross-reference:** Also a Repeated Components / Code quality finding — two bespoke carousels instead of one shared component.

### Hero slideshow auto-advances quite fast (2 seconds)
- **What I noticed:** `startTimer() { timer = setInterval(next, 2000); }` for the hero slideshow vs `6000`ms for the testimonial slider.
- **Where it appears:** `js/script.js` line 130 vs line 79.
- **Why it may be a problem:** [ASSUMPTION] 2 seconds is quite fast for a photo carousel — may not give enough time to actually look at each photo, especially once real (more detailed) work photography replaces the current placeholders.
- **Severity:** Low
- **Possible solution:** Consider slowing to 4-5 seconds once real photos are in place; easy to test/tune.

---

## Empty, loading, error, and success states

### Consistent, well-implemented image fallback pattern
- **What I noticed:** Every photo-dependent element (hero slides, service cards) uses an `onerror` handler that hides the broken `<img>` and reveals a "Photo coming soon" placeholder with icon — implemented identically and consistently everywhere it's used.
- **Where it appears:** `index.html`, `onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"` — appears 7 times across hero slides and cards.
- **Severity:** N/A (positive — good defensive pattern, consistently applied)

### No defined loading/disabled state for form submission
- Covered above under Forms — repeating category tag here per the audit structure.

### No custom 404 page in the codebase
- **What I noticed:** Only `index.html` exists; no `404.html` or equivalent.
- **Why it may be a problem:** [UNVERIFIED — depends entirely on hosting configuration, which I have no access to] Many static hosts provide a generic default 404; whether that matches the brand at all is unknown from the codebase alone.
- **Severity:** Low
- **Open questions:** What's the actual hosting setup, and does it have any 404 handling configured?

---

## SEO

### No structured data, no Open Graph, no Twitter Card tags
- **What I noticed:** Searched the full `<head>` and document for `og:`, `twitter:`, `schema.org`, `application/ld+json`, `canonical`, `robots`, `sitemap` — zero matches for all of them.
- **Where it appears:** `index.html` `<head>`, lines 1-9.
- **Why it may be a problem:** For a local service business, `LocalBusiness` schema markup is one of the more reliable ways to support rich results (map pack eligibility signals, review stars in search results, etc.) — right now there's nothing here for search engines to parse beyond the plain meta description and title.
- **Severity:** Medium
- **Business impact:** [ASSUMPTION] Missed opportunity for enhanced search appearance; can't quantify without seeing actual search performance data, which I don't have.
- **Possible solution:** Add `LocalBusiness` JSON-LD schema (name, address/service area, phone, opening hours, review aggregate) and basic Open Graph tags (title, description, image) so shared links (e.g. on Facebook/WhatsApp) render properly with a preview image.
- **Open questions:** Is there a sitemap or robots.txt at the hosting root that simply isn't part of this codebase folder? Couldn't check — this folder may not be the full deployed root.

### Title and meta description are present and reasonably written
- **What I noticed:** `<title>Blue Trees | Essex Tree Surgery</title>` and a meta description mentioning the core services and "100% recommended."
- **Where it appears:** `index.html` lines 6-7.
- **Severity:** N/A (positive)

### Single-page structure concentrates SEO relevance on one URL (repeated from IA, SEO lens)
- Severity: Low — legitimate small-site tradeoff, not asserted as a mistake, but worth a deliberate decision rather than an accidental one. See Information architecture section for full framing.

---

## Performance

### Oversized image files for their likely display size
- **What I noticed:** Actual measured file sizes: `hero-1-full-canopy.jpg` 624KB, `hero-5-hedge-topiary.jpg` 456KB, `hero-6-post-rail-fence.jpg` 404KB, `hero-2-crown-reduction.jpg` 376KB, `hero-4-fence-panels.jpg` 172KB (plus a separate unused `hero-4-fence-panels.original.jpg` at 108KB), `hero-3-crew.jpg` 204KB. Logos: `logo-full.png` 396KB, `logo-icon-square.png` 240KB, `logo-icon.png` 232KB, `logo-text.png` 148KB.
- **Where it appears:** `images/gallery/*.jpg`, `images/*.png` — measured directly with `du -sh`, not estimated.
- **Why it may be a problem:** These images are displayed at a fraction of their native size (hero slideshow circle, small header logo mark) — e.g. a 624KB photo behind a header logo that renders at roughly 72×72px (`.brand-mark`, `css/style.css` lines 202-204) is a very large amount of data for a tiny visual result.
- **Severity:** Medium-High
- **Business impact:** [ASSUMPTION] Slower load, especially on mobile networks — plausibly relevant given the mobile/urgent-call-out use case flagged earlier.
- **Possible solution:** Compress and resize all images to roughly their maximum real display size; convert to WebP/AVIF with JPG fallback if the hosting setup supports it.
- **Implementation note:** No build/optimization pipeline currently exists (see Code quality) — this would likely be a manual one-time pass or the addition of a lightweight image-optimization step.

### Google Fonts loaded via CSS `@import` rather than an HTML `<link>`
- **What I noticed:** `@import url('https://fonts.googleapis.com/css2?...')` at the very top of `style.css`.
- **Where it appears:** `css/style.css` line 5.
- **Why it may be a problem:** `@import` inside a CSS file delays font discovery until the browser has already started downloading and parsing that CSS file, versus a `<link rel="preconnect">`/`<link rel="stylesheet">` pair in the HTML `<head>`, which the browser can discover and start fetching immediately in parallel.
- **Severity:** Low-Medium
- **Possible solution:** Move font loading to `<link>` tags in `<head>`, optionally with `rel="preconnect"` to `fonts.googleapis.com`/`fonts.gstatic.com`.

### Inconsistent use of `loading="lazy"`
- **What I noticed:** The Google Maps `<iframe>` has `loading="lazy"` (line 724), but none of the actual `<img>` tags (hero slides, service card photos, gallery images) do.
- **Where it appears:** `index.html`, compare line 724 to image tags throughout.
- **Severity:** Low
- **Possible solution:** Add `loading="lazy"` to below-the-fold images (services cards, gallery) — probably not to the very first hero slide, which should load eagerly.

### No way to verify actual load time, Core Web Vitals, or Lighthouse score
- **Severity:** [UNVERIFIED] — flagging explicitly rather than guessing a number. Recommend running PageSpeed Insights / Lighthouse once there's a live URL.

---

## Technical issues

### Formspree placeholder not replaced (repeated, Critical — see User journeys/Conversion)

### Dark/light CSS variable override may not include `.hero` (repeated, see UI design)

### Unused image assets sitting in the repo
- **What I noticed:** `images/gallery/hero-3-crew.jpg`, `images/gallery/hero-4-fence-panels.original.jpg`, `images/logo-full.png`, and `images/logo-icon-square.png` are present in the folder but are **not referenced anywhere** in `index.html` (verified via direct search — zero matches for each filename).
- **Where it appears:** `images/` directory vs `index.html` full-text search.
- **Why it may be a problem:** Dead weight in the repo; also worth double-checking none of these were meant to be the *actual* live asset (e.g., is `logo-full.png` supposed to be used somewhere and was accidentally left out?).
- **Severity:** Low (housekeeping) to Medium (if one of these was meant to be live and is missing by accident).
- **Open questions:** Was `hero-3-crew.jpg` (a literal "crew on site" photo — exactly the kind of authentic, trust-building image flagged as missing from the Gallery section above) intentionally left out, or just forgotten? This feels like a real missed opportunity given the Gallery section's placeholder problem.

### Backup files present inside the working folder itself
- **What I noticed:** `index.html.bak-pre-light-redesign` and `css/style.css.bak-pre-light-redesign` live directly alongside the live files, not in separate version-control history.
- **Where it appears:** Root of the project and `css/`.
- **Why it may be a problem:** [UNVERIFIED — don't know the actual deploy process] If this whole folder gets uploaded as-is to static hosting, these backup files would likely be publicly reachable at their own URLs, exposing a previous design iteration and adding clutter.
- **Severity:** Low-Medium depending on deploy method.
- **Possible solution:** Move to git history (if not already tracked there) and remove from the deployed folder; add a `.gitignore`/deploy-exclude rule for `*.bak-*` patterns.
- **Open questions:** Is this folder version-controlled with git at all? Didn't confirm presence of a `.git` directory.

### `.DS_Store` files present
- **What I noticed:** `.DS_Store` files exist at the project root and inside `images/`.
- **Severity:** Trivial/Low — harmless macOS artifacts, but another sign there's no deploy-exclusion step or `.gitignore` yet.

### Single use of `color-mix()` CSS function
- **What I noticed:** `.btn-outline` border-color uses `color-mix(in srgb, var(--white) 25%, transparent)` — the only place this function appears in the whole stylesheet.
- **Where it appears:** `css/style.css` line 162.
- **Why it may be a problem:** [ASSUMPTION] Modern function with good current browser support, but it's the one spot using this pattern instead of a plain rgba/opacity approach used everywhere else — inconsistent technique choice, and a very small compatibility question mark for older browser visitors.
- **Severity:** Low

---

## Missing pages or states

### No privacy policy / cookie notice
- **What I noticed:** Site embeds a Google Maps iframe and links out to Facebook/Instagram, both of which involve third-party data practices, but there's no privacy policy page or cookie notice anywhere in the codebase.
- **Severity:** Medium — [not legal advice, just noting the absence — worth a real legal/compliance check given UK/EU cookie and privacy expectations]

### No dedicated 404 page
- Repeated from Empty/loading/error/success states section.

### No FAQ section
- **What I noticed:** The CTA banner directly invites uncertainty ("Not sure which service you need? Ask us — it's free.") but there's no FAQ content addressing common uncertainty up front.
- **Severity:** Low — opportunity rather than a defect.
- **Cross-reference:** See Potential opportunities.

---

## Design system consistency

### Token coverage is uneven — color/radius/font/shadow exist, spacing does not
- **What I noticed:** `:root` defines color, font, radius, container width, and shadow tokens (`css/style.css` lines 7-36) but no spacing scale — consistent with the 11 inline-style spacing overrides found in the HTML.
- **Severity:** Low-Medium
- Cross-reference: UI design, Code quality.

### Multiple bespoke "placeholder state" patterns instead of one shared one
- **What I noticed:** Three separate placeholder implementations exist: `.card-photo-placeholder`/`.hero-slide-placeholder` (photo-coming-soon), `.review-platform-card.placeholder` (Google reviews), `.cert-pill-placeholder` (certifications) — each with its own CSS rather than one shared "empty/placeholder state" utility.
- **Severity:** Low — functional, just duplicated effort.

---

## Repeated components

### Two independent carousel implementations
- Repeated from Interactions — flagging again here since "Repeated components" is meant to catch exactly this kind of thing: `.testimonial-slider`/`.testimonial-track` and `.hero-slideshow`/`.hero-slide-track` are structurally very similar (a track of slides, dot indicators, auto-advance timer) but implemented as two entirely separate CSS blocks and two entirely separate JS functions in `script.js`, rather than one parameterized carousel component.
- **Implementation note:** Consolidating would reduce future maintenance (a bug fix or feature added to one wouldn't need to be manually duplicated to the other) but is a non-trivial refactor, not a quick fix.

### "Photo coming soon" placeholder markup duplicated ~10 times
- **What I noticed:** The exact same SVG + "Photo coming soon" span markup block is copy-pasted for every hero slide and every service card placeholder rather than generated.
- **Why it may be a problem:** Expected/hard to avoid in a plain static HTML file without a templating/build step — flagging as a maintenance-burden observation, not a bug: adding a 7th service means manually copying this block correctly.
- **Severity:** Low

---

## Code quality

### JS is clean and defensive
- **What I noticed:** Consistent use of guard clauses (`if (toggle && nav)`, `if (slides.length < 2) return;`), no global namespace pollution beyond the single `DOMContentLoaded` listener, clear function names (`goTo`, `resetTimer`, `endDrag`).
- **Where it appears:** `js/script.js`, whole file.
- **Severity:** N/A (positive)

### CSS is well-organized with section comments
- **What I noticed:** Clear `/* ---------------- Section Name ---------------- */` dividers throughout, custom properties used for theming rather than hardcoded colors in most places.
- **Severity:** N/A (positive, undermined only by the token-naming confusion noted above)

### No build process / bundler
- **What I noticed:** Plain `<link>`/`<script>` tags, no `package.json` found at the project root, fonts loaded via CSS `@import`.
- **Why it may be a problem:** Not inherently wrong for a small static site, but means there's no automated step that would catch/fix the oversized-image performance issue, no minification, no automatic cache-busting beyond the manual `?v=2` query strings already being hand-added to a few image URLs.
- **Severity:** Low — a reasonable choice for this site's size, just noting the tradeoff explicitly.

---

## Confusing decisions

- Why is `.hero` excluded from the dark-theme override selector when the CSS comment says it should be included? (See UI design.)
- Why does the footer nav omit Testimonials and Contact specifically? (See Navigation.)
- Why do `hero-3-crew.jpg`, `logo-full.png`, and `logo-icon-square.png` exist in the repo but appear nowhere in the page? Leftover, or prepared for something not yet built? (See Technical issues.)
- Why give the empty "Google Reviews — Coming soon" column equal visual weight to the fully-populated Facebook column instead of de-emphasizing or hiding it? (See Trust.)
- Is the current state of this file (placeholder gallery, placeholder certifications, unconfigured form) meant to represent a work-in-progress draft, or is this the actual current live production site? **This single question changes the severity of roughly a third of the findings in this document** — worth resolving before doing anything else with this audit.

---

## Potential opportunities

- Real, specific, named testimonials are a strong, underused asset — consider surfacing 2-3 of the most detailed ones (the "3 very large conifers," "replacing all our fence panels" ones) higher on the page, e.g. directly in or right after the hero.
- The 24/7 phone badge in the header is a strong differentiator, especially relevant to the "Emergency Storm Response" service — consider echoing it visually on that specific service card, not just in the header.
- Once real accreditation/insurance info exists, this could become one of the strongest trust sections on the page for a trade like tree surgery (where safety/insurance is a real customer concern) — right now it's doing the opposite of its intended job.
- A short, tree-surgery-specific FAQ (e.g. "do I need permission to fell a tree," "do you deal with Tree Preservation Orders / conservation areas") could reduce reliance on the contact form for basic questions and support more specific long-tail SEO — speculative, not based on confirmed customer question data.
- `hero-3-crew.jpg` (an actual "crew on site" photo, per its filename) sitting unused is a quick potential win for the currently-placeholder Gallery section — worth checking if it's usable as-is.

---

## Assumptions & Unverified Items (roundup)

- Whether the `.hero` section actually renders with light-theme colors instead of dark as the CSS comment implies — needs live visual confirmation. **[Highest priority to verify — see Confusing decisions.]**
- Whether this codebase represents a work-in-progress draft or the actual current live site — changes the severity of most Critical/High findings (Formspree placeholder, placeholder Gallery/Certifications content).
- Whether `services.html`/`about.html`/`gallery.html` (referenced in old permission history) were ever actually deployed/indexed publicly.
- Whether the 16 Facebook reviews / "100% recommended" figure is current — not independently checked against the live Facebook page.
- Actual rendered mobile behavior at real device widths — inferred from CSS media queries only, not tested on real devices/viewports.
- Actual color contrast ratios anywhere on the page — not measured with a tool.
- Actual page load time, Lighthouse score, or any Core Web Vitals figure — not measured; nothing in this document should be read as a real performance metric.
- Whether this project folder represents the entire deployed root (i.e., whether there's a sitemap/robots.txt/`.git` repo/build step living outside what was audited).
- Formspree's actual attachment size/count limits for the file upload field.
- Whether the footer's narrower nav/service link set is a deliberate simplification or an oversight.

## Questions for the client/team

- Is this the live production file right now, or a work-in-progress draft? (This one question matters more than almost anything else in this document.)
- Has the real Formspree endpoint been created yet, or is that still pending?
- Is there a backlog of real jobsite photography that just hasn't been uploaded, or does it not exist yet?
- Do you have actual certifications/insurance details ready to add, or is that genuinely still pending from a third party?
- Was the multi-page structure (services/about/gallery as separate pages) intentionally consolidated into a single page, and if so, were any redirects set up for old URLs?
- Is WhatsApp an actively-used contact channel worth promoting more prominently, or a lower-priority option?

## Rough ideas / parking lot

- Could the "100% Recommended" badge in the hero double as the anchor for a jump-link straight to the testimonials section, rather than being purely decorative?
- Worth considering whether the hero slideshow and testimonial slider should be unified into one reusable carousel component during any future refactor, purely from a code-maintenance angle (see Repeated components) — not urgent, but cheap to do the *next* time either one needs a change anyway.
- The dashed-border "placeholder" visual style (used for empty cert pills and the empty Google reviews card) is actually a reasonably nice, consistent visual language for "this is coming soon" — worth keeping as an intentional pattern rather than accidentally arrived at, if a formal design system doc ever gets written for this site.
- Given the amount of tree-specific detail in testimonials (conifers, hazel, eucalyptus, hedges), there might be an opportunity for a lightweight "tree types we work with" list somewhere — untested idea, no customer data behind this.
