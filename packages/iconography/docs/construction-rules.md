# Construction rules — fill-based test baseline

These rules remain provisional until the twelve-asset test set has been reviewed at actual size, but the construction model is now settled: both EST-authored assets and curated Bootstrap imports use fill-based SVG paths.

## Shared construction model

- Colour is inherited through `fill="currentColor"` on the root SVG.
- Source SVGs must not depend on a visible stroke.
- Shapes may use multiple filled paths or compound paths with `fill-rule="evenodd"` to create controlled negative space.
- Avoid hard-coded colours, live text, embedded bitmaps, unnecessary masks, scripts and external references.
- Judge assets by rendered optical weight and legibility, not by path count or geometric uniformity.
- Details that close, merge or blur at the intended display size should be simplified or removed.

## UI icons

- Source canvas and `viewBox`: `0 0 16 16`.
- Default display size: 16px.
- Use compact filled shapes with clear negative space.
- Keep important gaps and counters at roughly 1 unit or more where possible.
- Avoid decorative detail that does not survive at 16px.
- Curated Bootstrap imports retain their original flattened paths.
- EST-authored icons should sit comfortably beside Bootstrap icons without attempting to imitate every upstream geometric decision.

## Icons

- Source canvas and `viewBox`: `0 0 32 32`.
- Default display size: 48px.
- Normal live area: 28×28 units, inset 2 units from the canvas.
- Optical overshoot may extend up to 1 unit outside the live area when necessary.
- Use filled silhouettes, cut-outs and internal negative space to communicate structure.
- Preserve more descriptive detail than the UI-icon family, but remove features that do not remain clear at 48px.
- Matching concepts across the two families should feel related without simply scaling the same drawing.

## Review threshold

No EST test asset should be marked `approved` until the family has been reviewed at actual size and the construction rules have been amended to reflect the findings.
