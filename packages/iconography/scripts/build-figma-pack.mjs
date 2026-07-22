import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(packageRoot, 'dist');
const outputRoot = path.join(distRoot, 'figma');
const manifestPath = path.join(distRoot, 'manifest/assets.json');

const familyConfig = {
  'ui-icon': { label: 'UI icon', directory: 'ui-icons', sourceCanvas: 16 },
  icon: { label: 'Icon', directory: 'icons', sourceCanvas: 32 }
};

const statusConfig = {
  approved: { area: 'import/approved', figmaPage: 'Approved' },
  draft: { area: 'review/drafts', figmaPage: 'Review — drafts' },
  deprecated: { area: 'archive/deprecated', figmaPage: 'Archive — deprecated' }
};

function safeFilename(value) {
  const cleaned = value
    .normalize('NFC')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[. ]+$/g, '');

  if (!cleaned) throw new Error(`Cannot create a Figma filename from "${value}".`);
  return cleaned;
}

function sourceDescription(asset) {
  if (asset.source === 'bootstrap') {
    return `Bootstrap Icons ${asset.sourceVersion} (${asset.license})`;
  }
  return 'Energy Saving Trust';
}

function catalogueUrl(asset) {
  const familyPath = asset.family === 'ui-icon' ? 'ui-icons' : 'icons';
  return `https://karolchojnowski.github.io/est-iconography/${familyPath}/${asset.name}/`;
}

let packageManifest;
try {
  packageManifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch (error) {
  throw new Error(`Cannot read ${manifestPath}. Build the iconography assets before the Figma handoff pack.`, { cause: error });
}

if (!packageManifest.libraryVersion || !Array.isArray(packageManifest.assets)) {
  throw new Error('The generated asset manifest is missing libraryVersion or assets.');
}

const componentNames = new Set();
const figmaPaths = new Set();
const mappings = [];

for (const asset of packageManifest.assets) {
  const family = familyConfig[asset.family];
  const status = statusConfig[asset.status];

  if (!family) throw new Error(`${asset.id}: unsupported family "${asset.family}".`);
  if (!status) throw new Error(`${asset.id}: unsupported status "${asset.status}".`);

  const componentName = `EST / ${family.label} / ${asset.label}`;
  const filename = `${safeFilename(componentName.replaceAll(' / ', ' - '))}.svg`;
  const figmaSvgPath = `${status.area}/${family.directory}/${filename}`;

  if (componentNames.has(componentName)) {
    throw new Error(`${asset.id}: duplicate Figma component name "${componentName}".`);
  }
  if (figmaPaths.has(figmaSvgPath)) {
    throw new Error(`${asset.id}: duplicate Figma import path "${figmaSvgPath}".`);
  }

  componentNames.add(componentName);
  figmaPaths.add(figmaSvgPath);

  const descriptionLines = [
    asset.usage,
    asset.avoid ? `Avoid: ${asset.avoid}` : null,
    `Canonical ID: ${asset.id}`,
    `Family: ${family.label}`,
    `Source canvas: ${family.sourceCanvas}×${family.sourceCanvas}`,
    `Recommended display size: ${asset.defaultSize}px`,
    `Source: ${sourceDescription(asset)}`,
    `Catalogue: ${catalogueUrl(asset)}`
  ].filter(Boolean);

  mappings.push({
    canonicalId: asset.id,
    componentName,
    description: descriptionLines.join('\n'),
    family: asset.family,
    familyLabel: family.label,
    category: asset.category,
    status: asset.status,
    source: asset.source,
    sourceVersion: asset.sourceVersion,
    license: asset.license,
    sourceCanvas: family.sourceCanvas,
    recommendedDisplaySize: asset.defaultSize,
    figmaPage: status.figmaPage,
    sourceSvgPath: asset.svgPath,
    figmaSvgPath,
    catalogueUrl: catalogueUrl(asset)
  });
}

await rm(outputRoot, { recursive: true, force: true });

for (const mapping of mappings) {
  const source = path.join(distRoot, mapping.sourceSvgPath);
  const destination = path.join(outputRoot, mapping.figmaSvgPath);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

const figmaManifest = {
  formatVersion: 1,
  libraryVersion: packageManifest.libraryVersion,
  namingPattern: 'EST / {family} / {label}',
  generatedFrom: 'dist/manifest/assets.json',
  areas: {
    approved: 'import/approved',
    draft: 'review/drafts',
    deprecated: 'archive/deprecated'
  },
  assets: mappings
};

await mkdir(outputRoot, { recursive: true });
await writeFile(
  path.join(outputRoot, 'manifest.json'),
  `${JSON.stringify(figmaManifest, null, 2)}\n`
);

const counts = Object.fromEntries(
  Object.keys(statusConfig).map((status) => [
    status,
    mappings.filter((asset) => asset.status === status).length
  ])
);

const readme = `# EST Iconography Figma handoff — v${packageManifest.libraryVersion}

This generated pack maps the authoritative SVG library to stable Figma component names.

## Contents

- \`import/approved/\`: approved assets suitable for the published Figma library (${counts.approved})
- \`review/drafts/\`: draft assets for review, not publication (${counts.draft})
- \`archive/deprecated/\`: deprecated assets retained for migration reference (${counts.deprecated})
- \`manifest.json\`: canonical IDs, component names, descriptions, sizing and source metadata

## Component naming

Use the exact \`componentName\` from \`manifest.json\`:

\`EST / UI icon / House\`

\`EST / Icon / Heat pump\`

The slash-separated name creates a predictable Figma asset hierarchy. Do not use filenames as canonical IDs; keep the \`canonicalId\` in the component description.

## Import workflow

1. Import SVGs from the appropriate status area.
2. Convert each imported SVG to a component without redrawing or flattening it.
3. Rename it using \`componentName\`.
4. Copy the generated \`description\` into the Figma component description.
5. Organise components by family and category using pages or sections.
6. Publish only approved components.

UI icons use a 16×16 source canvas. Icons use a 32×32 source canvas and are normally displayed at 48px. Keep the source canvas intact and scale instances rather than editing vector geometry.

For the full operating model, read \`packages/iconography/docs/figma.md\` in the repository.
`;

await writeFile(path.join(outputRoot, 'README.md'), readme);

console.log(`Built Figma handoff for ${mappings.length} assets in packages/iconography/dist/figma.`);
