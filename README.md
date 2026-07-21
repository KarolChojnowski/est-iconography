# EST Iconography

A governed iconography library with two independently buildable parts:

```text
packages/iconography/   Authoritative SVG sources, metadata and generated distributions
catalogue/              Jekyll catalogue consuming the generated package outputs
```

The separation is based on a stable output contract rather than folder organisation alone. The iconography package never writes into Jekyll directories; `tools/prepare-catalogue.mjs` adapts package outputs for the catalogue.

## Asset families

| Family | Source canvas | Construction | Default display size |
| --- | ---: | --- | ---: |
| UI icons | 16×16 | Filled paths with clear negative space | 16px |
| Icons | 32×32 | Filled silhouettes and cut-outs, normally within a 28×28 live area | 48px |

All assets are single-colour and inherit colour through `fill="currentColor"`.

## Repository structure

```text
packages/iconography/
├── assets/source/
├── assets/metadata/
├── schema/
├── scripts/
├── docs/
├── licenses/
└── dist/                 generated; not committed

catalogue/
├── _config.yml
├── _layouts/
├── _data/generated/      prepared; not committed
├── assets/generated/     prepared; not committed
├── assets/css/
├── assets/js/
└── index.html

tools/
├── prepare-catalogue.mjs
└── clean-catalogue.mjs
```

## Local development

Requirements:

- Node.js 22 or later
- Ruby 3.3 or later
- Bundler

Install dependencies:

```bash
npm ci
cd catalogue && bundle install && cd ..
```

Build only the iconography package:

```bash
npm run validate:iconography
npm run build:iconography
```

Prepare and serve the catalogue:

```bash
npm run prepare:catalogue
cd catalogue
bundle exec jekyll serve
```

Or run the combined command after Ruby dependencies are installed:

```bash
npm run serve:catalogue
```

## Project-specific bundles

Generate a portable subset using canonical asset IDs:

```bash
npm run bundle:iconography -- \
  --out ./build/harp-iconography \
  ui-icon/check-circle \
  ui-icon/property-information \
  icon/heat-pump
```

The bundle contains only the selected individual SVGs, filtered family sprites, a filtered manifest and the relevant licence notices. It retains the complete distribution's paths and sprite IDs, so consumers do not need a different integration for subsets.

The command rejects unknown or duplicate IDs and refuses to erase unrelated non-empty directories. See the [package documentation](packages/iconography/README.md#selected-bundles) for the full output contract and package-local command.

## Output contract

`packages/iconography/dist/` contains portable package outputs:

```text
dist/
├── svg/
├── sprites/
├── manifest/assets.json
└── licenses/
```

Paths in the package manifest are relative to `dist/`. The catalogue adapter copies those outputs and rewrites only the public URL paths needed by Jekyll.

## Current status

Version `0.3.0` is the first approved production-migration release. It contains:

- twenty approved UI icons: thirteen EST-authored assets and seven curated Bootstrap imports
- four approved EST Icons
- complete migration, consolidation or replacement decisions for the sixteen-icon legacy Design System collection
- fill-based construction and actual-size approval rules
- contribution governance, generated detail pages and visual review controls

All 24 current assets are approved stable contracts. New EST assets should still enter as drafts and be approved only after review at their intended display size.

The complete legacy source inventory and every canonical mapping decision are recorded in the [legacy Design System icon audit](packages/iconography/docs/legacy-design-system-audit.md).

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before adding or changing an asset. It defines canonical naming, source and metadata requirements, actual-size review, approval states, compatibility rules and semantic versioning.

Approved canonical IDs are stable consumer contracts. Use the pull-request template to identify the change type, record visual evidence and make the intended approval decision explicit.

## Releases

The iconography package remains private and is not published to npm. Tags matching the package version, such as `v0.3.0`, trigger `.github/workflows/release.yml` and create a GitHub release containing:

- `est-iconography-<version>.zip`
- `est-ui-icons.svg`
- `est-icons.svg`
- `est-iconography-assets.json`

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## Catalogue deployment

The catalogue deploys through the custom GitHub Actions workflow in `.github/workflows/pages.yml`.

Before the first deployment, enable GitHub Pages once for the repository:

1. Open **Settings**.
2. Select **Pages** under **Code and automation**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

After that setting is saved, rerun the failed **Deploy catalogue** workflow or trigger it manually from the Actions tab.

The standard workflow `GITHUB_TOKEN` cannot enable Pages for a repository that has never had a Pages site. Automatic enablement would require a separate token with elevated repository administration and Pages permissions, so the one-time manual setting is intentionally preferred.

## Documentation

- [Contribution guide](CONTRIBUTING.md)
- [Iconography package](packages/iconography/README.md)
- [Construction rules](packages/iconography/docs/construction-rules.md)
- [v0.2 baseline review](packages/iconography/docs/test-set-review.md)
- [Legacy Design System icon audit](packages/iconography/docs/legacy-design-system-audit.md)
- [Catalogue](catalogue/README.md)
- [Changelog](CHANGELOG.md)

## Licensing

EST-authored UI icons and Icons are proprietary assets owned by Energy Saving Trust and are intended for EST use only. Public repository visibility does not grant permission to copy, modify, redistribute or use them outside EST-owned or expressly authorised work.

Imported Bootstrap Icons retain their MIT licence. No general licence has yet been declared for the catalogue code. See the licence notices in each part of the repository for the detailed boundaries.
