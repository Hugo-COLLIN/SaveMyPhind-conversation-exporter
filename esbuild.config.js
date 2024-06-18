const esbuild = require('esbuild');
const { execSync } = require('child_process');

// Exécuter le script d'initialisation
execSync('node manage/initBuild.js', { stdio: 'inherit' });

// Configuration de build pour background.js
esbuild.build({
  entryPoints: ['src/scripts/background/background.js'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  platform: 'browser',
}).catch(() => process.exit(1));

// Configuration de build pour tab.js
esbuild.build({
  entryPoints: ['src/scripts/content/tab.js'],
  bundle: true,
  outdir: 'dist',
  platform: 'browser',
  // loader: { '.json': 'copy' },
  external: ['src/scripts/content/extractor/*'],
}).catch(() => process.exit(1));
