import cac from 'cac';
import { build } from './build';
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
  .action(async (ars) => {
    const root = process.cwd();
    await build(root, ars);
    await dts(root, ars);
  })

cli.help();
cli.parse();
