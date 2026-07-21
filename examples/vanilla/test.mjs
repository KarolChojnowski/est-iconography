import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const exampleRoot = path.dirname(fileURLToPath(import.meta.url));
const outputRoot = path.join(exampleRoot, 'dist');

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const html = await readFile(path.join(outputRoot, 'index.html'), 'utf8');
const helperCss = await readFile(path.join(outputRoot, 'assets/styles/est-iconography.css'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(outputRoot, 'assets/manifest/assets.json'), 'utf8'));

assert.deepEqual(
  manifest.assets.map((asset) => asset.id),
  ['ui-icon/check-circle', 'ui-icon/house', 'ui-icon/plus', 'icon/heat-pump']
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
