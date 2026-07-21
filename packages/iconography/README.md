# `@est/iconography`

The authoritative source package for EST UI icons and Icons.

It owns:

- source SVGs
- canonical metadata
- construction and naming rules
- SVG validation and optimisation
- individual SVG, sprite and manifest generation

It does not contain catalogue layouts, search behaviour or Jekyll-specific data. The package writes only to its own `dist/` directory.

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

Files under `dist/` are generated and must not be edited manually.

## Licensing

EST-authored UI icons and Icons are proprietary assets owned by Energy Saving Trust and are intended for EST use only. Public repository visibility does not grant permission for external reuse, modification or redistribution.

Imported Bootstrap Icons retain their MIT licence. See [the proprietary asset notice](LICENSE-NOTICE.md) for the full boundary between EST and third-party assets.
