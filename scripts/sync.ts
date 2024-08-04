import path from 'node:path';
import { copySync, removeSync } from 'fs-extra';

import { download } from './download';
import { rootPath } from './path';

const swapPath = path.resolve(rootPath, 'swap');
const antd = 'https://github.com/ant-design/ant-design.git';
const formPath = path.resolve(swapPath, 'ant-design', 'components');
const toPath = path.resolve(rootPath, 'components');
async function main() {
  removeSync(swapPath);

  await download(antd, swapPath);

  copySync(formPath, toPath);
}
main().catch(console.error);
// 合并package.json
