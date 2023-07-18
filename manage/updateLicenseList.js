// require('fs').writeFileSync('licenseList.md', "# Libraries licenses\n" + require('fs').readFileSync('licenseList.md', 'utf8').split('\n').slice(3).join('\n'))

const fs = require('fs');

console.log(process.argv)
let licenses = JSON.parse(process.argv[2]);
console.log(licenses)

let formatted = '';
for (let dep in licenses) {
  formatted += `${dep}\n`;
  let props = Object.keys(licenses[dep]);
  for (let i = 0; i < props.length; i++) {
    let prop = props[i];
    if (prop !== 'path' && prop !== 'licenseFile') {
      let prefix = (i === props.length - 1) ? '└─' : '├─';
      formatted += `${prefix} ${prop}: ${licenses[dep][prop]}\n`;
    }
  }
  formatted += '\n';
}

fs.writeFileSync('licenses.txt', formatted);