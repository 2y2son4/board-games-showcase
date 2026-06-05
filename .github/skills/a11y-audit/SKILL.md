---
name: a11y-audit
description: >
  Audit web content for accessibility: WCAG 2.1 (A/AA/AAA), a11y checklist,
  ARIA patterns, and European legal compliance (EU Directive 2019/882 — European
  Accessibility Act, EN 301 549). Use for: accessibility audit, wcag audit,
  a11y review, POUR principles check, contrast audit, keyboard audit, screen
  reader audit, ARIA audit, EAA compliance, EN 301 549 compliance, EU
  accessibility law, accessibility report, accessibility remediation.
argument-hint: "URL, component name, or area to audit (e.g., 'whole app', 'forms', 'navigation')"
---

# Accessibility (A11Y) Audit

Produces a structured audit covering **WCAG 2.1** success criteria, the
**A11Y Project checklist**, and **European legal requirements** (EU Directive
2019/882 / EAA and EN 301 549).

---

## When to Use

- "Run an accessibility audit on this page/component/app"
- "Check WCAG compliance", "wcag audit", "a11y review"
- "Check for EAA / EU accessibility law compliance"
- "Audit for screen reader support", "keyboard navigation review"
- "Check color contrast", "check ARIA usage"
- "Generate an accessibility report"
- "Fix accessibility issues", "remediate a11y problems"

---

## Audit Procedure

### Step 1 — Scope & Context

1. Identify what is being audited: entire app, a page, a feature area, or a
   component.
2. Confirm the **target conformance level** (default: **WCAG 2.1 AA**, which
   is also the level required by the EAA / EN 301 549).
3. Note the technology stack (HTML/CSS/JS framework, Angular, React, etc.) to
   tailor recommendations.

---

### Step 2 — Static Code Analysis

Scan source files for the following issues. Map each finding to its WCAG
success criterion (SC).

#### 2a. Document & Global Structure

| Check                                                                        | WCAG SC      | Level |
| ---------------------------------------------------------------------------- | ------------ | ----- |
| `<html lang="...">` present and correct                                      | 3.1.1        | A     |
| Unique, descriptive `<title>` per page/view                                  | 2.4.2        | A     |
| Valid HTML (no broken nesting, duplicate IDs)                                | 4.1.1        | A     |
| Landmark regions used (`<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`) | 1.3.1, 2.4.1 | A     |
| Skip-navigation link present and visible on focus                            | 2.4.1        | A     |
| Viewport `user-scalable=no` / `maximum-scale` NOT used                       | 1.4.4        | AA    |
| `autofocus` attribute avoided                                                | 3.2.1        | A     |
| Session timeout extension mechanism provided                                 | 2.2.1        | A     |

#### 2b. Content & Text

| Check                                                         | WCAG SC      | Level |
| ------------------------------------------------------------- | ------------ | ----- |
| Plain language; no idioms as sole explanation                 | 3.1.5        | AAA   |
| `<button>`, `<a>`, `<label>` have unique and descriptive text | 2.4.6, 4.1.2 | A/AA  |
| Text is left-aligned (LTR) / right-aligned (RTL)              | 1.3.2        | A     |
| No instructions rely solely on sensory characteristics        | 1.3.3        | A     |

#### 2c. Headings

| Check                                    | WCAG SC | Level |
| ---------------------------------------- | ------- | ----- |
| One `<h1>` per page/view                 | 2.4.6   | AA    |
| Headings used to introduce sections      | 2.4.10  | AAA   |
| Heading levels not skipped (h1→h2→h3...) | 1.3.1   | A     |
| Logical heading sequence preserved       | 1.3.2   | A     |

#### 2d. Images & Non-Text Content

| Check                                                                  | WCAG SC      | Level |
| ---------------------------------------------------------------------- | ------------ | ----- |
| All `<img>` have `alt` attribute                                       | 1.1.1        | A     |
| Decorative images: `alt=""` and/or `role="presentation"`               | 1.1.1        | A     |
| Complex images (charts/maps) have long-text alternative                | 1.1.1        | A     |
| Images containing text: `alt` includes that text                       | 1.1.1        | A     |
| SVG icons have accessible name (title, aria-label, or aria-labelledby) | 1.1.1, 4.1.2 | A     |
| CSS background images that convey meaning have text alternatives       | 1.1.1        | A     |

