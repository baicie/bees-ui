import fs, { read } from 'node:fs';
import path from 'node:path';
import { execa } from 'execa';
import { globSync } from 'fast-glob';
import colors from 'picocolors';

import pkg from '../package.json';

const rootPath = path.resolve(__dirname, '..');
const packageJsonPath = path.resolve(rootPath, 'package.json');
const patchPkg = {
  clsx: {
    version: pkg.devDependencies.clsx,
    replace: ['classnames'],
    resolution: 'clsx',
  },
  preact: {
    version: pkg.devDependencies.preact,
    replace: ['react', 'react-dom'],
    resolution: 'preact/compat',
  },
};

interface PackageJson {
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  peerDependencies?: { [key: string]: string };
  resolutions?: { [key: string]: string };
}

const regex = /^(@ant-design\/|rc-)/;
const unixRegex =
  /\/private\/var\/folders\/[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+/;

async function main() {
  console.log(colors.cyan('Patching package.json to replace React with Preact...'));
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as PackageJson;
  const patchDeps = Object.keys(packageJson.devDependencies || {}).filter((key) => regex.test(key));

  for (const dep of patchDeps) {
    await patchReactToPreact(dep, packageJson.devDependencies![dep]);
  }
}

async function patchReactToPreact(packageName: string, version: string) {
  try {
    console.log(colors.cyan(`Patching ${packageName}@${version}...`));
    const res = await execa('pnpm', ['patch', `${packageName}@${version}`]);
    const line = res.stdout.split(/\r?\n/);
    const patchPath = line[2].match(unixRegex)?.[0];
    if (patchPath) {
      const patch = path.resolve(patchPath, 'package.json');
      if (!fs.existsSync(patch)) {
        console.log(colors.red('Patch file not found:'), colors.yellow(patch));
        return;
      }
      const patchJson = JSON.parse(fs.readFileSync(patch, 'utf-8')) as PackageJson;
      replaceDeps(patchJson);
      fs.writeFileSync(patch, JSON.stringify(patchJson, null, 2), 'utf-8');
      console.log(colors.green(`Replaced dependencies in ${patch}`));
      const allFiles = globSync('**/*.{js,ts,tsx,jsx}', {
        cwd: patchPath,
        ignore: ['node_modules/**/*'],
        onlyFiles: true,
        absolute: true,
      });
      for (const file of allFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const newContent = content
          .replace("from 'react'", "from 'preact/compat'")
          .replace("from 'react-dom'", "from 'preact/compat'")
          .replace("from 'react/jsx-runtime'", "from 'preact/jsx-runtime'")
          .replace("require('react')", "require('preact/compat')")
          .replace("require('react-dom')", "require('preact/compat')")
          .replace("require('react/jsx-runtime')", "require('preact/jsx-runtime')");
        fs.writeFileSync(file, newContent, 'utf-8');
      }

      await execa('pnpm', ['patch-commit', `${patchPath}`]);
    }
    console.log(colors.green(`Patched ${packageName}@${version}`));
  } catch (error) {
    console.log(colors.red(`Failed to patch ${packageName}@${version}`));
    console.log(error);
  }
}

function replaceDeps(packageJson: PackageJson) {
  Object.entries(patchPkg).forEach(([pkgName, { version, replace }]) => {
    replace.forEach((dep) => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        delete packageJson.dependencies[dep];
        packageJson.dependencies[pkgName] = version;
      } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
        delete packageJson.devDependencies[dep];
        packageJson.devDependencies[pkgName] = version;
      } else if (packageJson.peerDependencies && packageJson.peerDependencies[dep]) {
        delete packageJson.peerDependencies[dep];
        packageJson.peerDependencies[pkgName] = version;
      }
    });
  });
}

main()
  .then(() => {
    console.log(colors.green('Patch completed!'));
  })
  .catch((error) => {
    console.log(colors.red('Patch failed:'), colors.yellow(error));
  });
