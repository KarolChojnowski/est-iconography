import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageDist = path.join(root, 'packages/iconography/dist');
const catalogueAssets = path.join(root, 'catalogue/assets/generated');
const catalogueData = path.join(root, 'catalogue/_data/generated');

await rm(catalogueAssets, { recursive: true, force: true });
await rm(catalogueData, { recursive: true, force: true });
await mkdir(catalogueAssets, { recursive: true });
await mkdir(catalogueData, { recursive: true });

await cp(path.join(packageDist, 'svg'), path.join(catalogueAssets, 'svg'), { recursive: true });
await cp(path.join(packageDist, 'sprites'), path.join(catalogueAssets, 'sprites'), { recursive: true });
await cp(path.join(packageDist, 'licenses'), path.join(catalogueAssets, 'licenses'), { recursive: true });

const packageManifest = JSON.parse(await readFile(path.join(packageDist, 'manifest/assets.json'), 'utf8'));
const catalogueManifest = {
  ...packageManifest,
  assets: packageManifest.assets.map((asset) => ({
    ...asset,
    svgPath: `/assets/generated/${asset.svgPath}`,
    spritePath: `/assets/generated/${asset.spritePath}`
  }))
};

const data = `${JSON.stringify(catalogueManifest, null, 2)}\n`;
await writeFile(path.join(catalogueData, 'assets.json'), data);
await mkdir(path.join(catalogueAssets, 'manifest'), { recursive: true });
await writeFile(path.join(catalogueAssets, 'manifest/assets.json'), data);

console.log(`Prepared ${catalogueManifest.assets.length} catalogue assets from @est/iconography.`);
