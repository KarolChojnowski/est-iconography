import { rm } from 'node:fs/promises';

for (const path of ['assets/generated', '_data/generated']) {
  await rm(path, { recursive: true, force: true });
}
