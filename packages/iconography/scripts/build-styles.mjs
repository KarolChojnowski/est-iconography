import { copyFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(packageRoot, 'styles/est-iconography.css');
const outputPath = path.join(packageRoot, 'dist/styles/est-iconography.css');
const validateOnly = process.argv.includes('--validate-only');

const css = await readFile(sourcePath, 'utf8');
const requiredPatterns = [
  [/:where\(\.est-icon\)/, 'the .est-icon base selector'],
  [/--est-icon-size/, 'the --est-icon-size custom property'],
  [/fill:\s*currentColor/i, 'currentColor inheritance'],
  [/:where\(\.est-icon-text\)/, 'the text composition helper'],
  [/:where\(\.est-icon-button\)/, 'the icon-button composition helper']
];

const errors = requiredPatterns
  .filter(([pattern]) => !pattern.test(css))
  .map(([, description]) => `Missing ${description}.`);

if (/@import\b/i.test(css) || /url\s*\(/i.test(css)) {
  errors.push('The helper stylesheet must remain self-contained and must not import external resources.');
}

if (errors.length > 0) {
  console.error(`\nStyle validation failed with ${errors.length} error(s):\n`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

if (validateOnly) {
  console.log('Validated the iconography helper stylesheet.');
  process.exit(0);
}

await mkdir(path.dirname(outputPath), { recursive: true });
await copyFile(sourcePath, outputPath);
console.log('Built styles/est-iconography.css in packages/iconography/dist.');
