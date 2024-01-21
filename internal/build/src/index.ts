import cac from 'cac';
import { build, watch } from './build';
import { dts } from './dts';
const cli = cac('bee');
cli.command('[root]', 'Build the project')
  .action(() => {
    console.log('hello bee...')
  })

cli.command('build', 'build mode')
  .option('-w, --watch', 'Production mode')
  .option('-c, --config', 'Production mode')
  .option('-i, --input', 'input path')
  .option('-m, --minify', 'output path')
  .option('-f, --full', 'output path')
  .option('-s, --sourcemap', 'output path')
  .action(async (args) => {
    const root = process.cwd();
    if (args.watch)
      await watch(root, args);
    else
      await build(root, args)
    await dts(root, args);
  })

cli.help();
cli.parse();
