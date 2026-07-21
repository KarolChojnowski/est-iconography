# Iconography catalogue

The Jekyll catalogue is a consumer of the generated `@est/iconography` package outputs.

It owns presentation concerns such as:

- catalogue pages and layouts
- search and filters
- previews
- inline SVG copy and downloads
- visual selected-asset bundle assembly
- accessible implementation examples and guidance

It does not validate or generate source icon assets.

Before serving or building the catalogue, prepare its generated inputs from the repository root:

```bash
npm run build:iconography
npm run prepare:catalogue
```

Then:

```bash
cd catalogue
bundle install
bundle exec jekyll serve
```

## Generated asset pages

`npm run prepare:catalogue` also creates one Jekyll page for every manifest entry:

```text
/ui-icons/<name>/
/icons/<name>/
```

These pages are generated under `catalogue/ui-icons/` and `catalogue/icons/`, are excluded from Git, and must not be edited directly. Their presentation is owned by `_layouts/asset.html`.

Each detail page includes visual review controls, usage guidance, accessible decorative and informative examples, inline SVG source and sprite implementation code.

## Accessibility guide

`catalogue/accessibility.html` publishes the framework-independent guidance page at:

```text
/accessibility/
```

It covers decorative icons, standalone informative SVGs, icon-only controls and dynamic status messages. The canonical written standard remains in `packages/iconography/docs/accessibility.md`; the catalogue presents the same rules as rendered, copy-ready examples.
