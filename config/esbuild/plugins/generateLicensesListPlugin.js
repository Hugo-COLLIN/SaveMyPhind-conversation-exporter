const {exec} = require("child_process");
const fs = require('fs');
const path = require('path');

function generateLicensesPlugin() {
  return {
    name: 'generate-licenses',
    setup(build) {
      build.onStart(() => {
        exec('npx license-checker --production --json', (error, stdout) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }

          const licenses = JSON.parse(stdout);
          let formatted = '';
          for (let dep in licenses) {
            formatted += `${dep}\n`;
            let props = Object.keys(licenses[dep]).filter(prop => prop !== 'path' && prop !== 'licenseFile');

            for (let i = 0; i < props.length; i++) {
              let prop = props[i];
              let prefix = (i === props.length - 1) ? '└─' : '├─';
              formatted += `${prefix} ${prop}: ${licenses[dep][prop]}\n`;
            }
            formatted += '\n';
          }

          fs.writeFileSync(path.join('dist/', 'licenses.txt'), formatted);
        });
      });
    }
  };
}

module.exports = {generateLicensesPlugin};
