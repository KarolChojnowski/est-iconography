import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(packageRoot, 'dist');
const figmaRoot = path.join(distRoot, 'figma');

async function listFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const item = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(item));
    else files.push(item);
  }
  return files.sort();
}

const packageMetadata = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
const assetManifest = JSON.parse(await readFile(path.join(distRoot, 'manifest/assets.json'), 'utf8'));
const figmaManifest = JSON.parse(await readFile(path.join(figmaRoot, 'manifest.json'), 'utf8'));
const readme = await readFile(path.join(figmaRoot, 'README.md'), 'utf8');

assert.equal(figmaManifest.formatVersion, 1);
assert.equal(figmaManifest.libraryVersion, packageMetadata.version);
assert.equal(figmaManifest.libraryVersion, assetManifest.libraryVersion);
assert.equal(figmaManifest.namingPattern, 'EST / {family} / {label}');
assert.equal(figmaManifest.assets.length, assetManifest.assets.length);

const canonicalIds = figmaManifest.assets.map((asset) => asset.canonicalId);
assert.deepEqual(canonicalIds, assetManifest.assets.map((asset) => asset.id));
assert.equal(new Set(canonicalIds).size, canonicalIds.length);
assert.equal(new Set(figmaManifest.assets.map((asset) => asset.componentName)).size, figmaManifest.assets.length);
assert.equal(new Set(figmaManifest.assets.map((asset) => asset.figmaSvgPath)).size, figmaManifest.assets.length);

const sourceById = new Map(assetManifest.assets.map((asset) => [asset.id, asset]));
const expectedAreas = {
  approved: 'import/approved/',
  draft: 'review/drafts/',
  deprecated: 'archive/deprecated/'
};

for (const mapping of figmaManifest.assets) {
  const source = sourceById.get(mapping.canonicalId);
  assert.ok(source, mapping.canonicalId);

  const familyLabel = source.family === 'ui-icon' ? 'UI icon' : 'Icon';
  const sourceCanvas = source.family === 'ui-icon' ? 16 : 32;

  assert.equal(mapping.componentName, `EST / ${familyLabel} / ${source.label}`);
  assert.equal(mapping.family, source.family);
  assert.equal(mapping.category, source.category);
  assert.equal(mapping.status, source.status);
  assert.equal(mapping.sourceCanvas, sourceCanvas);
  assert.equal(mapping.recommendedDisplaySize, source.defaultSize);
  assert.equal(mapping.sourceSvgPath, source.svgPath);
  assert.ok(mapping.figmaSvgPath.startsWith(expectedAreas[source.status]), mapping.figmaSvgPath);
  assert.match(mapping.description, new RegExp(`Canonical ID: ${source.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  assert.match(mapping.description, /Catalogue: https:\/\/karolchojnowski\.github\.io\/est-iconography\//);

  const sourceSvg = await readFile(path.join(distRoot, mapping.sourceSvgPath), 'utf8');
  const figmaSvg = await readFile(path.join(figmaRoot, mapping.figmaSvgPath), 'utf8');
  assert.equal(figmaSvg, sourceSvg, `${mapping.canonicalId} must remain an exact SVG copy`);
}

const generatedSvgFiles = (await listFiles(figmaRoot))
  .filter((file) => file.endsWith('.svg'))
  .map((file) => path.relative(figmaRoot, file).replaceAll(path.sep, '/'));

assert.deepEqual(generatedSvgFiles, figmaManifest.assets.map((asset) => asset.figmaSvgPath).sort());
assert.match(readme, new RegExp(`Figma handoff — v${packageMetadata.version.replaceAll('.', '\\.')}`));
assert.match(readme, /Publish only approved components/);
assert.match(readme, /EST \/ UI icon \/ House/);

console.log(`Validated Figma handoff for ${figmaManifest.assets.length} assets.`);