#### 2e. Links & Controls

| Check                                                                 | WCAG SC | Level |
| --------------------------------------------------------------------- | ------- | ----- |
| `<a>` used for navigation, `<button>` for actions                     | 4.1.2   | A     |
| Links are visually distinguishable from body text                     | 1.4.1   | A     |
| Links opening new tab/window warn the user                            | 3.2.2   | A     |
| Links that are adjacent, separate, or icon-only have accessible names | 2.4.4   | A     |
| `:focus` styles visible on all interactive elements                   | 2.4.7   | AA    |
| Focus order matches visual/logical reading order                      | 2.4.3   | A     |
| No invisible focusable elements (hidden but still tab-reachable)      | 2.4.3   | A     |
| Keyboard shortcut conflicts avoidable/remappable                      | 2.1.4   | A     |

#### 2f. Forms

| Check                                                        | WCAG SC      | Level |
| ------------------------------------------------------------ | ------------ | ----- |
| Every input associated with a `<label>`                      | 1.3.1, 4.1.2 | A     |
| `<fieldset>` + `<legend>` used for grouped fields            | 1.3.1        | A     |
| `autocomplete` attributes provided where appropriate         | 1.3.5        | AA    |
| Error messages reference the field in error                  | 3.3.1        | A     |
| Error suggestions provided when detectable                   | 3.3.3        | AA    |
| Error/warning/success states not communicated by color alone | 1.4.1        | A     |
| Submission errors listed above form (not just inline)        | 3.3.1        | A     |
| Legal/financial submissions are reversible or reviewable     | 3.3.4        | AA    |

#### 2g. Tables

| Check                                                 | WCAG SC | Level |
| ----------------------------------------------------- | ------- | ----- |
| `<table>` used for tabular data only                  | 1.3.1   | A     |
| `<th>` with `scope` attributes for row/column headers | 1.3.1   | A     |
| `<caption>` provides a title                          | 1.3.1   | A     |

#### 2h. Media

| Check                                                          | WCAG SC | Level |
| -------------------------------------------------------------- | ------- | ----- |
| Audio/video does not autoplay                                  | 1.4.2   | A     |
| Media controls use semantic markup and are keyboard accessible | 2.1.1   | A     |
| All media can be paused                                        | 2.2.2   | A     |
| Captions present for prerecorded video                         | 1.2.2   | A     |
| Captions present for live video                                | 1.2.4   | AA    |
| Audio description provided for prerecorded video               | 1.2.5   | AA    |
| Transcripts available for audio-only content                   | 1.2.1   | A     |
| Content with 3+ flashes/sec removed or below threshold         | 2.3.1   | A     |

#### 2i. Color Contrast

| Check                                                                | WCAG SC | Level |
| -------------------------------------------------------------------- | ------- | ----- |
| Normal text: contrast ratio ≥ 4.5:1                                  | 1.4.3   | AA    |
| Large text (≥18pt or ≥14pt bold): contrast ratio ≥ 3:1               | 1.4.3   | AA    |
| UI component boundaries and icons: contrast ≥ 3:1 vs adjacent colors | 1.4.11  | AA    |
| Text over images or video: check all states                          | 1.4.3   | AA    |
| `::selection` custom colors maintain sufficient contrast             | 1.4.3   | AA    |
| Enhanced contrast (AAA): text ≥ 7:1, large text ≥ 4.5:1              | 1.4.6   | AAA   |

#### 2j. Appearance & Responsive

| Check                                                                                | WCAG SC | Level |
| ------------------------------------------------------------------------------------ | ------- | ----- |
| Text resizable to 200% without loss of content                                       | 1.4.4   | AA    |
| Content reflows at 320 CSS px wide without horizontal scroll                         | 1.4.10  | AA    |
| Text spacing adjustable (line-height 1.5×, letter-spacing 0.12×, word-spacing 0.16×) | 1.4.12  | AA    |
| Content not locked to single orientation (portrait/landscape)                        | 1.3.4   | AA    |
| Site usable in high-contrast / forced-colors mode                                    | 1.4.1   | A     |
| Color is not the only means of conveying information                                 | 1.4.1   | A     |
| Instructions not solely visual or audio                                              | 1.3.3   | A     |
| Content on hover/focus: dismissible, hoverable, persistent                           | 1.4.13  | AA    |

