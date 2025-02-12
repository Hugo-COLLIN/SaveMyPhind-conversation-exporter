const pug = require('pug');
const fs = require('fs');
const path = require('path');

const pugPlugin = {
  name: 'pug-transform',
  setup(build) {
    // Detect Pug templates in template literals
    const pugTemplateRegex = /pug`([^`]*)`/g;

    build.onLoad({ filter: /\.(ts|js)$/ }, async (args) => {
      let contents = await fs.promises.readFile(args.path, 'utf8');

      // Check if the file contains Pug templates
      if (pugTemplateRegex.test(contents)) {
        // Reset the regex after test
        pugTemplateRegex.lastIndex = 0;

        // Transform all pug templates to HTML
        contents = contents.replace(pugTemplateRegex, (match, pugCode) => {
          try {
            // Manage interpolations ${...} in the template
            const interpolationPlaceholders = [];
            let index = 0;

            // Temporarily replace interpolations with placeholders
            pugCode = pugCode.replace(/\${([^}]*)}/g, (_, expr) => {
              const placeholder = `___PLACEHOLDER_${index}___`;
              interpolationPlaceholders.push(expr);
              index++;
              return placeholder;
            });

            // Compile the Pug template into HTML
            let html = pug.compile(pugCode, {
              pretty: true,
              filename: args.path,
              basedir: path.dirname(args.path)
            })();

            // Restore interpolations
            interpolationPlaceholders.forEach((expr, i) => {
              html = html.replace(
                `___PLACEHOLDER_${i}___`,
                '${' + expr + '}'
              );
            });

            // Return the literal template with the compiled HTML
            return 'html`' + html.replace(/`/g, '\\`') + '`';
          } catch (error) {
            console.error('Error compiling Pug template:', error);
            return match; // In case of error, keep the original template
          }
        });

        return {
          contents,
          loader: path.extname(args.path).slice(1)
        };
      }
    });
  }
};

module.exports = pugPlugin;
