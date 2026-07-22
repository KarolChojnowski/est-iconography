# EST Iconography in Figma

The repository generates a Figma handoff pack from the same approved SVGs and canonical metadata used by the catalogue and developer distributions.

Build and validate it from the repository root:

```bash
npm run build:iconography
npm run test:figma
```

The output is written to:

```text
packages/iconography/dist/figma/
```

Use:

- `import/approved/` for components suitable for the published Figma library
- `review/drafts/` for non-published design review
- `archive/deprecated/` for migration reference
- `manifest.json` for canonical IDs, component names, descriptions, sizes, status and source metadata

Component names follow:

```text
EST / UI icon / House
EST / Icon / Heat pump
```

The canonical IDs remain:

```text
ui-icon/house
icon/heat-pump
```

Read the full [Figma handoff operating guide](packages/iconography/docs/figma.md) before importing or updating components.
