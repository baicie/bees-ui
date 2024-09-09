import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import allIconDefs from '@ant-design/icons-svg';
import type { IconDefinition } from '@ant-design/icons-svg/es/types';
import { template } from 'lodash';

const writeFile = promisify(fs.writeFile);

interface IconDefinitionWithIdentifier extends IconDefinition {
  svgIdentifier: string;
}

function walk<T>(fn: (iconDef: IconDefinitionWithIdentifier) => Promise<T>) {
  return Promise.all(
    // 便利所有svg文件 svgIdentifier为唯一标识大驼峰命名
    Object.keys(allIconDefs).map((svgIdentifier) => {
      const iconDef = (allIconDefs as Record<string, IconDefinition>)[svgIdentifier];
      // 为每一个svg文件生成组件
      return fn({ svgIdentifier, ...iconDef });
    }),
  );
}
// 生成icon组件文件
async function generateIcons() {
  const iconsDir = path.join(__dirname, '../src/icons');
  try {
    // 查看文件是否可以访问 第一次见
    await promisify(fs.access)(iconsDir);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // 文件不存在就在创建一个
    await promisify(fs.mkdir)(iconsDir);
  }
  // lodash template
  const render = template(
    `
// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY
// 引入svg文件
import <%= svgIdentifier %>Svg from '@ant-design/icons-svg/lib/asn/<%= svgIdentifier %>';
// 引入组件
import AntdIcon, { type AntdIconProps } from '../components/AntdIcon';
// 最终产物组件 传入ref 与 icon
const <%= svgIdentifier %> = (
  props: AntdIconProps,
) => <AntdIcon {...props} ref={props.ref} icon={<%= svgIdentifier %>Svg} />;

if (process.env.NODE_ENV !== 'production') {
  <%= svgIdentifier %>.displayName = '<%= svgIdentifier %>';
}
export default <%= svgIdentifier %>;
`.trim(),
  );
  // 生成组件的函数 传入回调函数  会为所有的svg生成各自的组件
  await walk(async ({ svgIdentifier }) => {
    // generate icon file
    await writeFile(
      path.resolve(__dirname, `../src/icons/${svgIdentifier}.tsx`),
      render({ svgIdentifier }),
    );
  });

  // generate icon index
  const entryText = Object.keys(allIconDefs)
    .sort()
    .map((svgIdentifier) => `export { default as ${svgIdentifier} } from './${svgIdentifier}';`)
    .join('\n');

  await promisify(fs.appendFile)(
    path.resolve(__dirname, '../src/icons/index.tsx'),
    `
// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY

${entryText}
    `.trim(),
  );
}
// 生成入口文件
async function generateEntries() {
  const render = template(
    `
'use strict';
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _<%= svgIdentifier %> = _interopRequireDefault(require('./lib/icons/<%= svgIdentifier %>'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

const _default = _<%= svgIdentifier %>;
exports.default = _default;
module.exports = _default;
`.trim(),
  );

  await walk(async ({ svgIdentifier }) => {
    // generate `Icon.js` in root folder
    await writeFile(
      path.resolve(__dirname, `../${svgIdentifier}.js`),
      render({
        svgIdentifier,
      }),
    );

    // generate `Icon.d.ts` in root folder
    await writeFile(
      path.resolve(__dirname, `../${svgIdentifier}.d.ts`),
      `export { default } from './lib/icons/${svgIdentifier}';`,
    );
  });
}

if (process.argv[2] === '--target=icon') {
  generateIcons();
}

if (process.argv[2] === '--target=entry') {
  generateEntries();
}
