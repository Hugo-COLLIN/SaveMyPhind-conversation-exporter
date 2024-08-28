const fs = require('fs');

function cleanDirectoryPlugin(directory) {
  return {
    name: 'clean-directory',
    setup(build) {
      build.onStart(() => {
        fs.rmSync(directory, {recursive: true, force: true});
      });
    },
  };
}

module.exports = {cleanDirectoryPlugin};
