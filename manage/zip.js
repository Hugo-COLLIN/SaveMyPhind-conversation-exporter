const fs = require('fs');
const AdmZip = require('adm-zip');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Read manifest.json
const manifestJson = JSON.parse(fs.readFileSync('./src/manifest.json', 'utf8'));

// Determine the browser version
let browserVersion = '';
if (manifestJson.background && manifestJson.background.service_worker) {
  browserVersion = 'chrome';
} else if (manifestJson.background && manifestJson.background.scripts) {
  console.log(manifestJson.background.scripts)
  browserVersion = 'firefox';
}

// Get the package version
const version = packageJson.version;

// Create the archive name
const archiveName = `save-my-phind_${version}_${browserVersion}.zip`;

// Create a new zip object
const zip = new AdmZip();

// Add the directory to the zip
zip.addLocalFolder('dist');

// Write the zip file
zip.writeZip("releases/" + archiveName);

console.log(`Created ${archiveName} successfully`);