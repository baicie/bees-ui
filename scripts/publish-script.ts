import type { Project } from '@pnpm/find-workspace-packages';
import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import chalk from 'chalk';
import consola from 'consola';
import process from 'node:process';
import { rootPath } from './paths';
import {exec, execSync} from 'node:child_process';

const getWorkspacePackages = () => findWorkspacePackages(rootPath);

function errorAndExit(err: Error): void {
  consola.error(err);
  process.exit(1);
}

async function main() {
  consola.debug(chalk.yellow('publish-script started'));

  const pkgs = Object.fromEntries((await getWorkspacePackages()).map(pkg => [pkg.manifest.name!, pkg]));

  const publishPackage = async (project: Project) => {
    const config:any = project.manifest.config
    if(config && config.publish && config.publish === true) {
      execSync('pnpm publish --access public --no-git-checks', {cwd: project.dir, stdio: 'inherit'})
      return;
    }
  };

  try {
    for (const [name, project] of Object.entries(pkgs)) {
      await publishPackage(project);
    }
  } catch (error) {
    errorAndExit(error as Error);
  }

  consola.success(chalk.green(`packages published successfully`));
}

main();
