import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const exampleRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(exampleRoot, '../..');
const sourceRoot = path.join(exampleRoot, 'src');
const outputRoot = path.join(exampleRoot, 'dist');
const assetOutput = path.join(outputRoot, 'assets');
const selectionPath = path.join(exampleRoot, 'selection.json');
const bundleScript = path.join(repositoryRoot, 'packages/iconography/scripts/build-bundle-with-styles.mjs');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(command, argumentsList) {
  const result = spawnSync(command, argumentsList, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${argumentsList.join(' ')} failed with status ${result.status}.`);
  }
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

run(npmCommand, ['run', 'build:iconography']);
run(process.execPath, [bundleScript, '--out', assetOutput, '--selection', selectionPath]);

await cp(path.join(sourceRoot, 'index.html'), path.join(outputRoot, 'index.html'));
await cp(path.join(sourceRoot, 'app.css'), path.join(outputRoot, 'app.css'));

console.log(`Built vanilla consumer example in ${outputRoot}.`);
