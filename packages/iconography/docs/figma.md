# Figma handoff

## Purpose

The Figma handoff connects the governed SVG package to a design library without creating a second source of truth.

The repository remains authoritative for:

- canonical IDs and represented meanings
- SVG geometry and construction
- family, status, source and licence metadata
- versioning, approval and deprecation decisions

Figma owns reusable design components and instance placement. It must not become an independent place to redraw, rename or reinterpret approved assets.

## Build the handoff pack

From the repository root:

```bash
npm run build:iconography
npm run test:figma --workspace @est/iconography
```

The generated output is written to:

```text
packages/iconography/dist/figma/
├── README.md
├── manifest.json
├── import/approved/
│   ├── ui-icons/
│   └── icons/
├── review/drafts/
└── archive/deprecated/
```

Generated files must not be edited or committed. They are rebuilt from the package manifest and exact optimised SVG outputs.

## Component naming

Use the generated `componentName` exactly:

```text
EST / UI icon / House
EST / UI icon / Check circle
EST / Icon / Heat pump
```

The slash-separated name gives Figma a predictable asset hierarchy. The canonical ID is separate and remains the stable cross-tool contract:

```text
ui-icon/house
ui-icon/check-circle
icon/heat-pump
```

Put the canonical ID in the Figma component description using the generated `description` field. Do not derive code identifiers from Figma display names.

## Recommended Figma organisation

Use a small number of pages and sections:

```text
Library — UI icons
Library — Icons
Review — drafts
Archive — deprecated
```

Within the two library pages, group components into sections using the generated category, such as `property`, `status`, `heating` or `appliance`.

Do not create a component set solely to group unrelated icons. Component sets should represent genuine variants of one concept, and the current library does not define colour, state or size variants as separate assets.

## Import approved assets

1. Build the handoff from the exact library version being adopted.
2. Import SVGs from `import/approved/`.
3. Convert each SVG to a component without redrawing, outlining or flattening it.
4. Rename the component using `componentName` from `manifest.json`.
5. Copy the generated `description` into the component description.
6. Place it on the page and category section indicated by the manifest.
7. Publish only approved components.

The generated filename is import-friendly, but it is not the canonical ID.

## Canvas and sizing

Keep the source canvas intact:

| Family | Source canvas | Normal product display |
| --- | ---: | ---: |
| UI icon | 16×16 | 16px |
| Icon | 32×32 | 48px |

Do not resize the vector geometry inside the source frame to create size variants. Scale component instances or wrap them in product components where another display size is needed.

The manifest provides both `sourceCanvas` and `recommendedDisplaySize` so those two concepts remain distinct.

## Colour

Assets are single-colour and use `currentColor` in code. Figma may import the SVG fill as a solid colour.

Use a product or design-system colour variable on instances or containing components. Do not create separate icon components for brand colours, interaction states or themes.

Status, warning and success meaning must not depend on colour or icon shape alone.

## Drafts

Future draft assets are generated under `review/drafts/`.

Drafts may be imported to a non-published review page for actual-size evaluation, but they must not be added to the published icon library until their repository metadata is changed to `approved` through the normal review process.

Keep the same canonical ID and proposed component name while the asset moves through review.

## Updating existing components

Approved component identity should remain stable across library releases.

When artwork changes without a canonical rename:

1. build the new handoff pack
2. locate the existing Figma component by canonical ID
3. replace its internal vector layer with the new generated SVG content
4. retain the existing top-level component, component key and name
5. refresh its generated description if metadata changed
6. review it at actual display sizes before publishing

Do not delete and recreate an approved Figma component merely to update its vector geometry. That breaks existing instances and library references.

## New, renamed and deprecated assets

### New approved asset

Create a new Figma component only after the repository asset is approved. Use its generated component name and description.

### Rename

A canonical rename requires an explicit compatibility and migration decision in the repository. Do not rename an approved Figma component independently.

### Deprecated asset

Move deprecated components to `Archive — deprecated`, update the description with migration guidance, and avoid deleting them while active product instances still exist.

## Manifest contract

`dist/figma/manifest.json` contains one mapping per package asset:

```json
{
  "canonicalId": "ui-icon/house",
  "componentName": "EST / UI icon / House",
  "family": "ui-icon",
  "category": "property",
  "status": "approved",
  "sourceCanvas": 16,
  "recommendedDisplaySize": 16,
  "figmaSvgPath": "import/approved/ui-icons/EST - UI icon - House.svg"
}
```

It also supplies:

- a component description
- source and licence metadata
- the authoritative SVG path
- the catalogue detail-page URL
- the recommended Figma page for the asset status

## What this foundation does not do

This workflow deliberately does not:

- call the Figma API
- create or publish a Figma library automatically
- preserve Figma component keys automatically
- replace a designer’s review of actual size, optical balance or meaning
- create framework, colour or state variants

A plugin or automated sync should be considered only after this manual generated workflow has been used enough to reveal repeated, high-value work.
