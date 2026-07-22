# Contributing to EST Iconography

This repository contains proprietary Energy Saving Trust assets and is intended for EST-owned or expressly authorised work. Contributions must preserve the asset ownership and licensing boundaries described in the repository licence notices.

## Principles

- Source SVGs and canonical YAML metadata are authoritative.
- Files under `packages/iconography/dist/` and generated catalogue directories must not be edited or committed.
- EST-authored assets use fill-based, single-colour SVG construction with `fill="currentColor"`.
- Canonical IDs are stable consumer contracts once an asset has been approved and released.
- New EST artwork enters the library as `draft` and becomes `approved` only after actual-size review.
- Prefer an existing asset or a suitable curated Bootstrap Icon over adding a near-duplicate.

## Change types

Choose the change type before editing because it determines the compatibility and review requirements.

| Change | Expected approach | Typical release impact |
| --- | --- | --- |
| New asset | Add source SVG and metadata with `status: draft` | Minor when approved and released |
| Artwork update | Keep the canonical ID only when the meaning is unchanged; provide before/after evidence | Patch for a small correction; minor for a material redraw |
| Metadata-only | Update labels, tags, aliases or guidance without changing meaning | Patch |
| Rename | Draft/unreleased assets may be renamed directly; approved IDs must not be silently renamed | Major if an approved ID is removed |
| Deprecation | Keep the old asset available, mark it deprecated and identify the replacement | Minor while the old ID remains available |
| Third-party import | Retain upstream artwork and record exact source, version and licence | Minor |
| Removal or meaning change | Treat as a breaking consumer change | Major |

## Start with a request

