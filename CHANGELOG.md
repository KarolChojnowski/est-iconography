# Changelog

All notable changes to the EST iconography library are recorded here.

## [Unreleased]

## [0.4.0] — 2026-07-21

### Added

- A selected-asset bundle command that generates project-specific individual SVGs, filtered family sprites, a filtered manifest and the required licence notices from canonical asset IDs.
- Bundle validation covering mixed families, deterministic filtering, repeat builds, unknown and duplicate IDs, and protected output directories.
- A persistent catalogue selection tray for visually assembling project-specific asset sets, copying canonical IDs and generating ready-to-run bundle commands.
- Downloadable, versioned selection JSON files that can be consumed directly by the bundle builder through `--selection`.
- Canonical accessibility guidance for decorative, informative, interactive and status-message icon contexts.
- Copy-ready accessible implementation examples in the catalogue and on every asset detail page.
- A repeatable release guide covering normal, historical and failed release scenarios.

### Changed

- Release automation now publishes the matching curated changelog section rather than automatically generated GitHub notes.
- Release validation now confirms that the package version has a non-empty changelog section before a release is tagged.

## [0.3.0] — 2026-07-21

### Added

- Contribution guidance covering asset naming, source and metadata changes, actual-size review, approval states, compatibility and semantic versioning.
- A pull-request template for artwork, metadata, rename, deprecation, third-party, tooling and release changes.
- A complete audit of the sixteen legacy Design System icons and their migration, consolidation or replacement decisions.
- Nine EST UI icons for property, building-fabric, household, energy and savings concepts.
- Three curated Bootstrap UI icons replacing generic legacy information, data-visualisation and computer-display artwork.

### Changed

- Approved the nine migrated EST UI icons after catalogue review.
- Normalised legacy implementation-era names into reusable canonical concepts while retaining old names as aliases.
- Consolidated the legacy heating-boiler concept into `ui-icon/condensing-boiler` rather than adding a near-duplicate.
- Completed the legacy collection migration with all 24 library assets approved.

## [0.2.0] — 2026-07-21

### Added

- Generated individual catalogue pages for every asset.
- Actual-size, enlarged, beside-text and configurable visual review previews.
- Inline SVG, sprite implementation and download guidance.
- A tag-driven GitHub release workflow for versioned ZIP, sprite and manifest assets.

### Changed

- Approved all eight EST-authored baseline assets.
- Standardised EST and Bootstrap assets on fill-based SVG construction using `currentColor`.
- Made the package version the source of truth for the generated manifest and catalogue header.
- Recorded the accepted v0.2 construction and review baseline.
- Clarified proprietary EST asset terms and the Bootstrap Icons MIT exception.

### Fixed

- Preserved root SVG presentation attributes when generating sprite symbols.
- Renamed the test car asset from `car` to `car-front` before the approved baseline.

## [0.1.0] — 2026-07-21

### Added

- Initial twelve-asset construction test set.
- Canonical YAML metadata and JSON Schema validation.
- SVG validation, optimisation, individual files, family sprites and manifest generation.
- Jekyll catalogue, GitHub Actions validation and GitHub Pages deployment.
- Separation between the iconography package and catalogue consumer.
