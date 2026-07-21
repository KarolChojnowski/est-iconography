import { rm } from 'node:fs/promises';

for (const path of [
  new URL('../catalogue/assets/generated', import.meta.url),
  new URL('../catalogue/_data/generated', import.meta.url),
  new URL('../catalogue/ui-icons', import.meta.url),
  new URL('../catalogue/icons', import.meta.url),
  new URL('../_site', import.meta.url)
]) {
  await rm(path, { recursive: true, force: true });
}
