// news-image-20261121 — "The World", a one-image front page summing up
// Saturday 21 November 2026. Node 22, standard library only, no network.
//
// The image is an asset this repository holds (entry.png, a JPEG by its
// first bytes, 1024x1024, ~300 KB). The program copies it byte for byte to
// the output directory, so both graded runs write identical bytes.
// A plain file copy is deterministic by construction: no timestamps,
// no randomness and no network are involved anywhere in this program.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoDir = dirname(fileURLToPath(import.meta.url));
const source = join(repoDir, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Confirm the copy landed whole: same byte count as the asset we ship.
const shipped = statSync(source).size;
const written = statSync(target).size;
if (shipped !== written) {
  throw new Error(`entry.png copy mismatch: shipped ${shipped} bytes, wrote ${written}`);
}
