import cac from 'cac';
import { build } from './build';

const cli = cac('bee');

cli.command('[root]', 'Build the project')
  .action(() => {
    console.log('hello bee...')
  })

cli.command('build', 'build mode')
.option('-c, --config', 'Production mode')
.option('-i, --input', 'input path')
.action(async (ars) => {
  const root = process.cwd();
  await build(root,ars);
})

cli.help();

cli.parse();
