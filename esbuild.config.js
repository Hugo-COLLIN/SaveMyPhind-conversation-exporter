const esbuild = require('esbuild');
const {generateManifestPlugin} = require("./config/esbuild/plugins/generateManifestPlugin");
const {cleanDirectoryPlugin} = require("./config/esbuild/plugins/cleanDirectoryPlugin");
const {watchStatic} = require("./config/esbuild/watchStatic");
const pugPlugin = require('./config/esbuild/plugins/pugPlugin');
const {copy} = require('esbuild-plugin-copy');

const outdir = 'dist';
const targetBrowser = process.env.TARGET || 'chrome';
const appMode = process.env.APP_MODE || 'dev';
const appVersion = require('./package.json').version.toString();
const watchMode = process.env.WATCH_MODE || false; // Flag for watch mode
const staticAssetsConfig = [
  {
    from: 'public/**/*',
    to: './',
  },
  {
    from: ['./LICENSE'],
    to: ['./'],
  }
];

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
    '.html': 'copy'
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
    copy({
      assets: staticAssetsConfig,
      watch: true,
    }),
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
}


