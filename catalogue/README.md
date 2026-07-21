# Iconography catalogue

The Jekyll catalogue is a consumer of the generated `@est/iconography` package outputs.

It owns presentation concerns such as:

- catalogue pages and layouts
- search and filters
- previews
- inline SVG copy and downloads
- visual selected-asset bundle assembly
- implementation-helper examples and guidance
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

## Prepared package outputs

`npm run prepare:catalogue` copies the generated individual SVGs, family sprites, helper stylesheet and licence files under `catalogue/assets/generated/`.

It also creates one Jekyll page for every manifest entry:

```text
/ui-icons/<name>/
/icons/<name>/
```

These pages are generated under `catalogue/ui-icons/` and `catalogue/icons/`, are excluded from Git, and must not be edited directly. Their presentation is owned by `_layouts/asset.html`.

Each detail page includes visual review controls, usage guidance, accessible decorative and informative examples, inline SVG source and sprite implementation code.

## Implementation guide

`catalogue/implementation.html` publishes the copy-ready developer guide at:

```text
/implementation/
```

It loads the generated `styles/est-iconography.css` file and demonstrates sprite references, explicit sizes, text alignment, `currentColor`, icon-only controls and asset delivery. The canonical written standard remains in `packages/iconography/docs/implementation.md`.

## Accessibility guide

`catalogue/accessibility.html` publishes the framework-independent guidance page at:

```text
/accessibility/
```

It covers decorative icons, standalone informative SVGs, icon-only controls and dynamic status messages. The canonical written standard remains in `packages/iconography/docs/accessibility.md`; the catalogue presents the same rules as rendered, copy-ready examples.
