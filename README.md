# EST Iconography

A governed source library for Energy Saving Trust UI icons and Icons, with generated SVG assets, sprites, metadata and a searchable Jekyll catalogue.

## Asset families

| Family | Source canvas | Construction | Default display size |
| --- | ---: | --- | ---: |
| UI icons | 16×16 | 1-unit stroke for EST originals; curated Bootstrap imports retain native paths | 16px |
| Icons | 32×32 | 1-unit stroke, normally within a 28×28 live area | 48px |

All assets are single-colour and inherit colour through `currentColor`.

## Current status

This v0.1 foundation contains a twelve-asset construction test set:

- four Bootstrap UI icons
- four draft EST UI icons
- four draft EST Icons

Bootstrap assets are approved upstream imports. EST drawings remain drafts until the Design System team completes the visual construction review.

## Local development

Requirements:

- Node.js 22 or later
- Ruby 3.3 or later
- Bundler

```bash
npm install
npm run build:assets
bundle install
bundle exec jekyll serve
```

The asset build validates source SVGs and metadata, creates optimised individual SVGs, generates separate family sprites and writes the catalogue manifest.

## Useful commands

```bash
npm run validate       # Validate source assets and metadata
npm run build:assets   # Validate and regenerate distributable assets
npm run clean          # Remove generated outputs
```

## Repository model

Source SVGs and metadata are authoritative. Files under `assets/generated/` and `_data/generated/` are reproducible, build-time outputs. They are intentionally not committed and must not be edited manually.

Canonical IDs are namespaced by family, for example:

- `ui-icon/kettle`
- `icon/kettle`

This identity must align across source filenames, metadata, Figma, catalogue entries and sprite symbols.

## Documentation

- [Construction rules](docs/construction-rules.md)
- [Test-set review](docs/test-set-review.md)

## Licensing

Imported Bootstrap Icons are provided under the MIT licence; see `licenses/bootstrap-icons-MIT.txt`. A licence for EST-authored assets has not yet been declared, so they should not be treated as openly licensed.
