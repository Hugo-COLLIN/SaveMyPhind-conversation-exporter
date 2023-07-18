const fs = require('fs');

// Get the target browser from the command line arguments
const targetBrowser = process.argv[2];

// Read the manifest from a file
const manifest = JSON.parse(fs.readFileSync('./src/manifest.json', 'utf8'));

function convertManifest(manifest) {
  const convertedManifest = { ...manifest };

  switch(targetBrowser) {
    case 'chrome':
      if(manifest.background && manifest.background.scripts) {
        convertedManifest.background = {
          service_worker: manifest.background.scripts[0]
        };
      }
      if (manifest.browser_specific_settings) {
        delete convertedManifest.browser_specific_settings;
      }
      break;
    case 'firefox':
      if (manifest.background && manifest.background.service_worker) {
        convertedManifest.background = {
          scripts: [manifest.background.service_worker]
        };
      }
      // Add the id and the strict_min_version to the manifest
      const infosJson = JSON.parse(fs.readFileSync('./src/infos.json', 'utf8'));
      convertedManifest.browser_specific_settings = {
        gecko: {
          id: infosJson.APP_ID,
          strict_min_version: "109.0"
        }
      }
      break;
    default:
      throw new Error('Browser not supported');
  }

  return convertedManifest;
}

// Use the function to convert the manifest
const convertedManifest = convertManifest(manifest);

// Write the converted manifest
fs.writeFileSync('./src/manifest.json', JSON.stringify(convertedManifest, null, 2));

console.log('Manifest converted and saved successfully.');
