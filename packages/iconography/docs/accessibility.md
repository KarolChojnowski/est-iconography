# Accessible icon implementation

## Purpose

This document defines how EST iconography should be exposed to assistive technologies in product interfaces.

The asset itself does not own an accessible name. The product context determines whether an icon is decorative, informative, part of an interactive control or part of a status message.

## Decision guide

| Context | SVG treatment | Where meaning comes from |
| --- | --- | --- |
| Visible text already communicates the same meaning | `aria-hidden="true"` and `focusable="false"` | The visible text |
| A standalone non-interactive icon communicates information | `role="img"` and a concise accessible name | `aria-label` or `aria-labelledby` on the SVG |
| The icon appears inside a button or link | Hide the SVG from assistive technology | The button or link text, `aria-label` or `aria-labelledby` |
| The icon accompanies a dynamic status message | Hide the SVG and expose the text container as a status where appropriate | Visible status text, optionally in `role="status"` |

## Decorative icons

Most interface icons sit beside text that already communicates the meaning. Hide those SVGs from assistive technology to avoid duplicate announcements.

```html
<span class="icon-label">
  <svg width="16" height="16" aria-hidden="true" focusable="false">
    <use href="sprites/est-ui-icons.svg#est-ui-icon-house"></use>
  </svg>
  Property
</span>
```

Use the same treatment when an icon is visual emphasis, spacing decoration or part of a labelled button.

## Standalone informative icons

A non-interactive icon may be exposed as an image when it communicates information that is not already present in nearby text.

```html
<svg
  width="16"
  height="16"
  role="img"
  aria-label="Domestic property"
>
  <use href="sprites/est-ui-icons.svg#est-ui-icon-house"></use>
</svg>
```

Write the accessible name for the meaning in context. Do not automatically use the filename, canonical ID or metadata label.

Prefer visible text when the meaning is important, unfamiliar or difficult to express in a few words.

## Icon-only buttons and links

The interactive element must have an accessible name. Hide the SVG because the button or link owns the interaction and its name.

```html
<button type="button" aria-label="Add property">
  <svg width="16" height="16" aria-hidden="true" focusable="false">
    <use href="sprites/est-ui-icons.svg#est-ui-icon-plus"></use>
  </svg>
</button>
```

Visible text is normally clearer than an icon-only control. Use icon-only controls only when the action is familiar, space is constrained and the accessible name remains specific.

Do not add the word “button” or “link” to an `aria-label`; the element’s role is announced separately.

## Status messages

Icons and colour must not be the only evidence of success, warning or error. Keep a visible text message and hide the supporting icon.

Use `role="status"` for a dynamic, non-urgent message that should be announced without moving focus.

```html
<div role="status" class="status-message">
  <svg width="16" height="16" aria-hidden="true" focusable="false">
    <use href="sprites/est-ui-icons.svg#est-ui-icon-check-circle"></use>
  </svg>
  <span>Portfolio uploaded successfully.</span>
</div>
```

Do not add `role="status"` to static content merely because it contains a status icon.

## Focus and interaction

- Do not make the SVG itself focusable.
- Put keyboard behaviour and focus styles on the native button or link.
- Do not place `aria-hidden="true"` on a focusable control.
- Do not use an SVG click handler in place of a native interactive element.

## Colour and visual meaning

- Do not rely on colour or the icon alone to communicate a state.
- Keep visible text for errors, warnings, success messages and important classifications.
- Ensure the icon inherits a colour with sufficient contrast against its background.
- Treat the icon as reinforcement, not as the only instruction.

## Accessible-name quality

An accessible name should describe the meaning or action in the current interface.

Good examples:

- `Add property`
- `Domestic property`
- `Carbon emissions`
- `View property information`

Avoid:

- `Plus icon`
- `House SVG`
- `ui-icon/property-information`
- `Click here`

## Review checklist

Before shipping an icon:

- Decide whether the icon is decorative or informative.
- Confirm that every icon-only button or link has a specific accessible name.
- Hide decorative and control-owned SVGs with `aria-hidden="true"` and `focusable="false"`.
- Give standalone informative SVGs `role="img"` and a contextual accessible name.
- Keep visible text for status, warning, error and success meaning.
- Confirm that dynamic status text is programmatically announced where needed.
- Test keyboard focus on the containing control rather than the SVG.
- Check the result with a browser accessibility tree or screen reader.

## References

- [WAI: Decorative Images](https://www.w3.org/WAI/tutorials/images/decorative/)
- [WAI-ARIA Authoring Practices: Providing Accessible Names and Descriptions](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)
- [WAI-ARIA Authoring Practices: Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [WCAG Technique ARIA22: Using `role=status` to present status messages](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22)
- [ACT Rule: SVG element with explicit role has non-empty accessible name](https://www.w3.org/WAI/standards-guidelines/act/rules/7d6734/)
