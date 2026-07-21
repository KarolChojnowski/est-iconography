import { copyFile, readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import { optimize } from 'svgo';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validateOnly = process.argv.includes('--validate-only');
const families = [
  { id: 'ui-icon', metadata: 'assets/metadata/ui-icons.yml', sourceDir: 'assets/source/ui-icons', outputDir: 'ui-icons', viewBox: '0 0 16 16', sprite: 'est-ui-icons.svg' },
  { id: 'icon', metadata: 'assets/metadata/icons.yml', sourceDir: 'assets/source/icons', outputDir: 'icons', viewBox: '0 0 32 32', sprite: 'est-icons.svg' }
];
const errors = [];

function fail(id, message) { errors.push(`${id}: ${message}`); }

async function listSvgFiles(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const item = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await listSvgFiles(item));
    else if (entry.isFile() && entry.name.endsWith('.svg')) result.push(item);
  }
  return result.sort();
}

function svgAttributes(svg) {
  const open = svg.match(/<svg\b([^>]*)>/i)?.[1] ?? '';
  const attr = (name) => open.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'))?.[1];
  return { viewBox: attr('viewBox'), fill: attr('fill'), stroke: attr('stroke'), strokeWidth: attr('stroke-width') };
}

function unsafeMarkup(svg) {
  const patterns = [/<script\b/i, /<foreignObject\b/i, /<image\b/i, /<text\b/i, /\bon\w+\s*=/i, /(?:href|xlink:href)=["'](?:https?:|data:|\/\/)/i];
  return patterns.find((pattern) => pattern.test(svg));
}

function hardCodedColours(svg) {
  const values = [...svg.matchAll(/(?:fill|stroke)=["']([^"']+)["']/gi)].map((match) => match[1].toLowerCase());
  return values.filter((value) => !['none', 'currentcolor'].includes(value));
}

function innerSvg(svg) {
  return svg.replace(/^.*?<svg\b[^>]*>/is, '').replace(/<\/svg>\s*$/is, '').trim();
}

const schema = JSON.parse(await readFile(path.join(root, 'schema/asset.schema.json'), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validateMetadata = ajv.compile(schema);
const assets = [];

if (!validateOnly) await rm(path.join(root, 'dist'), { recursive: true, force: true });

for (const family of families) {
  const metadata = yaml.load(await readFile(path.join(root, family.metadata), 'utf8')) ?? {};
  const files = await listSvgFiles(path.join(root, family.sourceDir));
  const discoveredIds = new Set();

  for (const absolutePath of files) {
    const relativeToFamily = path.relative(path.join(root, family.sourceDir), absolutePath).replaceAll(path.sep, '/');
    const [source, ...filenameParts] = relativeToFamily.split('/');
    const filename = filenameParts.join('/');
    const name = path.basename(filename, '.svg');
    const id = `${family.id}/${name}`;
    discoveredIds.add(id);
    const item = metadata[id];

    if (!item) {
      fail(id, `Missing metadata entry in ${family.metadata}`);
      continue;
    }
    if (!validateMetadata(item)) {
      for (const error of validateMetadata.errors ?? []) fail(id, `Metadata ${error.instancePath || '(root)'} ${error.message}`);
    }
    if (item.family !== family.id) fail(id, `Metadata family must be ${family.id}`);
    if (item.source !== source) fail(id, `Source folder "${source}" does not match metadata source "${item.source}"`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) fail(id, 'Filename must use lowercase kebab-case');

    const svg = await readFile(absolutePath, 'utf8');
    const attributes = svgAttributes(svg);
    if (attributes.viewBox !== family.viewBox) fail(id, `Expected viewBox "${family.viewBox}"; received "${attributes.viewBox ?? 'missing'}"`);
    if (unsafeMarkup(svg)) fail(id, 'Contains disallowed or unsafe SVG markup');
    const colours = hardCodedColours(svg);
    if (colours.length) fail(id, `Contains hard-coded colour values: ${[...new Set(colours)].join(', ')}`);
    if (source === 'est' && item.construction === 'stroke') {
      if (attributes.stroke?.toLowerCase() !== 'currentcolor') fail(id, 'EST stroke assets must set stroke="currentColor" on the root SVG');
      if (attributes.strokeWidth !== '1') fail(id, 'EST stroke assets must use a 1-unit root stroke');
      if (attributes.fill?.toLowerCase() !== 'none') fail(id, 'EST stroke assets must set fill="none" on the root SVG');
    }
    if (source === 'bootstrap' && (!item.source_name || !item.source_version || !item.license)) {
      fail(id, 'Bootstrap assets require source_name, source_version and license metadata');
    }

    const optimized = optimize(svg, { path: absolutePath, multipass: true, plugins: ['preset-default', 'removeDimensions'] }).data;
    const spriteId = family.id === 'ui-icon' ? `est-ui-icon-${name}` : `est-icon-${name}`;
    const svgPath = `svg/${family.outputDir}/${source}/${name}.svg`;
    assets.push({
      id,
      name,
      label: item.label,
      family: item.family,
      source: item.source,
      category: item.category,
      tags: item.tags,
      aliases: item.aliases ?? [],
      status: item.status,
      construction: item.construction,
      usage: item.usage,
      avoid: item.avoid ?? null,
      note: item.note ?? null,
      sourceName: item.source_name ?? null,
      sourceVersion: item.source_version ?? null,
      license: item.license ?? null,
      viewBox: family.viewBox,
      defaultSize: family.id === 'ui-icon' ? 16 : 48,
      spriteId,
      svgPath,
      spritePath: `sprites/${family.sprite}`,
      optimizedSvg: optimized
    });
  }

  for (const id of Object.keys(metadata)) {
    if (!discoveredIds.has(id)) fail(id, `Metadata exists but no matching source SVG was found in ${family.sourceDir}`);
  }
}

const duplicateIds = assets.map((asset) => asset.id).filter((id, index, all) => all.indexOf(id) !== index);
for (const id of duplicateIds) fail(id, 'Duplicate canonical ID');

if (errors.length) {
  console.error(`\nAsset validation failed with ${errors.length} error(s):\n`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

if (validateOnly) {
  console.log(`Validated ${assets.length} assets.`);
  process.exit(0);
}

for (const asset of assets) {
  const output = path.join(root, 'dist', asset.svgPath);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${asset.optimizedSvg}\n`);
}

for (const family of families) {
  const familyAssets = assets.filter((asset) => asset.family === family.id);
  const symbols = familyAssets.map((asset) => `  <symbol id="${asset.spriteId}" viewBox="${asset.viewBox}">\n    ${innerSvg(asset.optimizedSvg).replaceAll('\n', '\n    ')}\n  </symbol>`).join('\n');
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols}\n</svg>\n`;
  const output = path.join(root, 'dist/sprites', family.sprite);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, sprite);
}

const publicAssets = assets.map(({ optimizedSvg, ...asset }) => asset);
const manifest = { libraryVersion: '0.1.0', assets: publicAssets };
const manifestPath = path.join(root, 'dist/manifest/assets.json');
await mkdir(path.dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const licenceOutput = path.join(root, 'dist/licenses');
await mkdir(licenceOutput, { recursive: true });
await copyFile(path.join(root, 'licenses/bootstrap-icons-MIT.txt'), path.join(licenceOutput, 'bootstrap-icons-MIT.txt'));

console.log(`Built ${assets.length} assets, 2 sprites and 1 manifest in packages/iconography/dist.`);
