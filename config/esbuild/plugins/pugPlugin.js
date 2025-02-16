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

            // Store special attributes (starting with . or ?)
            const specialAttributes = [];
            let specialAttrIndex = 0;

            // Replace special attributes with placeholders before Pug compilation
            pugCode = pugCode.replace(/([.?])([a-zA-Z][a-zA-Z0-9]*)\s*=\s*([^\s,)]+)/g, (match, prefix, attr, value) => {
              const placeholder = `___SPECIAL_ATTR_${specialAttrIndex}___`;
              specialAttributes.push({
                prefix,
                attr,
                value,
                placeholder
              });
              specialAttrIndex++;
              return placeholder;
            });

            // Handle regular interpolations
            const interpolationPlaceholders = [];
            let index = 0;

            // Temporarily replace interpolations with placeholders
            pugCode = pugCode.replace(/\${([^}]*)}/g, (_, expr) => {
              const placeholder = `___PLACEHOLDER_${index}___`;
              interpolationPlaceholders.push(expr);
              index++;
              return placeholder;
            });

            // Compile Pug to HTML
            let html = pug.compile(pugCode, {
              pretty: true,
              filename: args.path,
              basedir: path.dirname(args.path)
            })();

            // Restore special attributes with correct ordering
            specialAttributes.forEach(({ prefix, attr, value, placeholder }) => {
              const attributeStr = `${prefix}${attr}=${value}`;

              // If this is a special attribute, ensure it appears first in its element
              html = html.replace(new RegExp(`(\\s*${placeholder}[^>]*)([^>]*>)`), (match, before, after) => {
                // Remove the placeholder
                before = before.replace(placeholder, '').trim();
                // Add the special attribute at the start of the attributes
                return ` ${attributeStr} ${before}${after}`;
              });
            });

            // Restore regular interpolations
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
