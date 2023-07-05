const fs = require('fs-extra');
const path = require('path');

const distPath = path.join(__dirname, '../dist');

// 1. Clean dist folder
fs.removeSync(distPath);
fs.mkdirSync(distPath);

// 2. Copy files
const manifestPath = path.join(__dirname, '../src/manifest.json');
const imgPath = path.join(__dirname, '../src/img');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.background.service_worker = 'background.js';

fs.writeFileSync(path.join(distPath, 'manifest.json'), JSON.stringify(manifest, null, 2));
fs.copySync(imgPath, path.join(distPath, 'img'));