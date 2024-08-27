const fs = require('fs');
const AdmZip = require("adm-zip");

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Read manifest.json
const manifestJson = JSON.parse(fs.readFileSync('./dist/manifest.json', 'utf8'));

// Determine the browser version
let browserVersion = '';
if (manifestJson.background && manifestJson.background.service_worker) {
  browserVersion = 'chrome';
} else if (manifestJson.background && manifestJson.background.scripts) {
  browserVersion = 'firefox';
}

// Get the package version
const version = packageJson.version;
const name = packageJson.name;

// Create the archive name
const archiveName = `${name}_${version}_${browserVersion}.zip`;

// Create a new zip object
const zip = new AdmZip();

// Add the directory to the zip
zip.addLocalFolder('dist');

// Write the zip file
if (!fs.existsSync('releases'))
  fs.mkdirSync('releases');

zip.writeZip("releases/" + archiveName);

console.log(`Created ${archiveName} successfully`);
