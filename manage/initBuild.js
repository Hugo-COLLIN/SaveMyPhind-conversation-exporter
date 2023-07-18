const fs = require('fs-extra');
const path = require('path');

const distPath = path.join(__dirname, '../dist');

// 1. Clean dist folder
fs.removeSync(distPath);
fs.mkdirSync(distPath);

// 2. Copy files
const manifestPath = path.join(__dirname, '../src/manifest.json');
const imgPath = path.join(__dirname, '../src/img');
const logPath = path.join(__dirname, '../CHANGELOG.md');
const licensePath = path.join(__dirname, '../LICENSE.md');
const readmePath = path.join(__dirname, '../README.md');
const licenseListPath = path.join(__dirname, '../licenses.txt');
const infosPath = path.join(__dirname, '../src/infos.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.background.service_worker)
  manifest.background.service_worker = 'background.js';
else if (manifest.background.scripts)
  manifest.background.scripts = ['background.js'];

fs.writeFileSync(path.join(distPath, 'manifest.json'), JSON.stringify(manifest, null, 2));
fs.copySync(imgPath, path.join(distPath, 'img'));
fs.copySync(logPath, path.join(distPath, 'doc/CHANGELOG.md'));
fs.copySync(licensePath, path.join(distPath, 'doc/LICENSE.md'));
fs.copySync(readmePath, path.join(distPath, 'doc/README.md'));
fs.copySync(licenseListPath, path.join(distPath, 'doc/licenses.txt'));
fs.copySync(infosPath, path.join(distPath, 'infos.json'));