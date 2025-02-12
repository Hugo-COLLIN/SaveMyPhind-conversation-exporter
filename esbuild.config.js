const esbuild = require('esbuild');
const {generateManifestPlugin} = require("./config/esbuild/plugins/generateManifestPlugin");
const {copyStaticFilesPlugin} = require("./config/esbuild/plugins/copyStaticFilesPlugin");
const {cleanDirectoryPlugin} = require("./config/esbuild/plugins/cleanDirectoryPlugin");
const {watchStatic} = require("./config/esbuild/watchStatic");
const pugPlugin = require('./config/esbuild/plugins/pugPlugin');

const outdir = 'dist';
const targetBrowser = process.env.TARGET || 'chrome';
const appMode = process.env.APP_MODE || 'dev';
const appVersion = require('./package.json').version.toString();
const watchMode = process.env.WATCH_MODE || false; // Flag for watch mode

const options = {
  entryPoints: ['src/entrypoints/background.ts', "src/entrypoints/tab.ts", 'src/entrypoints/pages.ts', 'src/entrypoints/options.html'],
  bundle: true,
  outdir: outdir,
  minify: false,
  sourcemap: false,
  platform: 'browser',
  target: ['chrome89', 'firefox89'],
  format: 'iife',
  logLevel: 'info',
  loader: {
    '.ts': 'ts',
    '.html': 'copy',
    '.pug': 'text'
  },
  entryNames: '[name]',
  define: {
    'APP_MODE': `"${appMode}"`,
    'APP_TARGET': `"${targetBrowser}"`,
    'APP_VERSION': `"${appVersion}"`,
  },
  plugins: [
    cleanDirectoryPlugin(outdir),
    generateManifestPlugin(targetBrowser),
    copyStaticFilesPlugin(['public', 'LICENSE']),
    pugPlugin,
  ],
};

const job = watchMode ? watch : build;

job().catch((error) => {
  console.error('Build failed:', error);
  console.error('Stack Trace:', error.stack);
  process.exit(1);
});

async function build() {
  await esbuild.build(options);
  console.log('Build completed successfully');
}

async function watch() {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('Watching for file changes...');

  // Watch for changes in the 'public' folder
  watchStatic(ctx);

  // --- No way to list the output files from `watch` mode ---
  // await ctx.rebuild().then(result => {
  //   if (result.errors.length > 0) {
  //     console.error('Build failed with errors:');
  //     console.error(result.errors);
  //   } else {
  //     console.log('Build succeeded:');
  //     // Comme `result.outputFiles` n'est pas disponible, vous pouvez simplement afficher un message ou d'autres informations.
  //     // Pour obtenir les fichiers générés, vous devrez le faire manuellement car `result` ne contient pas directement `outputFiles`.
  //     // Par exemple, vous pouvez afficher les fichiers sortis de `outdir`.
  //     console.log('Output files:');
  //     result.outputFiles?.forEach(file => {
  //       console.log(`  ${file.path}  ${file.contents.length} bytes`);
  //     });
  //   }
  // });
}


