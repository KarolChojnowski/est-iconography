# Iconography catalogue

The Jekyll catalogue is a consumer of the generated `@est/iconography` package outputs.

It owns presentation concerns such as:

- catalogue pages and layouts
- search and filters
- previews
- inline SVG copy and downloads
- future selected-asset bundle building

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
