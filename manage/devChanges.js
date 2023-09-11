const fs = require('fs-extra');
const path = require('path');

const infosPath = path.join(__dirname, '../dist/infos.json');
const infos = JSON.parse(fs.readFileSync(infosPath, 'utf8'));
infos.APP_MODE = 'dev';
fs.writeFileSync(infosPath, JSON.stringify(infos, null, 2));