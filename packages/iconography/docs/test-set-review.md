# v0.2 baseline review record

## Purpose

This record captures the decisions made through the twelve-asset construction test. The approved baseline can now be used to review and migrate the wider EST iconography collection.

## Approved assets

### UI icons — Bootstrap

- exclamation-circle
- check-circle
- plus
- arrow-right

### UI icons — EST

- kettle
- condensing-boiler
- co2
- car-front

### Icons — EST

- heat-pump
- washing-machine
- kettle
- light-bulb

## Accepted baseline

- Both families use filled SVG paths and inherit colour through `fill="currentColor"`.
- UI icons use a `0 0 16 16` viewBox and are reviewed primarily at 16px.
- Icons use a `0 0 32 32` viewBox and are reviewed primarily at 48px.
- EST artwork uses silhouettes, cut-outs and negative space rather than visible strokes.
- Bootstrap imports retain their native flattened paths and are assessed by optical compatibility.
- Matching concepts across families should feel related without reusing a mechanically scaled drawing.
- Source artwork, metadata, sprite output and catalogue previews form one governed asset contract.

## Review outcomes

- `condensing-boiler` is accepted as a specific domestic boiler metaphor and retains an avoid note for generic heating use.
- `CO₂` is accepted as vector artwork rather than live interface text.
- Both kettle assets are legible at their intended sizes and share a recognisable silhouette.
- The heat-pump fan detail remains legible at 48px.
- The light-bulb asset is accepted for domestic and energy-efficient lighting contexts.
- All eight EST test assets are approved for the v0.2 baseline.

## Continuing review

New assets should begin as drafts and follow the approval threshold in `construction-rules.md`. The baseline is stable, but it can be refined through evidence from production use without silently changing canonical meanings or identifiers.
