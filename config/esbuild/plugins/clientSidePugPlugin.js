const clientSidePugPlugin = {
  name: 'client-side-pug',
  setup(build) {
    build.onLoad({ filter: /\.pug$/ }, async (args) => {
      const pugRuntime = require('pug-runtime');
      const compileClient = require('pug').compileClient;
      const fs = require('fs');
      const contents = await fs.promises.readFile(args.path, 'utf8');

      // Compile le template Pug en fonction JavaScript
      let compiledFunction = compileClient(contents, {
        compileDebug: false,
        inlineRuntimeFunctions: false,
        name: `template_${Math.random().toString(36).slice(2)}`,
      });

      // Ajoute le runtime Pug nécessaire
      const runtimeCode = `
        const pug = ${pugRuntime.toString()};
        ${compiledFunction}
      `;

      return {
        contents: runtimeCode,
        loader: 'js',
      };
    });
  },
};

module.exports = { clientSidePugPlugin };
