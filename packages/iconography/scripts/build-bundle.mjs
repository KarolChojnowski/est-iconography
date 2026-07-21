import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(packageRoot, 'dist');
const markerName = '.est-iconography-bundle';

const usage = `Build a portable subset of the generated EST iconography distribution.

Usage:
  node scripts/build-bundle.mjs [--out <directory>] <canonical-id> [...]

Example:
  node scripts/build-bundle.mjs --out ./harp-icons \
    ui-icon/check-circle \
    ui-icon/property-information \
    icon/heat-pump

Options:
  -o, --out <directory>  Output directory. Defaults to ./iconography-bundle.
  -h, --help             Show this help.
`;

function parseArguments(argumentsList) {
  const ids = [];
  let output = 'iconography-bundle';

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];

    if (argument === '--help' || argument === '-h') return { help: true, ids, output };
    if (argument === '--out' || argument === '-o') {
      const value = argumentsList[index + 1];
      if (!value || value.startsWith('-')) throw new Error(`${argument} requires a directory path.`);
      output = value;
      index += 1;
      continue;
    }
    if (argument.startsWith('-')) throw new Error(`Unknown option: ${argument}`);
    ids.push(argument);
  }

  return { help: false, ids, output };
}

function svgAttributes(svg) {
  const openingTag = svg.match(/<svg\b([^>]*)>/i)?.[1] ?? '';
  const attribute = (name) => openingTag.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'))?.[1];
  return {
    viewBox: attribute('viewBox'),
    fill: attribute('fill'),
    stroke: attribute('stroke'),
    strokeWidth: attribute('stroke-width'),
    strokeLinecap: attribute('stroke-linecap'),
    strokeLinejoin: attribute('stroke-linejoin')
  };
}

function innerSvg(svg) {
  return svg.replace(/^.*?<svg\b[^>]*>/is, '').replace(/<\/svg>\s*$/is, '').trim();
}

function symbolPresentationAttributes(svg) {
  const attributes = svgAttributes(svg);
  return [
    ['fill', attributes.fill],
    ['stroke', attributes.stroke],
    ['stroke-width', attributes.strokeWidth],
    ['stroke-linecap', attributes.strokeLinecap],
    ['stroke-linejoin', attributes.strokeLinejoin]
  ]
    .filter(([, value]) => value)
    .map(([name, value]) => `${name}="${value}"`)
    .join(' ');
}

function assertSafeOutputDirectory(outputDirectory) {
  const resolved = path.resolve(process.cwd(), outputDirectory);
  const filesystemRoot = path.parse(resolved).root;
  const repositoryRoot = path.resolve(packageRoot, '../..');
  const forbidden = new Set([filesystemRoot, process.cwd(), repositoryRoot, packageRoot, distRoot]);

  if (forbidden.has(resolved)) {
    throw new Error(`Refusing to use protected directory as bundle output: ${resolved}`);
  }

  const relativePackagePath = path.relative(resolved, packageRoot);
  if (relativePackagePath && !relativePackagePath.startsWith('..') && !path.isAbsolute(relativePackagePath)) {
    throw new Error(`Refusing to use a parent of the iconography package as bundle output: ${resolved}`);
  }

  return resolved;
}

async function prepareOutputDirectory(outputDirectory, libraryVersion) {
  try {
    const entries = await readdir(outputDirectory);
    if (entries.length > 0 && !entries.includes(markerName)) {
      throw new Error(`Refusing to overwrite non-bundle directory: ${outputDirectory}`);
    }
    await rm(outputDirectory, { recursive: true, force: true });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, markerName), `EST iconography bundle ${libraryVersion}\n`);
}

async function readManifest() {
  const manifestPath = path.join(distRoot, 'manifest/assets.json');
  try {
    return JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Generated assets were not found. Run the iconography build before creating a bundle.');
    }
    throw error;
  }
}

async function writeSprite(outputDirectory, spritePath, assets) {
  const symbols = [];

  for (const asset of assets) {
    const svg = await readFile(path.join(distRoot, asset.svgPath), 'utf8');
    const presentation = symbolPresentationAttributes(svg);
    const presentationSuffix = presentation ? ` ${presentation}` : '';
    symbols.push(`  <symbol id="${asset.spriteId}" viewBox="${asset.viewBox}"${presentationSuffix}>\n    ${innerSvg(svg).replaceAll('\n', '\n    ')}\n  </symbol>`);
  }

  const sprite = `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols.join('\n')}\n</svg>\n`;
  const destination = path.join(outputDirectory, spritePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, sprite);
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log(usage);
    return;
  }
  if (options.ids.length === 0) throw new Error('Provide at least one canonical asset ID. Use --help for an example.');

  const duplicateIds = options.ids.filter((id, index, all) => all.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    throw new Error(`Duplicate canonical ID${duplicateIds.length > 1 ? 's' : ''}: ${[...new Set(duplicateIds)].join(', ')}`);
  }

  const manifest = await readManifest();
  const availableAssets = new Map(manifest.assets.map((asset) => [asset.id, asset]));
  const unknownIds = options.ids.filter((id) => !availableAssets.has(id));
  if (unknownIds.length > 0) {
    throw new Error(`Unknown canonical ID${unknownIds.length > 1 ? 's' : ''}: ${unknownIds.join(', ')}`);
  }

  const requestedIds = new Set(options.ids);
  const selectedAssets = manifest.assets.filter((asset) => requestedIds.has(asset.id));
  const outputDirectory = assertSafeOutputDirectory(options.output);
  await prepareOutputDirectory(outputDirectory, manifest.libraryVersion);

  for (const asset of selectedAssets) {
    const source = path.join(distRoot, asset.svgPath);
    const destination = path.join(outputDirectory, asset.svgPath);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }

  const spritePaths = [...new Set(selectedAssets.map((asset) => asset.spritePath))];
  for (const spritePath of spritePaths) {
    await writeSprite(
      outputDirectory,
      spritePath,
      selectedAssets.filter((asset) => asset.spritePath === spritePath)
    );
  }

  const manifestOutput = path.join(outputDirectory, 'manifest/assets.json');
  await mkdir(path.dirname(manifestOutput), { recursive: true });
  await writeFile(manifestOutput, `${JSON.stringify({ libraryVersion: manifest.libraryVersion, assets: selectedAssets }, null, 2)}\n`);

  const licenceOutput = path.join(outputDirectory, 'licenses');
  await mkdir(licenceOutput, { recursive: true });
  await copyFile(path.join(packageRoot, 'LICENSE-NOTICE.md'), path.join(licenceOutput, 'EST-ASSET-NOTICE.md'));
  if (selectedAssets.some((asset) => asset.source === 'bootstrap')) {
    await copyFile(
      path.join(distRoot, 'licenses/bootstrap-icons-MIT.txt'),
      path.join(licenceOutput, 'bootstrap-icons-MIT.txt')
    );
  }

  console.log(`Built bundle with ${selectedAssets.length} asset${selectedAssets.length === 1 ? '' : 's'} in ${outputDirectory}.`);
}

try {
  await main();
} catch (error) {
  console.error(`Bundle build failed: ${error.message}`);
  process.exitCode = 1;
}
