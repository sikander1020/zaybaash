// scripts/copy-standalone.js
// Required step after `next build` with output: 'standalone'
// Copies public/ and .next/static/ into the standalone output so server.js can serve them.

const { cpSync, existsSync } = require('fs');
const { join } = require('path');

const root = process.cwd();
const standalone = join(root, '.next', 'standalone');

if (!existsSync(standalone)) {
  console.log('ℹ  No .next/standalone directory found — skipping copy (not a standalone build).');
  process.exit(0);
}

try {
  const publicSrc = join(root, 'public');
  const publicDest = join(standalone, 'public');
  if (existsSync(publicSrc)) {
    cpSync(publicSrc, publicDest, { recursive: true });
    console.log('✓  Copied public/ → .next/standalone/public/');
  }
} catch (e) {
  console.warn('⚠  Could not copy public/ into standalone:', e.message);
}

try {
  const staticSrc = join(root, '.next', 'static');
  const staticDest = join(standalone, '.next', 'static');
  if (existsSync(staticSrc)) {
    cpSync(staticSrc, staticDest, { recursive: true });
    console.log('✓  Copied .next/static/ → .next/standalone/.next/static/');
  }
} catch (e) {
  console.warn('⚠  Could not copy .next/static/ into standalone:', e.message);
}

console.log('✓  Standalone setup complete.');
