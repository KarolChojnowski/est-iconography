## Summary

<!-- What changed, why it is needed, and the intended outcome. -->

## Change type

Select the primary change type:

- [ ] New asset
- [ ] Artwork update
- [ ] Metadata-only change
- [ ] Rename
- [ ] Deprecation or removal
- [ ] Third-party import
- [ ] Tooling, catalogue or documentation
- [ ] Release

## Affected assets

<!-- List canonical IDs, for example `ui-icon/car-front`. Use “None” for tooling-only changes. -->

- 

## Compatibility

- [ ] Canonical IDs remain unchanged, or the breaking change is explained below.
- [ ] The represented meaning and family remain unchanged, or the semantic change is explained below.
- [ ] Existing consumers do not need to change, or migration guidance is provided below.

<!-- Describe compatibility, replacement and migration details where relevant. -->

## Asset checklist

Complete the applicable checks:

- [ ] I searched the catalogue for an existing asset and likely aliases.
- [ ] I checked whether a curated Bootstrap Icon already meets the need.
- [ ] The canonical name uses lowercase kebab-case and aligns with the intended Figma name.
- [ ] Source SVG and canonical metadata were updated together.
- [ ] New EST artwork uses `status: draft` unless this PR contains an explicit approval decision.
- [ ] The root SVG uses the correct `viewBox` and `fill="currentColor"`.
- [ ] The SVG has no visible root stroke, hard-coded colours, live text, classes or unsafe markup.
- [ ] Usage, tags, aliases and any avoid guidance are specific and accurate.
- [ ] Third-party source, version and licence metadata are recorded where applicable.
- [ ] No generated files under `dist/` or generated catalogue directories are committed.
- [ ] A notable consumer-facing change is recorded under `Unreleased` in `CHANGELOG.md`.

## Visual review

<!-- Required for new artwork and artwork updates. Add screenshots or links from the catalogue. -->

- [ ] UI icons were reviewed at 16px and beside interface text.
- [ ] Icons were reviewed at 48px.
- [ ] The asset was checked on light, dark and neutral backgrounds.
- [ ] Optical weight was compared with neighbouring EST and Bootstrap assets.
- [ ] Important counters, gaps and negative spaces remain clear at actual size.

### Evidence

<!-- Add before/after images for artwork updates and actual-size evidence for new assets. -->

## Approval decision

Select the intended outcome for affected assets:

- [ ] Keep as draft
- [ ] Approve
- [ ] Deprecate with replacement guidance
- [ ] Remove in a breaking release
- [ ] Not applicable

## Validation

- [ ] `npm run validate:iconography`
- [ ] `npm run build:iconography`
- [ ] `npm run prepare:catalogue`
- [ ] Catalogue reviewed locally where relevant

## Additional notes

<!-- Record design decisions, known limitations, follow-up work or release implications. -->