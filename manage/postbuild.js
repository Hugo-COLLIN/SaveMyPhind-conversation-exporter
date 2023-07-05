const fs = require('fs');
const path = require('path');

// 1. Replace main.js path in background.js
const backgroundPath = path.join(__dirname, '../dist/background.js');
let background = fs.readFileSync(backgroundPath, 'utf8');

background = background.replace('js/main.js', 'main.js');
// background = background.replace('js/libs/turndown.min.js', 'libs/turndown.min.js');
// background = background.replace('js/libs/purify.min.js', 'libs/purify.min.js');

fs.writeFileSync(backgroundPath, background);