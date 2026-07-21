# `@est/iconography`

The authoritative source package for EST UI icons and Icons.

It owns:

- source SVGs
- canonical metadata
- construction and naming rules
- SVG validation and optimisation
- individual SVG, sprite and manifest generation
- selected-asset bundle generation

It does not contain catalogue layouts, search behaviour or Jekyll-specific data. The package writes its full generated distribution only to its own `dist/` directory.

## Current baseline

Version `0.3.0` establishes the first approved production-migration baseline:

- fill-based, single-colour SVG assets using `currentColor`
- twenty approved UI icons: thirteen EST-authored assets and seven curated Bootstrap imports
- four approved EST Icons
- complete canonical decisions for the sixteen-icon legacy Design System collection
- generated individual SVGs, family sprites and a versioned manifest

All current assets are approved stable contracts. New EST artwork should begin with `status: draft` and follow the actual-size review defined in `docs/construction-rules.md`.

## Legacy migration

The [legacy Design System icon audit](docs/legacy-design-system-audit.md) records the complete source inventory and the canonical migrate, consolidate or replace decision for every legacy asset.

Migrated EST artwork was reviewed in the catalogue and approved for `v0.3.0`. Generic legacy symbols use curated Bootstrap imports with exact upstream version and MIT licence metadata rather than duplicated EST artwork.

## Contributing

Use the repository-level [contribution guide](../../CONTRIBUTING.md) for naming, SVG construction, metadata, compatibility and approval rules.

Source artwork and metadata must be changed together. Do not edit files under `dist/`; they are rebuilt from the authoritative sources.

## Commands

Run from the repository root:

```bash
npm run validate:iconography
npm run build:iconography
```

Or run within this package:

```bash
npm run validate
npm run build
npm test
```

## Selected bundles

Projects can create a portable distribution containing only the assets they use. Pass canonical IDs rather than filenames:

```bash
npm run bundle:iconography -- \
  --out ./build/harp-iconography \
  ui-icon/check-circle \
  ui-icon/property-information \
  icon/heat-pump
```

The catalogue selection tray can also download a reusable JSON file:

```json
{
  "formatVersion": 1,
  "libraryVersion": "0.3.0",
  "assetIds": [
    "ui-icon/check-circle",
    "ui-icon/property-information",
    "icon/heat-pump"
  ]
}
```

Build directly from that selection:

```bash
npm run bundle:iconography -- \
  --out ./build/harp-iconography \
  --selection ./est-iconography-selection-v0.3.0.json
```

Use either positional canonical IDs or `--selection`, not both. A selection exported from a different library version is accepted with a warning; unknown or removed canonical IDs still fail validation.

The command rebuilds the authoritative package first, then writes:

```text
build/harp-iconography/
├── .est-iconography-bundle
├── svg/
│   ├── ui-icons/
│   └── icons/
├── sprites/
│   ├── est-ui-icons.svg
│   └── est-icons.svg
├── manifest/
│   └── assets.json
└── licenses/
```

The subset keeps the same relative paths, sprite IDs and manifest fields as the complete distribution. A family sprite is included only when that family was selected. The Bootstrap Icons MIT licence is included only when the bundle contains Bootstrap assets; the EST proprietary asset notice is always included.

The builder fails on unknown or duplicate canonical IDs. It can safely rebuild a directory it previously created, but refuses to erase a non-empty directory that does not contain its `.est-iconography-bundle` marker.

Run the package-local command when working inside `packages/iconography`:

```bash
npm run bundle -- --out ./iconography-bundle ui-icon/house icon/kettle
```

Use `--help` to show the command syntax.

## Accessible implementation

Accessibility is determined by the context in which an SVG is used, not by the asset file or metadata label.

Use these defaults:

- decorative icon beside visible text: `aria-hidden="true"` and `focusable="false"`
- standalone informative SVG: `role="img"` with a concise contextual accessible name
- icon inside a button or link: hide the SVG and name the containing control
- dynamic status: keep visible text, hide the supporting icon and use `role="status"` only when the update needs announcing

Do not use canonical IDs or filenames as automatic accessible names. Do not rely on icon shape or colour alone for status, warning, error or success meaning.

Read [the full accessibility guidance](docs/accessibility.md) for examples, guardrails and the review checklist. The catalogue also exposes copy-ready examples on every asset detail page.

## Output contract

```text
dist/
├── svg/
│   ├── ui-icons/
│   └── icons/
├── sprites/
│   ├── est-ui-icons.svg
│   └── est-icons.svg
├── manifest/
│   └── assets.json
└── licenses/
```

Files under `dist/` are generated and must not be edited manually. The manifest `libraryVersion` is derived from this package's `package.json` version.

## Releases

The package remains private and is not published to npm. Repository tags matching `v<package-version>` create a GitHub release containing:

- a complete versioned ZIP archive
- the UI-icon sprite
- the Icon sprite
- the generated asset manifest

## Licensing

EST-authored UI icons and Icons are proprietary assets owned by Energy Saving Trust and are intended for EST use only. Public repository visibility does not grant permission for external reuse, modification or redistribution.

Imported Bootstrap Icons retain their MIT licence. See [the proprietary asset notice](LICENSE-NOTICE.md) for the full boundary between EST and third-party assets.
