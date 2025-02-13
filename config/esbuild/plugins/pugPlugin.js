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
            // Handle indentation
            const lines = pugCode.split('\n');
            if (lines.length > 1) {
              // Find the common indentation
              const indentMatch = lines[1].match(/^\s+/);
              if (indentMatch) {
                const baseIndent = indentMatch[0];
                // Remove the common indentation from all lines
                pugCode = lines
                  .map((line, index) => {
                    // Skip the first empty line if it exists
                    if (index === 0 && line.trim() === '') return '';
                    // Remove base indentation only if line starts with it
                    if (line.startsWith(baseIndent)) {
                      return line.slice(baseIndent.length);
                    }
                    return line;
                  })
                  .join('\n');
              }
            }

            // Handle interpolations
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

            // Clean up extra whitespace and newlines
            html = html
              .split('\n')
              .map(line => line.trimRight())
              .join('\n')
              .trim();

            return 'html`' + html.replace(/`/g, '\\`') + '`';
          } catch (error) {
            console.error('Error compiling Pug template:', error);
            throw error; // Rethrow the error to stop the build
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
