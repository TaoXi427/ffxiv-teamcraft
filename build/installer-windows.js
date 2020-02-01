const installer = require('electron-installer-windows');
const packager = require('electron-packager');
const packageJson = require('../package.json');


(async () => {
  const appPaths = await packager({
    dir: '.',
    ignore: (path) => {
      const acceptedPathStarts = [
        '/dist/',
        '/node_modules/electron/',
        '/node_modules/path/',
        '/node_modules/electron-config/',
        '/node_modules/electron-is-dev/',
        '/node_modules/electron-log/',
        '/node_modules/fs/',
        '/node_modules/querystring/',
        '/node_modules/url/',
        '/node_modules/child_process/',
        '/node_modules/is-elevated/'
      ];
      return !acceptedPathStarts.some(p => path.startsWith(p));
    },
    out: './out',
    executableName: 'FFXIV Teamcraft',
    overwrite: true,
    asar: true,
    logger: console.log
  });
  console.log(`Electron app bundles created:\n${appPaths.join('\n')}`);
  try {
    await installer({
      src: './out/ffxiv-teamcraft-win32-x64',
      dest: './release',
      exe: 'FFXIV Teamcraft.exe',
      name: 'FFXIV Teamcraft',
      productName: 'FFXIV Teamcraft',
      version: packageJson.version
    });
    console.log('It worked!');
  } catch (e) {
    console.error(e);
  }
})();
