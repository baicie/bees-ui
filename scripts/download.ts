import path from 'node:path';
import AdmZip from 'adm-zip';
import chalk from 'chalk';
import consola from 'consola';
import fs from 'fs-extra';
import gitClone from 'git-clone';
import type { Ora } from 'ora';
import ora from 'ora';
import request from 'request';

export interface FileStat {
  name: string;
  isDirectory: boolean;
  isFile: boolean;
}

// tempPath templates/baicie-temp /temp.zip
export async function download(url: string, tempPath: string) {
  const spinner = ora(`正在从 ${url} 拉取远程模板...`).start();
  const zipPath = path.join(tempPath, 'temp.zip');

  return new Promise<FileStat[]>((resolve) => {
    if (url.endsWith('.git')) {
      const name = path.basename(url).replace('.git', '');

      gitClone(url, path.join(tempPath, name), {}, async (error: unknown) => {
        if (error) {
          consola.log(error);
          spinner.color = 'red';
          spinner.fail(chalk.red('拉取远程模板仓库失败！'));
          await fs.remove(tempPath);
          return resolve([]);
        }

        resolve(defaultFile(tempPath, spinner));
      });
    } else {
      request(url)
        .pipe(fs.createWriteStream(zipPath))
        .on('close', () => {
          // 解压
          const zip = new AdmZip(zipPath);
          zip.extractAllTo(tempPath, true);
          // 过滤文件

          resolve(defaultFile(tempPath, spinner));
        })
        .on('error', async (err) => {
          spinner.color = 'red';
          spinner.fail(chalk.red(`拉取远程模板仓库失败！\n${err}`));
          await fs.remove(tempPath);
          return resolve([]);
        });
    }
  });
}

export function readDirWithFileTypes(folder: string): FileStat[] {
  const list = fs.readdirSync(folder);
  const res = list.map((name) => {
    const stat = fs.statSync(path.join(folder, name));
    return {
      name,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile(),
    };
  });
  return res;
}

function defaultFile(folder: string, spinner: Ora) {
  const files = readDirWithFileTypes(folder).filter(
    (file) => !file.name.startsWith('.') && file.isDirectory && file.name !== '__MACOSX',
  );

  // 没有文件
  if (files.length !== 1) {
    spinner.color = 'red';
    spinner.fail(chalk.red(`拉取远程模板仓库失败！\n${new Error('远程模板源组织格式错误')}`));
    throw new Error('拉取远程模板仓库失败！');
  }

  spinner.color = 'green';
  spinner.succeed(`${chalk.green('拉取远程模板仓库成功！')}`);

  return files;
}