#### 2k. Animation & Motion

| Check                                                   | WCAG SC | Level |
| ------------------------------------------------------- | ------- | ----- |
| Animations respect `prefers-reduced-motion` media query | 2.3.3   | AAA   |
| Background video has pause mechanism                    | 2.2.2   | A     |
| No animation with >3 flashes/sec                        | 2.3.1   | A     |

#### 2l. Mobile & Touch

| Check                                                       | WCAG SC | Level |
| ----------------------------------------------------------- | ------- | ----- |
| Site can be rotated to any orientation                      | 1.3.4   | AA    |
| No horizontal scrolling on mobile                           | 1.4.10  | AA    |
| Touch targets ≥ 44×44 CSS px                                | 2.5.5   | AAA   |
| Sufficient spacing between interactive elements             | 2.5.5   | AAA   |
| Multi-point gestures have single-pointer alternatives       | 2.5.1   | A     |
| Motion actuation functions also have UI control alternative | 2.5.4   | A     |

#### 2m. ARIA & Semantics

| Check                                                            | WCAG SC | Level |
| ---------------------------------------------------------------- | ------- | ----- |
| All interactive components have accessible name                  | 4.1.2   | A     |
| ARIA roles, states, properties are valid and correct             | 4.1.2   | A     |
| Dynamic updates announced via `aria-live` or focus management    | 4.1.3   | AA    |
| `aria-hidden` not applied to focusable elements                  | 4.1.2   | A     |
| Modal dialogs trap focus and return focus on close               | 2.1.2   | A     |
| Status/toast messages exposed via `role="status"` or `aria-live` | 4.1.3   | AA    |

---

### Step 3 — Manual / Assisted Testing

These checks require browser tools, screen readers, or human judgment:

1. **Keyboard-only navigation**: Tab through entire page. Verify no keyboard
   trap (2.1.2), logical focus order (2.4.3), all interactive elements
   reachable.
2. **Screen reader test**: Use NVDA+Firefox or VoiceOver+Safari. Verify all
   content is announced meaningfully.
3. **Zoom to 200%**: Check for overflow, content loss, or broken layouts
   (1.4.4).
4. **High-contrast mode**: Toggle OS high-contrast; verify readable UI.
5. **Automated scanner**: Run axe, Lighthouse Accessibility, or WAVE. Treat
   findings as a complement, not a replacement, for manual testing.
6. **Color contrast tool**: Use browser devtools or https://webaim.org/resources/contrastchecker/.
7. **Prefers-reduced-motion**: Enable in OS settings; verify animations stop.

---

### Step 4 — European Legal Compliance Check

#### European Accessibility Act (EAA) — EU Directive 2019/882

**Applicability** (as of 28 June 2025 enforcement deadline):

- Products and services placed on the EU market after 28 June 2025 must comply.
- Applies to: e-commerce, banking, transport, e-books, audiovisual media,
  telephony services, operating systems, e-readers.
- Exemption: Micro-enterprises (< 10 employees AND ≤ €2M turnover) providing
  services are exempt from most service requirements.

**Technical standard**: EN 301 549 v3.2.1, which incorporates WCAG 2.1 Level AA
for web and mobile content (Clauses 9 and 11).

**EAA Compliance Checklist**:

