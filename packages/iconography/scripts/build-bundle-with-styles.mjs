import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const coreBuilder = path.join(packageRoot, 'scripts/build-bundle.mjs');
const argumentsList = process.argv.slice(2);

const result = spawnSync(process.execPath, [coreBuilder, ...argumentsList], {
  cwd: process.cwd(),
  encoding: 'utf8'
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

if (result.status !== 0) {
  process.exitCode = result.status ?? 1;
} else if (!argumentsList.includes('--help') && !argumentsList.includes('-h')) {
  let output = 'iconography-bundle';

  for (let index = 0; index < argumentsList.length; index += 1) {
    if (argumentsList[index] === '--out' || argumentsList[index] === '-o') {
      output = argumentsList[index + 1];
      break;
    }
  }

  const outputDirectory = path.resolve(process.cwd(), output);
  const destination = path.join(outputDirectory, 'styles/est-iconography.css');
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(packageRoot, 'dist/styles/est-iconography.css'), destination);
  console.log(`Included styles/est-iconography.css in ${outputDirectory}.`);
}
