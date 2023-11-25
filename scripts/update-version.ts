import type { Project } from '@pnpm/find-workspace-packages';
import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import chalk from 'chalk';
import consola from 'consola';
import process from 'node:process';
import { pkgsPath } from './paths';

// export const projectRoot = path.resolve(fileURLToPath(import.meta.url), '..', '..')
const getWorkspacePackages = () => findWorkspacePackages(pkgsPath);

function errorAndExit(err: Error): never {
  consola.error(err);
  process.exit(1);
}

async function main() {
  const version = process.env.TAG_VERSION?.replace('v', '');
  const gitHead = process.env.GIT_HEAD;
  if (!version) {
    errorAndExit(new Error('No version'));
  }

  consola.log(chalk.cyan(`$new version: ${version}`));
  consola.log(chalk.cyan(`$GIT_HEAD: ${gitHead}`));
  consola.debug(chalk.yellow('Updating package.json'));

  const pkgs = Object.fromEntries((await getWorkspacePackages()).map(pkg => [pkg.manifest.name!, pkg]));

  const writeVersion = async (project: Project) => {
    await project.writeProjectManifest({
      ...project.manifest,
      version,
      gitHead,
    } as any);
  };

  try {
    for (const [name, project] of Object.entries(pkgs)) {
      await writeVersion(project);
    }
  } catch (error) {
    errorAndExit(error as Error);
  }

  consola.success(chalk.green(`packages updated successfully to version ${version}`));
}

main();
