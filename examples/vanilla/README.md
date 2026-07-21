# Vanilla consumer example

A small framework-independent product page built from a real selected EST iconography bundle.

It demonstrates:

- loading the optional helper stylesheet
- referencing both family sprites from external files
- decorative icons beside visible text
- a standalone informative SVG
- an accessible icon-only button
- a dynamic status message with visible text
- product-level colour and layout overrides

## Build

From the repository root:

```bash
npm run build:example
```

The command rebuilds the authoritative iconography package from the current repository checkout, generates a selected bundle from `selection.json`, and writes the complete static example to:

```text
examples/vanilla/dist/
```

This example does **not** download the latest GitHub release. It is an integration test for the code currently under review, so its selection version must match `packages/iconography/package.json`. Published release archives are verified separately by the release workflow.

Serve the generated directory through a local HTTP server because external SVG sprite references should be tested over HTTP rather than by opening `index.html` directly:

```bash
python3 -m http.server 8000 --directory examples/vanilla/dist
```

Then open `http://localhost:8000`.

## Validate

```bash
npm run test:example
```

The smoke test rebuilds the example and confirms that:

- the selection, package and generated manifest versions agree
- the manifest contains exactly the selected canonical IDs
- each family sprite contains exactly the selected symbols for that family
- every selected individual SVG exists
- the helper stylesheet exposes the expected public classes
- the HTML uses the required accessibility patterns
- every external `<use>` reference resolves to a generated sprite symbol

Do not commit `dist/`; it is generated output.
