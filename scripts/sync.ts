import { exec } from 'node:child_process';
import path from 'node:path';
import type { Project } from '@pnpm/find-workspace-packages';
import consola from 'consola';
import { copySync, readJSONSync, removeSync, writeFileSync, writeJSONSync } from 'fs-extra';
import color from 'picocolors';

import { download } from './download';
import { rootPath } from './path';

type Package = Project['manifest'];
interface CopyPath {
  form: string;
  to: string;
  cb?: (from: string, to: string) => void;
}

const swapPath = path.resolve(rootPath, 'swap');
const targetPath = path.resolve(rootPath, 'antd');
const rootPackagePath = path.resolve(rootPath, 'package.json');
const antd = 'https://github.com/ant-design/ant-design.git';
const version = (readJSONSync(rootPackagePath) as Package).version;
const copyPath: CopyPath[] = [
  {
    form: 'package.json',
    to: './antd/package.json',
    cb(from, to) {
      const content: Package = readJSONSync(from);
      content.name = '@bees-ui/ant';
      content.version = version;
      if (!content.scripts) {
        content.scripts = {};
      }
      content.scripts['bees-build'] =
        'cross-env NODE_OPTIONS=--max_old_space_size=4096 bee build --sourcemap --full --root -d';
      // content.scripts['bees-dev'] = 'bee build --sourcemap --full --root -d -w';
      writeJSONSync(to, content, { spaces: 2 });
    },
  },
];
const antRootPath = path.resolve(swapPath, 'ant-design');
const ignore = ['.dumi', 'docs', 'tests', 'scripts', '.git'];
function copy() {
  copySync(antRootPath, targetPath, {
    filter: (src) => {
      if (ignore.includes(path.basename(src))) {
        return false;
      }
      return true;
    },
  });
  for (const { form, to, cb } of copyPath) {
    const _form = path.resolve(antRootPath, form);
    const _to = path.resolve(rootPath, to);
    if (cb) {
      cb(_form, _to);
    } else copySync(_form, _to);
  }
}

function writeVersion() {
  const content = `export default '${version}';`;
  const versionPath = path.resolve(targetPath, 'components', 'version', 'version.ts');
  writeFileSync(versionPath, content, { encoding: 'utf-8' });
}

function installDeps(command: string) {
  const child = exec(command, { cwd: targetPath }, (error) => {
    if (error) {
      consola.error(error);
    }
    consola.log(color.green('install success'));
  });

  // 输出
  child.stdout!.on('data', (data) => {
    consola.log(data.replace(/\n$/, ''));
  });

  // 输出 错误信息
  child.stderr!.on('data', (data) => {
    consola.log(color.red(data));
  });
}

async function main() {
  removeSync(targetPath);
  await download(antd, swapPath);
  copy();
  writeVersion();
  installDeps('pnpm i --ignore-scripts');
}
main().catch(console.error);
