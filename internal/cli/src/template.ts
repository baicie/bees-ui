import fs from 'node:fs';
import path from 'node:path';
import mustache from 'mustache';

import { compsPath, internalPath, pkgsPath } from './path';

export interface TemplateOptions {
  name: string;
  components: boolean;
}

export function createTemplate(options: TemplateOptions) {
  const formPath = path.resolve(internalPath, options.components ? 'coms-template' : 'sc-template');
  const toPath = path.resolve(
    options.components ? compsPath : pkgsPath,
    options.components ? options.name : `sc-${options.name}`,
  );
  const templateData = {
    name: options.name,
  };
  copyAndReplaceTemplate(formPath, toPath, templateData);
}

function copyAndReplaceTemplate(
  srcDir: string,
  destDir: string,
  templateData: Record<string, unknown>,
  ignoreList: string[] = ['node_modules'],
) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir);

  files.forEach((file) => {
    const srcFilePath = path.join(srcDir, file);
    const destFilePath = path.join(destDir, file);

    const shouldIgnore = ignoreList.some((pattern) => srcFilePath.includes(pattern));
    if (shouldIgnore) {
      return;
    }

    const stat = fs.statSync(srcFilePath);

    if (stat.isDirectory()) {
      // 如果是文件夹，递归复制
      copyAndReplaceTemplate(srcFilePath, destFilePath, templateData);
    } else {
      // 读取文件内容
      const content = fs.readFileSync(srcFilePath, 'utf8');

      // 使用 mustache 进行模板替换
      const output = mustache.render(content, templateData);

      // 将替换后的内容写入目标文件夹
      fs.writeFileSync(destFilePath, output, 'utf8');
    }
  });
}
