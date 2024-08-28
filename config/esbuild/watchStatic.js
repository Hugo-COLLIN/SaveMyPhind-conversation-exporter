const chokidar = require("chokidar");

function watchStatic(ctx) {
  const watcher = chokidar.watch('public', {
    ignoreInitial: true, // Ignore initial 'add' events on startup
  });

  let rebuildPending = false;

  watcher.on('all', async (event, path) => {
    if (!rebuildPending) {
      rebuildPending = true;
      console.log(`Detected ${event} on ${path}, scheduling rebuild...`);
      setTimeout(async () => {
        try {
          await ctx.rebuild();
          console.log('Rebuild completed successfully');
        } catch (error) {
          console.error('Rebuild failed:', error);
        } finally {
          rebuildPending = false;
        }
      }, 100); // Debounce delay to batch file changes
    }
  });
}

module.exports = {watchStatic};
