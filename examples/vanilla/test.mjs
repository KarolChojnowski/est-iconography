import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const exampleRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(exampleRoot, '../..');
const packageRoot = path.join(repositoryRoot, 'packages/iconography');
const outputRoot = path.join(exampleRoot, 'dist');

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function symbolIds(sprite) {
  return [...sprite.matchAll(/<symbol\s+id="([^"]+)"/g)].map((match) => match[1]);
}

const packageMetadata = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
const fullManifest = JSON.parse(
  await readFile(path.join(packageRoot, 'dist/manifest/assets.json'), 'utf8')
);
const selection = JSON.parse(await readFile(path.join(exampleRoot, 'selection.json'), 'utf8'));
const html = await readFile(path.join(outputRoot, 'index.html'), 'utf8');
const helperCss = await readFile(path.join(outputRoot, 'assets/styles/est-iconography.css'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(outputRoot, 'assets/manifest/assets.json'), 'utf8'));
const uiSprite = await readFile(path.join(outputRoot, 'assets/sprites/est-ui-icons.svg'), 'utf8');
const iconSprite = await readFile(path.join(outputRoot, 'assets/sprites/est-icons.svg'), 'utf8');

const selectedIdSet = new Set(selection.assetIds);
const expectedAssets = fullManifest.assets.filter((asset) => selectedIdSet.has(asset.id));

assert.equal(selection.libraryVersion, packageMetadata.version);
assert.equal(fullManifest.libraryVersion, packageMetadata.version);
assert.equal(manifest.libraryVersion, packageMetadata.version);
assert.deepEqual(manifest.assets.map((asset) => asset.id), expectedAssets.map((asset) => asset.id));
assert.deepEqual(new Set(manifest.assets.map((asset) => asset.id)), selectedIdSet);

assert.deepEqual(
  symbolIds(uiSprite),
  expectedAssets.filter((asset) => asset.family === 'ui-icon').map((asset) => asset.spriteId)
);
assert.deepEqual(
  symbolIds(iconSprite),
  expectedAssets.filter((asset) => asset.family === 'icon').map((asset) => asset.spriteId)
);

assert.match(helperCss, /:where\(\.est-icon\)/);
assert.match(helperCss, /:where\(\.est-icon-button\)/);
assert.match(html, /href="\.\/assets\/styles\/est-iconography\.css"/);
assert.match(html, /aria-hidden="true" focusable="false"/);
assert.match(html, /role="img" aria-label="Domestic property"/);
assert.match(html, /aria-label="Add property"/);
assert.match(html, /role="status"/);

const references = [...html.matchAll(/<use href="\.\/assets\/([^"#]+)#([^"]+)"/g)];
assert.equal(references.length, 5);

for (const [, spritePath, symbolId] of references) {
  const sprite = await readFile(path.join(outputRoot, 'assets', spritePath), 'utf8');
  assert.match(sprite, new RegExp(`id="${symbolId}"`));
}

for (const asset of manifest.assets) {
  assert.equal(await exists(path.join(outputRoot, 'assets', asset.svgPath)), true, asset.svgPath);
}

console.log('Vanilla consumer example smoke test passed.');
