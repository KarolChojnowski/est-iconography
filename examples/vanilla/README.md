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

The command rebuilds the authoritative iconography package, generates a selected bundle from `selection.json`, and writes the complete static example to:

```text
examples/vanilla/dist/
```

Serve that directory through a local HTTP server because external SVG sprite references should be tested over HTTP rather than by opening `index.html` directly:

```bash
python3 -m http.server 8000 --directory examples/vanilla/dist
```

Then open `http://localhost:8000`.

## Validate

```bash
npm run test:example
```

The smoke test rebuilds the example and confirms that its manifest, individual SVGs, helper stylesheet, accessibility attributes and every `<use>` reference agree with the generated bundle.

Do not commit `dist/`; it is generated output.
