// config/esbuild/plugins/pugPlugin.js
const pug = require('pug');
const fs = require('fs');
const path = require('path');

const pugPlugin = {
  name: 'pug-transform',
  setup(build) {
    // Regex pour détecter les templates pug dans les backticks
    const pugTemplateRegex = /pug`([^`]*)`/g;

    build.onLoad({ filter: /\.(ts|js)$/ }, async (args) => {
      let contents = await fs.promises.readFile(args.path, 'utf8');

      // Si le fichier contient des templates pug
      if (pugTemplateRegex.test(contents)) {
        // Reset le regex après le test
        pugTemplateRegex.lastIndex = 0;

        // Transformer tous les templates pug en HTML
        contents = contents.replace(pugTemplateRegex, (match, pugCode) => {
          try {
            // Gérer les interpolations ${...} dans le template
            const interpolationPlaceholders = [];
            let index = 0;

            // Remplacer temporairement les interpolations par des placeholders
            pugCode = pugCode.replace(/\${([^}]*)}/g, (_, expr) => {
              const placeholder = `___PLACEHOLDER_${index}___`;
              interpolationPlaceholders.push(expr);
              index++;
              return placeholder;
            });

            // Compiler le template Pug en HTML
            let html = pug.compile(pugCode, {
              pretty: true,
              filename: args.path,
              basedir: path.dirname(args.path)
            })();

            // Restaurer les interpolations
            interpolationPlaceholders.forEach((expr, i) => {
              html = html.replace(
                `___PLACEHOLDER_${i}___`,
                '${' + expr + '}'
              );
            });

            // Retourner le template littéral avec le HTML compilé
            return 'html`' + html.replace(/`/g, '\\`') + '`';
          } catch (error) {
            console.error('Error compiling Pug template:', error);
            return match; // En cas d'erreur, garder le template original
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
