import type { Project } from '@pnpm/find-workspace-packages';
import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import chalk from 'chalk';
import consola from 'consola';
import process from 'node:process';
import { rootPath } from './paths';
import { execSync } from 'node:child_process';

const getWorkspacePackages = () => findWorkspacePackages(rootPath);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorAndExit(err: Error): void {
  consola.error(err);
  process.exit(1);
}

async function main() {
  consola.debug(chalk.yellow('publish-script started'));

  const pkgs = Object.fromEntries(
    (await getWorkspacePackages()).map((pkg) => [pkg.manifest.name!, pkg]),
  );

  const publishPackage = async (project: Project) => {
    if (project.manifest.private !== true) {
      execSync('pnpm publish --access public --no-git-checks', {
        cwd: project.dir,
        stdio: 'inherit',
      });
      await sleep(1000);
    }
  };

  try {
    for (const [, project] of Object.entries(pkgs)) {
      await publishPackage(project);
    }
  } catch (error) {
    errorAndExit(error as Error);
  }

  consola.success(chalk.green(`packages published successfully`));
}

main();