| Requirement                                                                                                      | Basis                             |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Web content meets WCAG 2.1 Level AA                                                                              | EN 301 549 Clause 9               |
| Mobile apps meet WCAG 2.1 Level AA equivalent                                                                    | EN 301 549 Clause 11              |
| Accessibility statement published on website                                                                     | EAA Art. 13, EN 301 549 Clause 12 |
| Accessibility statement includes: scope, conformance level, known issues, contact for feedback, enforcement body | ETSI EN 301 549 §12.1             |
| Feedback mechanism provided for users to report accessibility barriers                                           | EAA Art. 13                       |
| Documentation and support services are accessible                                                                | EAA Annex I                       |
| Product/service design supports assistive technologies                                                           | EAA Annex I §III                  |
| Technical documentation describes how accessibility requirements are met                                         | EAA Art. 15                       |
| CE marking requirements met (where applicable to products)                                                       | EAA Art. 15                       |

**Member State Transpositions** (key markets):

- 🇪🇸 Spain: Real Decreto 1112/2018 — public sector; EAA extends to private
- All EU: WCAG 2.1 AA is the baseline for all national transpositions

**Pre-existing EU Public Sector rules**:

- EU Web Accessibility Directive 2016/2102: All EU public sector websites and
  mobile apps must conform to WCAG 2.1 AA; requires Accessibility Statement.

---

### Step 5 — Generate Audit Report

Produce a report with these sections:

```markdown
# Accessibility Audit Report

**Date**: <date>
**Scope**: <page/component/app>
**Target Level**: WCAG 2.1 AA (+ EAA compliance)
**Auditor**: GitHub Copilot (automated static analysis)

## Executive Summary

<Pass/Fail/Partial + key numbers>

## Critical Issues (Level A failures)

| #   | Issue | Location | WCAG SC | Recommendation |
| --- | ----- | -------- | ------- | -------------- |

## Significant Issues (Level AA failures)

| #   | Issue | Location | WCAG SC | Recommendation |
| --- | ----- | -------- | ------- | -------------- |

## EAA / EN 301 549 Gaps

<List gaps specific to European legal requirements>

## Warnings / Best Practices

<AAA criteria, advisory items, general improvements>

## Conformance Summary

| Criterion              | Level | Status   |
| ---------------------- | ----- | -------- |
| 1.1.1 Non-text Content | A     | ✅/❌/⚠️ |

...

## Remediation Priority

1. <Highest priority fix>
2. ...

## Tools Used

- Static analysis (Copilot)
- Recommended follow-up: axe DevTools, Lighthouse, manual screen reader test
```

---

## WCAG 2.1 Principles Reference (POUR)

| Principle          | Goal                                                | Key Guidelines                                                                                        |
| ------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Perceivable**    | Info must be presentable in ways users can perceive | Text alternatives (1.1), Time-based media (1.2), Adaptable (1.3), Distinguishable (1.4)               |
| **Operable**       | UI must be operable                                 | Keyboard accessible (2.1), Enough time (2.2), Seizures (2.3), Navigable (2.4), Input modalities (2.5) |
| **Understandable** | Info and UI must be understandable                  | Readable (3.1), Predictable (3.2), Input assistance (3.3)                                             |
| **Robust**         | Content must be robust enough for assistive tech    | Compatible (4.1)                                                                                      |

**Conformance Levels**:

- **A** (minimum): If not met, assistive technology cannot read/operate the page
- **AA** (required): Required by EAA, WCAG policies, and most national laws
- **AAA** (enhanced): Specialized/optional; not required as a blanket policy

---

## Quick Reference — Contrast Ratios

| Text type                          | AA (1.4.3) | AAA (1.4.6) |
| ---------------------------------- | ---------- | ----------- |
| Normal text (< 18pt / < 14pt bold) | ≥ 4.5:1    | ≥ 7:1       |
| Large text (≥ 18pt or ≥ 14pt bold) | ≥ 3:1      | ≥ 4.5:1     |
| UI components / icons              | ≥ 3:1      | —           |

---

## Resources

- [WCAG 2.1 Full Specification](https://www.w3.org/TR/WCAG21/)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11Y Project Checklist](https://www.a11yproject.com/checklist/)
- [EU Directive 2019/882 (EAA)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882)
- [EN 301 549 v3.2.1](https://www.etsi.org/deliver/etsi_en/301500_302000/301549/03.02.01_60/en_301549v030201p.pdf)
- [EU Web Accessibility Directive 2016/2102](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L2102)
- [WAI ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [axe DevTools](https://www.deque.com/axe/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
