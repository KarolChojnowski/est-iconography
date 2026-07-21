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
| UI icons | 16×16 | 1-unit stroke for EST originals; curated Bootstrap imports retain native paths | 16px |
| Icons | 32×32 | 1-unit stroke, normally within a 28×28 live area | 48px |

All assets are single-colour and inherit colour through `currentColor`.

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

The v0.1 construction test set contains:

- four approved Bootstrap UI-icon imports
- four draft EST UI icons
- four draft EST Icons

EST artwork remains draft until the Design System team completes the visual construction review.

## Documentation

- [Iconography package](packages/iconography/README.md)
- [Construction rules](packages/iconography/docs/construction-rules.md)
- [Test-set review](packages/iconography/docs/test-set-review.md)
- [Catalogue](catalogue/README.md)

## Licensing

No general licence has yet been declared for EST-authored assets or catalogue code. See the licence notices in each part of the repository. Imported Bootstrap Icons retain their MIT licence.
