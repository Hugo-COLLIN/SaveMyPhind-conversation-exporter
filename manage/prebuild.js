const fs = require('fs-extra');
const path = require('path');

const distPath = path.join(__dirname, '../dist');

// 1. Clean dist folder
fs.removeSync(distPath);
fs.mkdirSync(distPath);

// 2. Copy files
const manifestPath = path.join(__dirname, '../manifest.json');
const imgPath = path.join(__dirname, '../img');
// const purifyPath = path.join(__dirname, '../js/libs/purify.min.js');
// const turndownPath = path.join(__dirname, '../js/libs/turndown.min.js');
const libsPath = path.join(__dirname, '../js/libs');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.background.service_worker = 'background.js';

fs.writeFileSync(path.join(distPath, 'manifest.json'), JSON.stringify(manifest, null, 2));
fs.copySync(imgPath, path.join(distPath, 'img'));
fs.copySync(libsPath, path.join(distPath, 'libs'));