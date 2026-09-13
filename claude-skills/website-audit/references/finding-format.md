# Finding Format

Each finding gets its own heading and as many of the fields below as you can genuinely support. Skip a field if you have nothing real to put there rather than padding it out.

```markdown
### [Short, specific title — not "Navigation issue," but "Mobile nav hides the phone number behind the hamburger menu"]

- **Category:** Navigation / Trust (findings can span more than one category — list all that apply)
- **What I noticed:** Plain description of the observation. Just say what you saw.
- **Where it appears:** Be as specific as physically possible.
  - Live: exact page URL + rough location on page ("hero section," "footer, second column").
  - Code: file path + line number or selector/component name if you have it.
- **Why it may be a problem:** Your reasoning. If this is inference rather than something you directly verified, say so — e.g. "[ASSUMPTION] likely reduces mobile call conversions since click-to-call is a common path for local service businesses."
- **User impact:** Who's affected and how (all visitors? mobile only? first-time visitors specifically?).
- **Severity:** Low / Medium / High / Critical — your subjective first-pass judgment. Always label it as a judgment call, not a measured fact.
- **Business impact:** Plain-language guess at what this costs the business (lost leads, weaker trust, harder to maintain) — label clearly if you're speculating.
- **Possible solution:** A concrete direction, even a rough one. "Something like X" is fine.
- **Implementation note:** Anything about how hard/easy this would be, dependencies, or things to watch out for.
- **Open questions / worth investigating:** Anything you'd want to check further, ask the client, or verify with real data/tools you didn't have access to.
```

## Worked example

```markdown
### Contact form has no visible success or error state

- **Category:** Forms, Conversion, Technical issues
- **What I noticed:** Submitting the contact form on /contact triggers a page reload but nothing on the page visibly changes — no confirmation message, no redirect, no error if required fields are missing.
- **Where it appears:** Live: yourbusiness.com/contact, the form in the main content area. Code: `js/contact-form.js`, the `handleSubmit` function — [UNVERIFIED, only checked the client-side code, didn't confirm what the backend/endpoint actually does].
- **Why it may be a problem:** A visitor who submits this has no way to know whether it worked. [ASSUMPTION] Some will assume it failed and either give up or submit again.
- **User impact:** All visitors who try to make contact through the form — likely the highest-intent group on the site.
- **Severity:** High (subjective — this sits directly on the primary conversion path).
- **Business impact:** [ASSUMPTION] Potential lost leads if visitors give up after an ambiguous submit, and possible duplicate/confused leads if they resubmit.
- **Possible solution:** Add a clear inline success message or redirect to a dedicated thank-you page; add visible inline validation errors for required fields.
- **Implementation note:** Looks like a small JS change plus maybe a new confirmation element/page — doesn't look like it needs backend changes, but couldn't verify what the current endpoint returns.
- **Open questions / worth investigating:** What does the form actually submit to — is there a backend at all, or is this wired to a service like Formspree? Worth confirming before assuming the fix is purely front-end.
```

Notice the example is intentionally a little repetitive with itself (severity note restates that it's subjective; impact fields restate the assumption tag) — that's fine. Consistency of the "this is a guess" signal matters more than avoiding repetition.

## Tagging convention

Use `[ASSUMPTION]` for reasoned inference you believe is likely true but haven't directly verified, and `[UNVERIFIED]` for things you simply didn't have the access/tooling to check at all (e.g. no way to test real form submission, no analytics access, no Lighthouse run). Pick this convention (or your own equivalent) and apply it consistently through the whole document so a reader can grep for it later.
