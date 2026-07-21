import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArguments(argumentsList) {
  let version;
  let output;

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === '--version') {
      version = argumentsList[index + 1];
      index += 1;
      continue;
    }
    if (argument === '--out') {
      output = argumentsList[index + 1];
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }

  if (!version) throw new Error('Provide --version <x.y.z>.');
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`Invalid semantic version: ${version}`);
  if (!output) throw new Error('Provide --out <file>.');

  return { version, output };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractVersionSection(changelog, version) {
  const heading = new RegExp(`^## \\[${escapeRegExp(version)}\\](?:\\s+—.*)?\\s*$`, 'm');
  const match = heading.exec(changelog);
  if (!match) throw new Error(`CHANGELOG.md does not contain a ${version} release section.`);

  const remainder = changelog.slice(match.index + match[0].length);
  const nextHeadingIndex = remainder.search(/^## \[/m);
  const section = (nextHeadingIndex === -1 ? remainder : remainder.slice(0, nextHeadingIndex)).trim();
  if (!section) throw new Error(`CHANGELOG.md release section ${version} is empty.`);

  return section;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const changelog = await readFile(path.join(repositoryRoot, 'CHANGELOG.md'), 'utf8');
  const section = extractVersionSection(changelog, options.version);
  const destination = path.resolve(process.cwd(), options.output);

  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `# EST Iconography v${options.version}\n\n${section}\n`);
  console.log(`Wrote release notes for v${options.version} to ${destination}.`);
}

try {
  await main();
} catch (error) {
  console.error(`Release notes failed: ${error.message}`);
  process.exitCode = 1;
}
