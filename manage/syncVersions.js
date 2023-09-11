const fs = require('fs');

function syncVersion() {
  // Read manifest.json
  const manifest = JSON.parse(fs.readFileSync('./src/manifest.json', 'utf8'));

  // Get the version value
  const version = manifest.version;

  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

  // Update the version value
  packageJson.version = version;

  // Write back to package.json
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

  // Read infos.json
  const infosJson = JSON.parse(fs.readFileSync('./src/infos.json', 'utf8'));

  // Update the version value
  infosJson.APP_VERSION = version;

  // Write back to package.json
  fs.writeFileSync('./src/infos.json', JSON.stringify(infosJson, null, 2));
}

syncVersion();
