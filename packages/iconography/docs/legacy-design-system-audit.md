# Legacy Design System icon audit

## Purpose

This audit records how the legacy icon collection in `Energy-Saving-Trust/Design-System/_icons` maps into the governed EST Iconography library.

The source inventory was reviewed at commit:

```text
211b72b3f556e54e0131ba4eae968770085608c7
```

The legacy directory contains sixteen 16×16 fill-based SVG assets. The audit avoids importing duplicate concepts and improves canonical names where the legacy filename described the drawing rather than its meaning.

## Decisions

| Legacy asset | Decision | Canonical target | Rationale |
| --- | --- | --- | --- |
| `car-front` | Already represented | `ui-icon/car-front` | Included and approved in the v0.2 baseline. |
| `co2` | Already represented | `ui-icon/co2` | Included and approved in the v0.2 baseline. |
| `kettle` | Already represented | `ui-icon/kettle` | Included and approved in the v0.2 baseline. |
| `heating-boiler` | Consolidate | `ui-icon/condensing-boiler` | The existing approved boiler asset covers the intended domestic-boiler concept; a second near-duplicate is not imported. |
| `info-circle` | Prefer Bootstrap | Future curated `info-circle` import | A generic interface symbol should use an established upstream asset rather than EST-specific artwork. |
| `pie-chart` | Prefer Bootstrap | Future curated `pie-chart-fill` import | A generic data-visualisation symbol does not require custom EST artwork. |
| `pc-display` | Prefer Bootstrap | Future curated `display` import | A generic computer-display symbol does not require custom EST artwork. |
| `house` | Migrate as draft | `ui-icon/house` | The literal object name is clear and broadly useful. |
| `house-info` | Migrate and rename | `ui-icon/property-information` | The canonical name describes the property-information concept rather than the overlaid shapes. |
| `house-roof` | Migrate and rename | `ui-icon/roof` | The represented object is a roof; the house prefix is unnecessary. |
| `house-spanner` | Migrate and rename | `ui-icon/property-maintenance` | The canonical name describes repair and maintenance rather than the drawing composition. |
| `house-person` | Migrate and rename | `ui-icon/household` | Legacy tags identify occupancy; `household` is a clearer reusable concept. |
| `house-power-plug` | Migrate and rename | `ui-icon/home-electricity` | The canonical name describes domestic electricity rather than the overlaid shapes. |
| `floor-pattern` | Migrate and rename | `ui-icon/flooring` | The canonical name describes the building element rather than its rendered pattern. |
| `glazing` | Migrate as draft | `ui-icon/glazing` | The existing name is specific, recognised and suitable for building-fabric contexts. |
| `piggy-bank` | Migrate and rename | `ui-icon/savings` | The canonical name describes the intended financial meaning; the legacy visual name remains an alias. |

## First production batch

The following nine assets are imported in the first migration batch:

```text
ui-icon/house
ui-icon/property-information
ui-icon/roof
ui-icon/property-maintenance
ui-icon/household
ui-icon/home-electricity
ui-icon/flooring
ui-icon/glazing
ui-icon/savings
```

The source paths are cleaned to remove legacy CSS classes, element IDs and unused `clip-rule` attributes. The underlying EST path artwork is otherwise retained for review.

All nine assets enter with:

```yaml
status: draft
construction: fill
```

They are not stable production contracts until they have been reviewed in the catalogue at 16px, beside interface text and against neighbouring approved assets.

## Review focus

- Confirm that the composite house assets remain legible at 16px.
- Check whether `property-information`, `property-maintenance`, `household` and `home-electricity` communicate without supporting labels.
- Check whether the `roof` silhouette is substantial enough to balance the other UI icons.
- Confirm that `flooring` does not become visually noisy at actual size.
- Confirm that `glazing` reads as glazing rather than overlapping generic rectangles.
- Confirm that `savings` communicates financial savings without implying a guaranteed outcome.
- Validate the canonical names and Figma names before approval.

## Deferred follow-up

A separate curated-import change should evaluate Bootstrap Icons for:

```text
info-circle
pie-chart-fill
display
```

Those imports should record exact upstream version and MIT licence metadata and should not copy the legacy EST versions.
