# `@est/iconography`

The authoritative source package for EST UI icons and Icons.

It owns:

- source SVGs
- canonical metadata
- construction and naming rules
- SVG validation and optimisation
- individual SVG, sprite and manifest generation

It does not contain catalogue layouts, search behaviour or Jekyll-specific data. The package writes only to its own `dist/` directory.

## Current baseline

Version `0.2.0` establishes the first approved construction baseline:

- fill-based, single-colour SVG assets using `currentColor`
- four approved Bootstrap UI-icon imports
- four approved EST UI icons
- four approved EST Icons
- generated individual SVGs, family sprites and a versioned manifest

New EST artwork should begin with `status: draft` and follow the actual-size review defined in `docs/construction-rules.md`.

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
```

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