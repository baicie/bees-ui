import fs from 'node:fs';
import path from 'node:path';
import gulp from 'gulp';
import ts from 'gulp-typescript';
import assign from 'object-assign';
import * as rimraf from 'rimraf';

import { Options } from './build';
import { antdPath } from '@bees-ui/internal-path';

const tsDefaultReporter = ts.reporter.defaultReporter();
async function getTsConfig(tsconfigPath: string): Promise<any> {
  let my = {
    compilerOptions: {},
  };
  if (fs.existsSync(tsconfigPath)) {
    my = await import(tsconfigPath);
  }
  return assign(
    {
      noUnusedParameters: true,
      noUnusedLocals: true,
      strictNullChecks: true,
      target: 'es6',
      jsx: 'preserve',
      moduleResolution: 'node',
      declaration: true,
      allowSyntheticDefaultImports: true,
    },
    my.compilerOptions,
  );
}

export async function compile(root: string, options: Options = {}) {
  const distPath = path.resolve(root, 'dist');
  const typesPath = path.resolve(distPath, 'types');
  const tsconfigPath = path.resolve(root, 'tsconfig.json');

  rimraf.sync(typesPath);

  const tsConfig = await getTsConfig(tsconfigPath);

  let error = 0;

  // ================================ TS ================================
  const source = [
    'components/**/*.tsx',
    'components/**/*.ts',
    'typings/**/*.d.ts',
    '!components/**/__tests__/**',
    '!components/**/demo/**',
    '!components/**/design/**',
  ];

  // allow jsx file in components/xxx/
  if (tsConfig.allowJs) {
    source.unshift('components/**/*.jsx');
  }

  const sourceStream = gulp.src(source, { cwd: antdPath });

  const tsResult = sourceStream.pipe(
    ts(
      {
        ...tsConfig,
        noEmitOnError: false,
      },
      {
        error(e) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          tsDefaultReporter.error(e);
          error = 1;
        },
        finish: tsDefaultReporter.finish,
      },
    ),
  );

  function check() {
    if (error && !options['ignore-error']) {
      process.exit(1);
    }
  }

  tsResult.on('finish', check);
  tsResult.on('end', check);
  const tsd = tsResult.dts.pipe(gulp.dest(typesPath));
  return tsd;
}
