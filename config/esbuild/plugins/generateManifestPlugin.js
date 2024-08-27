const path = require('path');
const {readJsonFile, writeJsonFile} = require("../../utils/jsonUtils");

function generateManifestPlugin(targetBrowser) {
  return {
    name: 'generate-manifest',
    setup(build) {
      build.onEnd(() => {
        const srcManifestPath = path.join(process.cwd(), 'src', 'manifest.json');
        const distManifestPath = path.join(process.cwd(), 'dist', 'manifest.json');
        const pkgPath = path.join(process.cwd(), 'package.json');

        const srcManifest = readJsonFile(srcManifestPath);
        const pkg = readJsonFile(pkgPath);

        let manifest = {
          manifest_version: srcManifest[`{{${targetBrowser}}}.manifest_version`] || 3,
          name: srcManifest['name'] || pkg.name,
          version: srcManifest['version'] || pkg.version,
          description: srcManifest['description'] || pkg.description,
        };

        // Function to recursively process each property
        function processObject(obj, targetObj) {
          for (const key in obj) {
            const isBrowserSpecificKey = key.startsWith(`{{${targetBrowser}}}`);
            const cleanKey = key.replace(`{{${targetBrowser}}}.`, '');

            let manifestKey;
            if (isBrowserSpecificKey) {
              manifestKey = cleanKey;
            } else if (!key.startsWith('{{')) {
              manifestKey = key;
            } else {
              continue;
            }

            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
              targetObj[manifestKey] = {};
              processObject(obj[key], targetObj[manifestKey]);
            } else {
              targetObj[manifestKey] = obj[key];
            }
          }
        }

        processObject(srcManifest, manifest);

        writeJsonFile(distManifestPath, manifest);
      });
    }
  };
}

module.exports = {generateManifestPlugin};
