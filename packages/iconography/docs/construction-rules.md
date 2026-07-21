# Construction rules — test-set draft

These rules are intentionally provisional until the twelve-asset test set has been reviewed at actual size.

## UI icons

- Source canvas and `viewBox`: `0 0 16 16`.
- Default display size: 16px.
- Original EST assets use a 1-unit stroke.
- Default stroke treatment: `currentColor`, round caps and round joins.
- Fill is normally `none` for EST originals.
- Bootstrap imports retain their original flattened fill paths.
- Bootstrap and EST assets are judged together by rendered optical weight, not identical SVG primitives.
- Avoid live text, embedded bitmaps, masks that are unnecessary, scripts and external references.

## Icons

- Source canvas and `viewBox`: `0 0 32 32`.
- Default display size: 48px.
- Standard stroke: 1 unit, which renders as 1.5px at 48px.
- Normal live area: 28×28 units, inset 2 units from the canvas.
- Optical overshoot may extend up to 1 unit outside the live area when necessary.
- Colour is inherited through `currentColor`.
- Fill is normally `none`.
- Default caps and joins are round, but the family review should confirm whether technical objects need selected square treatments.

## Review threshold

No EST test asset should be marked `approved` until the family has been reviewed at actual size and the construction rules have been amended to reflect the findings.
