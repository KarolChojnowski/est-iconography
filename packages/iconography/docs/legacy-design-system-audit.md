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
| `info-circle` | Replace with Bootstrap | `ui-icon/info-circle` | A generic interface symbol uses the approved Bootstrap Icons `info-circle` asset rather than EST-specific artwork. |
| `pie-chart` | Replace with Bootstrap | `ui-icon/pie-chart-fill` | A generic data-visualisation symbol uses the approved Bootstrap Icons `pie-chart-fill` asset. |
| `pc-display` | Replace with Bootstrap | `ui-icon/display` | A generic computer-display symbol uses the approved Bootstrap Icons `display` asset. |
| `house` | Migrate and approve | `ui-icon/house` | The literal object name is clear and broadly useful. |
| `house-info` | Migrate, rename and approve | `ui-icon/property-information` | The canonical name describes the property-information concept rather than the overlaid shapes. |
| `house-roof` | Migrate, rename and approve | `ui-icon/roof` | The represented object is a roof; the house prefix is unnecessary. |
| `house-spanner` | Migrate, rename and approve | `ui-icon/property-maintenance` | The canonical name describes repair and maintenance rather than the drawing composition. |
| `house-person` | Migrate, rename and approve | `ui-icon/household` | Legacy tags identify occupancy; `household` is a clearer reusable concept. |
| `house-power-plug` | Migrate, rename and approve | `ui-icon/home-electricity` | The canonical name describes domestic electricity rather than the overlaid shapes. |
| `floor-pattern` | Migrate, rename and approve | `ui-icon/flooring` | The canonical name describes the building element rather than its rendered pattern. |
| `glazing` | Migrate and approve | `ui-icon/glazing` | The existing name is specific, recognised and suitable for building-fabric contexts. |
| `piggy-bank` | Migrate, rename and approve | `ui-icon/savings` | The canonical name describes the intended financial meaning; the legacy visual name remains an alias. |

## First production batch

The following nine assets form the first migrated production batch:

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

The source paths are cleaned to remove legacy CSS classes, element IDs and unused `clip-rule` attributes. The underlying EST path artwork is otherwise retained.

All nine assets use:

```yaml
status: approved
construction: fill
```

They become stable production contracts in `v0.3.0`.

## Approval record

The batch was reviewed in the catalogue at 16px, beside interface text and against neighbouring approved EST and Bootstrap assets. The approval decision confirms that:

- the composite property concepts remain legible at actual size
- `property-information`, `property-maintenance`, `household` and `home-electricity` are sufficiently distinct with their usage guidance
- `roof` has acceptable optical weight within the family
- `flooring` retains usable negative space at 16px
- `glazing` reads as a window or glazing element in building-fabric contexts
- `savings` is paired with guidance that avoids implying a guaranteed financial outcome
- canonical names and legacy aliases provide an acceptable Figma, catalogue and code contract

## Bootstrap replacement batch

The three generic legacy symbols are represented by curated Bootstrap Icons `v1.13.1` imports:

```text
ui-icon/info-circle      source: info-circle
ui-icon/pie-chart-fill   source: pie-chart-fill
ui-icon/display          source: display
```

These assets are approved because they retain the established upstream artwork and record exact source-version and MIT licence metadata. Their source roots are normalised for this repository by removing Bootstrap CSS classes while preserving the upstream path data.

The legacy EST versions are not copied into the governed library, preventing duplicate generic concepts and reducing custom artwork maintenance.
