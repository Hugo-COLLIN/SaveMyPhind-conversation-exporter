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
      break;
    case 'firefox':
      if(manifest.background && manifest.background.service_worker) {
        convertedManifest.background = {
          tasks: [manifest.background.service_worker]
        };
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
