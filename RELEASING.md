# Releasing EST Iconography

The package is private and is distributed through versioned GitHub releases rather than npm.

## Release principles

- `packages/iconography/package.json` is the version source of truth.
- Every release version must have a matching section in `CHANGELOG.md`.
- A release tag must point to the exact commit intended for that version.
- Tags are immutable. Never move or recreate an existing published tag.
- Release pull requests should contain versioning and release documentation only; asset or feature work should be merged beforehand.

## Standard release

1. Create a release pull request that:
   - moves the accumulated `Unreleased` entries into a dated version section
   - bumps `packages/iconography/package.json`
   - aligns any checked-in selection files with the new package version
   - updates repository status and release documentation
2. Merge the pull request after all package, catalogue and consumer-example checks pass.
3. Tag the resulting merge commit:

```bash
git checkout main
git pull --ff-only
git tag v0.5.0
git push origin v0.5.0
```

4. Confirm that the **Release iconography** workflow succeeds.
5. Check the GitHub release contains:
   - `est-iconography-<version>.zip`
   - `est-ui-icons.svg`
   - `est-icons.svg`
   - `est-iconography.css`
   - `est-iconography-assets.json`
6. Confirm the ZIP contains the complete `svg/`, `sprites/`, `styles/`, `manifest/` and `licenses/` distribution.
7. Confirm the release notes match the corresponding changelog section.

The workflow rejects a tag when its name does not match the package version at that commit. It also fails when the matching changelog section is missing or empty.

## Historical releases

`v0.3.0` was published from its original release commit rather than a later `main` head:

```text
e52a9bc58d1bebbcb0a15dbb0e5ca0a334ff0509
```

`v0.4.0` was then published from the adoption-release merge. Both releases are complete and verified. Do not move or recreate either tag.

When reconstructing an older release, always use the recorded release commit and verify its package version and changelog section before creating a tag. Never tag current `main` with an older version number.

## Failed releases

When a release workflow fails:

- do not move the tag to another commit
- fix the source on a new patch version, or delete an unpublished tag only when no GitHub release or consumer has used it
- inspect whether the package version, changelog section, generated output or release-asset packaging caused the failure

Once a release is visible to consumers, correct it with a new version rather than rewriting history.
