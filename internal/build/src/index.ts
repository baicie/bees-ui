/* eslint-disable no-console */
import cac from 'cac';

import { watchFuc } from './build';
import { dts } from './dts';
import { compile } from './gulp';

const cli = cac('bee');
cli.command('[root]', 'Build the project').action(() => {
  console.log('hello bee...');
});

cli
  .command('build', 'build mode')
  .option('-w, --watch', 'Production mode')
  .option('-c, --config', 'Production mode')
  .option('-i, --input', 'input path')
  .option('-m, --minify', 'output path')
  .option('-f, --full', 'output path')
  .option('-s, --sourcemap', 'output path')
  .option('-d, --dts', 'output path')
  .option('-n, --name', 'output path')
  .option('-v, --visualizer', 'output path')
  .option('-r, --root', 'output path')
  .option('--ignore-error', 'ignore ts error')
  .action(async (args) => {
    const root = process.cwd();
    if (args.watch) await watchFuc(root, args);
    // else await build(root, args);
    if (args.dts) {
      if (args.root) {
        await compile(root, args);
      } else {
        await dts(root, args);
      }
    }
  });

cli.help();
cli.parse();

export { rootPath } from './path';
