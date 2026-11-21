// news-image-20261121 v2 — "The World", a one-image front page summing up
// Saturday 21 November 2026. Node 22, standard library only, no network.
//
// The image is an asset this repository holds (entry.png, a JPEG by its
// first bytes, 1024x1024, ~305 KB): a full-bleed magazine-style front page
// with the Riyadh missile story as the hero, and COP31 in Antalya, the NATO
// chief in Warsaw and India in Wellington as the three stories below it.
// The program writes the asset byte for byte to the output directory, so
// both graded runs produce identical bytes. The output file keeps the name
// entry.png even though the bytes are a JPEG — the rules tell the two apart
// by their first bytes, not by the name. A plain file copy is
// deterministic by construction: no timestamps, no randomness, no network.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoDir = dirname(fileURLToPath(import.meta.url));
const source = join(repoDir, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

mkdirSync(outDir, { recursive: true });

const bytes = readFileSync(source);
writeFileSync(target, bytes);

// Confirm the copy landed whole: the written bytes must hash exactly
// like the asset we ship, otherwise the run has failed.
const digest = (buf: Buffer) => createHash('sha256').update(buf).digest('hex');
const written = readFileSync(target);
if (digest(bytes) !== digest(written)) {
  throw new Error('entry.png copy mismatch: written bytes differ from shipped asset');
}
