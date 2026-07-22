import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageDist = path.join(root, 'packages/iconography/dist');
const catalogueRoot = path.join(root, 'catalogue');
const catalogueAssets = path.join(catalogueRoot, 'assets/generated');
const catalogueData = path.join(catalogueRoot, '_data/generated');
const bootstrapOutput = path.join(catalogueAssets, 'vendor/bootstrap');
const generatedPageRoots = [
  path.join(catalogueRoot, 'ui-icons'),
  path.join(catalogueRoot, 'icons')
];

const bootstrapAssets = [
  {
    filename: 'bootstrap.min.css',
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css',
    sha384: 'sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB'
  },
  {
    filename: 'bootstrap.bundle.min.js',
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js',
    sha384: 'FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI'
  }
];

async function downloadVerifiedAsset(asset) {
  const response = await fetch(asset.url);
  if (!response.ok) throw new Error(`Unable to download ${asset.filename}: HTTP ${response.status}`);

  const content = Buffer.from(await response.arrayBuffer());
  const digest = createHash('sha384').update(content).digest('base64');
  if (digest !== asset.sha384) {
    throw new Error(`Integrity check failed for ${asset.filename}. Expected ${asset.sha384}; received ${digest}.`);
  }

  await writeFile(path.join(bootstrapOutput, asset.filename), content);
}

for (const generatedPath of [catalogueAssets, catalogueData, ...generatedPageRoots]) {
  await rm(generatedPath, { recursive: true, force: true });
}
await mkdir(catalogueAssets, { recursive: true });
await mkdir(catalogueData, { recursive: true });
await mkdir(bootstrapOutput, { recursive: true });

await Promise.all(bootstrapAssets.map(downloadVerifiedAsset));
await cp(path.join(catalogueRoot, '_vendor/bootstrap/LICENSE'), path.join(bootstrapOutput, 'LICENSE'));

await cp(path.join(packageDist, 'svg'), path.join(catalogueAssets, 'svg'), { recursive: true });
await cp(path.join(packageDist, 'sprites'), path.join(catalogueAssets, 'sprites'), { recursive: true });
await cp(path.join(packageDist, 'styles'), path.join(catalogueAssets, 'styles'), { recursive: true });
await cp(path.join(packageDist, 'licenses'), path.join(catalogueAssets, 'licenses'), { recursive: true });

const packageManifest = JSON.parse(await readFile(path.join(packageDist, 'manifest/assets.json'), 'utf8'));
const catalogueAssetsData = packageManifest.assets.map((asset) => {
  const familyPath = asset.family === 'ui-icon' ? 'ui-icons' : 'icons';
  return {
    ...asset,
    svgPath: `/assets/generated/${asset.svgPath}`,
    spritePath: `/assets/generated/${asset.spritePath}`,
    detailPath: `/${familyPath}/${asset.name}/`
  };
});
const catalogueManifest = { ...packageManifest, assets: catalogueAssetsData };

const data = `${JSON.stringify(catalogueManifest, null, 2)}\n`;
await writeFile(path.join(catalogueData, 'assets.json'), data);
await mkdir(path.join(catalogueAssets, 'manifest'), { recursive: true });
await writeFile(path.join(catalogueAssets, 'manifest/assets.json'), data);

for (const asset of catalogueAssetsData) {
  const familyPath = asset.family === 'ui-icon' ? 'ui-icons' : 'icons';
  const pageDirectory = path.join(catalogueRoot, familyPath, asset.name);
  await mkdir(pageDirectory, { recursive: true });
  const page = [
    '---',
    'layout: asset',
    `title: ${JSON.stringify(asset.label)}`,
    `asset_id: ${JSON.stringify(asset.id)}`,
    `permalink: /${familyPath}/${asset.name}/`,
    '---',
    ''
  ].join('\n');
  await writeFile(path.join(pageDirectory, 'index.html'), page);
}

console.log(`Prepared ${catalogueManifest.assets.length} catalogue assets, Bootstrap 5.3.8, helper styles and detail pages from @est/iconography.`);