Use the [repository issue chooser](https://github.com/KarolChojnowski/est-iconography/issues/new/choose) before starting asset artwork or changing a stable asset contract:

- **Request a new asset** for a demonstrated product need that is not met by the catalogue or a suitable Bootstrap Icon.
- **Change an existing asset** for artwork corrections, redraws, metadata, guidance, source or compatibility changes where the asset remains in the library.
- **Deprecate, consolidate or remove assets** for lifecycle changes that require replacement and migration guidance.

The request records the need, context, alternatives, evidence and expected compatibility. It does not approve a canonical name or prescribe detailed artwork. Those decisions are resolved during review and implemented through a focused pull request.

Straightforward tooling, documentation and typo fixes that do not change an asset contract may go directly to a pull request.

## Before adding an asset

1. Search the catalogue using the concept, synonyms and likely aliases.
2. Check whether a curated Bootstrap Icon already communicates the meaning well enough.
3. Choose the correct family:
   - `ui-icon`: 16×16 source canvas, normally displayed at 16px.
   - `icon`: 32×32 source canvas, normally displayed at 48px.
4. Agree the canonical name before drawing. Use a concrete noun or noun phrase rather than a page, feature or implementation name.
5. Confirm how the asset will be named in Figma. The source filename, metadata ID, catalogue entry, sprite ID and Figma component should describe the same concept.

## Canonical naming

Use lowercase kebab-case:

```text
kettle
car-front
condensing-boiler
light-bulb
```

Add a view or state qualifier only when it materially distinguishes the asset, such as `car-front`. Avoid abbreviations unless they are the term users and teams actually recognise, such as `co2`.

Canonical IDs are namespaced by family:

```text
ui-icon/car-front
icon/heat-pump
```

Recommended Figma names:

```text
EST / UI icon / Car front
EST / Icon / Heat pump
```

## File placement

EST-authored source files:

```text
packages/iconography/assets/source/ui-icons/est/<name>.svg
packages/iconography/assets/source/icons/est/<name>.svg
```

Curated Bootstrap imports:

```text
packages/iconography/assets/source/ui-icons/bootstrap/<name>.svg
```

Metadata lives in:

```text
packages/iconography/assets/metadata/ui-icons.yml
packages/iconography/assets/metadata/icons.yml
```

Do not create or edit generated files in:

```text
packages/iconography/dist/
catalogue/assets/generated/
catalogue/_data/generated/
catalogue/ui-icons/
catalogue/icons/
```

## SVG requirements

Every source SVG must:

- use the correct family `viewBox`: `0 0 16 16` or `0 0 32 32`
- set `fill="currentColor"` on the root `<svg>`
- avoid a visible root stroke
- use filled paths, compound paths and controlled negative space
- remain legible at the intended display size
- avoid hard-coded colours
- avoid live text; convert necessary lettering to paths
- avoid scripts, event handlers, external references, embedded images and unnecessary masks
- avoid classes or product-specific styling hooks

A valid root element is typically:

```svg
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 16 16"
  fill="currentColor"
>
  <path d="..." />
</svg>
```

See [`packages/iconography/docs/construction-rules.md`](packages/iconography/docs/construction-rules.md) for the accepted visual standard.

## Metadata requirements

Add one metadata entry whose key matches the family and source filename:

```yaml
ui-icon/example-name:
  label: Example name
  family: ui-icon
  source: est
  category: example
  tags: [primary term, related term]
  aliases: [common synonym]
  status: draft
  construction: fill
  usage: Describes the specific concept this asset represents.
  avoid: Optional guidance for a likely misuse.
  note: Optional implementation or interpretation guidance.
```

For Bootstrap imports, also include:

```yaml
source_name: upstream-icon-name
source_version: 1.13.1
license: MIT
```

Tags support broad discovery. Aliases should capture names people may genuinely search for but should not become the canonical label.

## Local workflow

Install dependencies once:

```bash
npm ci
cd catalogue && bundle install && cd ..
```

Validate the governance forms and authoritative package:

```bash
npm run validate:issue-forms
npm run validate:iconography
npm run build:iconography
```

Prepare and serve the catalogue:

```bash
npm run prepare:catalogue
cd catalogue
bundle exec jekyll serve
```

The pull request must pass the repository validation workflow, including issue-form validation, deterministic package generation and a strict Jekyll build.

## Visual review

Review UI icons at:

- 16px actual size
- 24px and 32px supporting sizes
- 64px enlarged inspection
- beside normal interface text

Review Icons at:

- 48px actual size
- 32px compact use
- 64px and 96px inspection sizes

For both families, check:

- light, dark and neutral backgrounds
- navy, blue, muted and white foreground colours
- optical weight beside neighbouring assets
- closed or blurred counters and gaps
- alignment and apparent centring
- whether the silhouette communicates without surrounding copy
- whether the usage and avoid guidance are still accurate

New EST assets remain `draft` during this review. Move an asset to `approved` only when the design review decision is explicit in the pull request.

## Updating an approved asset

An approved asset may retain its canonical ID when:

- the represented meaning is unchanged
- the family is unchanged
- existing implementation references remain valid
- the update is a visual correction or refinement rather than a semantic replacement

Include before/after images at actual size and explain the consumer impact. Material redraws belong in a minor release even when the ID remains stable.

Do not rename an approved asset in place. Introduce the new canonical asset, retain the old ID as deprecated for a migration period, and document the replacement. Removing the old ID requires a major release.

## Approval states

```text
draft → approved → deprecated
```

- `draft`: available for review but not a stable production contract.
- `approved`: visually reviewed and safe for supported use.
- `deprecated`: retained for compatibility but no longer recommended.

Deprecation is preferred over immediate removal. The replacement and migration guidance must be clear before the old asset is removed.

## Changelog and versioning

Add notable consumer-facing changes under `Unreleased` in [`CHANGELOG.md`](CHANGELOG.md).

Use semantic versioning:

- **Patch:** metadata corrections, documentation or build fixes with no identity, meaning or material artwork change.
- **Minor:** new approved assets, material non-breaking redraws and deprecations that keep old IDs available.
- **Major:** removed or renamed approved IDs, family changes, or changes to an asset's meaning.

Version bumps and release tags are handled in a dedicated release pull request rather than in every asset contribution.

## Pull requests

Link the originating asset request and use the repository pull-request template. Keep each implementation focused. A good icon PR includes:

- the selected change type
- affected canonical IDs
- the user or product need
- source and metadata changes together
- compatibility impact
- actual-size visual evidence for artwork changes
- local validation results
- a clear approval request: keep draft, approve, deprecate or remove

Reviewers should be able to understand the meaning, artwork decision and consumer impact without reconstructing them from the file diff.
