/* eslint-disable no-console */
import cac from 'cac';

import { build, watchFuc } from './build';
import { compile } from './gulp';

const cli = cac('bee');
cli.command('[root]', 'Build the project').action(() => {
  console.log('hello bee...');
});

cli
  .command('build', 'build mode')
  .option('-w, --watch', 'Production mode')
  .option('-c, --config', 'Production mode')
  .option('-i, --input <input>', 'input path')
  .option('-m, --minify', 'output path')
  .option('-f, --full', 'output path')
  .option('-s, --sourcemap', 'output path')
  .option('-d, --dts', 'output path')
  .option('-n, --name', 'output path')
  .option('-v, --visualizer', 'output path')
  .option('--ignore-error', 'ignore ts error')
  .option('-a, --ant', 'output path')
  .action(async (args) => {
    try {
      const root = process.cwd();
      if (args.watch) await watchFuc(root, args);
      else {
        if (args.ant) {
          await build(root, args);
          await compile(args, 'esm');
          await compile(args, 'cjs');
        } else {
          await build(root, args);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

cli.help();
cli.parse();

export { resolveInput } from './utils'
