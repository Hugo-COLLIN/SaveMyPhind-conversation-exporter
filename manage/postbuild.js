const fs = require('fs');
const path = require('path');

// const esbuild = require('esbuild');
// const glob = require('glob');

// 1. Replace main.js path in background.js
const backgroundPath = path.join(__dirname, '../dist/background.js');
let background = fs.readFileSync(backgroundPath, 'utf8');

background = background.replace('js/main.js', 'main.js');
background = background.replace('js/libs/turndown.min.js', 'libs/turndown.min.js');
background = background.replace('js/libs/purify.min.js', 'libs/purify.min.js');

fs.writeFileSync(backgroundPath, background);


// // 2. Copy and minify all js libs
// glob.glob('js/libs/*.js', {}, (err, files) => {
//   if (err) {
//     console.error(err);
//     process.exit(1);
//   }
//
//   esbuild.build({
//     entryPoints: files,
//     outdir: 'dist',
//     bundle: true,
//     minify: true,
//   }).catch(() => process.exit(1));
// });
