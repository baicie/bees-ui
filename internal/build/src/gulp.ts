import fs from 'node:fs';
import gulp from 'gulp';
import ts from 'gulp-typescript';
import minimist from 'minimist';
import assign from 'object-assign';
import { sync } from 'rimraf';

import { tsconfigPath, typesPath } from './path';

const tsDefaultReporter = ts.reporter.defaultReporter();
const argv = minimist(process.argv.slice(2));
async function getTsConfig(): Promise<any> {
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

export async function compile() {
  sync(typesPath);
  const tsConfig = await getTsConfig();

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

  const sourceStream = gulp.src(source);

  const tsResult = sourceStream.pipe(
    ts(tsConfig, {
      error(e) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        tsDefaultReporter.error(e);
        error = 1;
      },
      finish: tsDefaultReporter.finish,
    }),
  );

  function check() {
    if (error && !argv['ignore-error']) {
      process.exit(1);
    }
  }

  tsResult.on('finish', check);
  tsResult.on('end', check);
  const tsd = tsResult.dts.pipe(gulp.dest(typesPath));
  return tsd;
}
