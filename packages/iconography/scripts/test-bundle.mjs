import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundleScript = path.join(packageRoot, 'scripts/build-bundle.mjs');
const packageMetadata = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'est-iconography-bundle-'));

function runBundle(argumentsList) {
  return spawnSync(process.execPath, [bundleScript, ...argumentsList], {
    cwd: packageRoot,
    encoding: 'utf8'
  });
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

try {
  const outputDirectory = path.join(temporaryRoot, 'selected');
  const result = runBundle([
    '--out', outputDirectory,
    'ui-icon/check-circle',
    'ui-icon/house',
    'icon/heat-pump'
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Built bundle with 3 assets/);

  const manifest = JSON.parse(await readFile(path.join(outputDirectory, 'manifest/assets.json'), 'utf8'));
  assert.equal(manifest.libraryVersion, packageMetadata.version);
  assert.deepEqual(
    manifest.assets.map((asset) => asset.id),
    ['ui-icon/check-circle', 'ui-icon/house', 'icon/heat-pump']
  );

  assert.equal(await exists(path.join(outputDirectory, 'svg/ui-icons/bootstrap/check-circle.svg')), true);
  assert.equal(await exists(path.join(outputDirectory, 'svg/ui-icons/est/house.svg')), true);
  assert.equal(await exists(path.join(outputDirectory, 'svg/icons/est/heat-pump.svg')), true);
  assert.equal(await exists(path.join(outputDirectory, 'licenses/EST-ASSET-NOTICE.md')), true);
  assert.equal(await exists(path.join(outputDirectory, 'licenses/bootstrap-icons-MIT.txt')), true);

  const uiSprite = await readFile(path.join(outputDirectory, 'sprites/est-ui-icons.svg'), 'utf8');
  assert.match(uiSprite, /id="est-ui-icon-check-circle"/);
  assert.match(uiSprite, /id="est-ui-icon-house"/);
  assert.doesNotMatch(uiSprite, /id="est-ui-icon-plus"/);

  const iconSprite = await readFile(path.join(outputDirectory, 'sprites/est-icons.svg'), 'utf8');
  assert.match(iconSprite, /id="est-icon-heat-pump"/);
  assert.doesNotMatch(iconSprite, /id="est-icon-kettle"/);

  const rebuild = runBundle(['--out', outputDirectory, 'ui-icon/house']);
  assert.equal(rebuild.status, 0, rebuild.stderr);
  const rebuiltManifest = JSON.parse(await readFile(path.join(outputDirectory, 'manifest/assets.json'), 'utf8'));
  assert.deepEqual(rebuiltManifest.assets.map((asset) => asset.id), ['ui-icon/house']);
  assert.equal(await exists(path.join(outputDirectory, 'svg/icons/est/heat-pump.svg')), false);
  assert.equal(await exists(path.join(outputDirectory, 'sprites/est-icons.svg')), false);
  assert.equal(await exists(path.join(outputDirectory, 'licenses/bootstrap-icons-MIT.txt')), false);

  const unknown = runBundle(['--out', path.join(temporaryRoot, 'unknown'), 'ui-icon/not-real']);
  assert.notEqual(unknown.status, 0);
  assert.match(unknown.stderr, /Unknown canonical ID: ui-icon\/not-real/);

  const duplicate = runBundle([
    '--out', path.join(temporaryRoot, 'duplicate'),
    'ui-icon/house',
    'ui-icon/house'
  ]);
  assert.notEqual(duplicate.status, 0);
  assert.match(duplicate.stderr, /Duplicate canonical ID: ui-icon\/house/);

  const protectedDirectory = path.join(temporaryRoot, 'existing-content');
  await mkdir(protectedDirectory);
  await writeFile(path.join(protectedDirectory, 'keep.txt'), 'Do not delete.\n');
  const protectedResult = runBundle(['--out', protectedDirectory, 'ui-icon/house']);
  assert.notEqual(protectedResult.status, 0);
  assert.match(protectedResult.stderr, /Refusing to overwrite non-bundle directory/);
  assert.equal(await readFile(path.join(protectedDirectory, 'keep.txt'), 'utf8'), 'Do not delete.\n');

  console.log('Selected asset bundle tests passed.');
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
