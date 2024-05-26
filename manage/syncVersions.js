const fs = require('fs');

function syncVersion() {
  // Read manifest.json, package.json and infos.json
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const manifest = JSON.parse(fs.readFileSync('./src/manifest.json', 'utf8'));
  const infosJson = JSON.parse(fs.readFileSync('./src/infos.json', 'utf8'));

  // Get and update the version value
  const version = packageJson.version;
  manifest.version = version;
  infosJson.APP_VERSION = version;

  // Write back to manifest.json and infos.json
  fs.writeFileSync('./src/manifest.json', JSON.stringify(manifest, null, 2));
  fs.writeFileSync('./src/infos.json', JSON.stringify(infosJson, null, 2));
}

syncVersion();
