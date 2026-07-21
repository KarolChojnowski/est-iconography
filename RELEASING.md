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
   - updates repository status documentation
2. Merge the pull request after CI passes.
3. Tag the resulting merge commit:

```bash
git checkout main
git pull --ff-only
git tag v0.4.0
git push origin v0.4.0
```

4. Confirm that the **Release iconography** workflow succeeds.
5. Check the GitHub release contains:
   - `est-iconography-<version>.zip`
   - `est-ui-icons.svg`
   - `est-icons.svg`
   - `est-iconography-assets.json`
6. Confirm the release notes match the corresponding changelog section.

The workflow rejects a tag when its name does not match the package version at that commit. It also fails when the matching changelog section is missing or empty.

## Historical `v0.3.0` release

The `v0.3.0` release pull request was merged before its tag was created. Later adoption features then landed on `main`, so tagging the current branch as `v0.3.0` would publish more than the recorded `0.3.0` release contents.

Create `v0.3.0` from its original release commit instead:

```bash
git fetch origin
git tag v0.3.0 e52a9bc58d1bebbcb0a15dbb0e5ca0a334ff0509
git push origin v0.3.0
```

That commit contains the `0.3.0` package version, changelog entry and approved 24-asset production-migration baseline. Do not tag current `main` as `v0.3.0`.

## Release sequencing

When publishing both outstanding versions:

1. create the historical `v0.3.0` tag at the commit above
2. merge the `v0.4.0` release pull request
3. create `v0.4.0` from the new `main` head

This preserves an accurate relationship between source, changelog and downloadable artifacts for both releases.

## Failed releases

When a release workflow fails:

- do not move the tag to another commit
- fix the source on a new patch version, or delete an unpublished tag only when no GitHub release or consumer has used it
- inspect whether the package version, changelog section or build output caused the failure

Once a release is visible to consumers, correct it with a new version rather than rewriting history.
