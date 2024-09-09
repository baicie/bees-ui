/* eslint-disable no-console */
import cac from 'cac';

import { build, watchFuc } from './build';
import { dts } from './dts';
import { createTemplate } from './template';
import { DEFAULT } from './ustils';

const cli = cac('bee');
cli.command('[root]', 'Build the project').action(() => {
  console.log('hello bee...');
});

cli
  .command('build', 'build mode')
  .option('-w, --watch', 'Production mode')
  .option('-c, --config', 'Production mode')
  .option('-i, --input <input...>', 'input path', { type: [], default: DEFAULT })
  .option('-m, --minify', 'output path')
  .option('-f, --full', 'output path')
  .option('-s, --sourcemap', 'output path')
  .option('-d, --dts', 'only dts')
  .action(async (args) => {
    const root = process.cwd();
    if (!args.dts) {
      if (args.watch) await watchFuc(root, args);
      else await build(root, args);
    }
    await dts(root, args);
  });

cli
  .command('template [root]', 'template mode')
  .option('-c, --components', 'Production mode', { default: false })
  .action(async (name, args) => {
    createTemplate({ name, components: args.components });
  });

cli.help();
cli.parse();

export { rootPath } from './path';
