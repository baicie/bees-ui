import fs from 'node:fs';
import path from 'node:path';
import type { Readable } from 'node:stream';
import gulp from 'gulp';
import ts from 'gulp-typescript';
import typescript from 'typescript';
import assign from 'object-assign';
import * as rimraf from 'rimraf';
import stripCode from 'gulp-strip-code';
import through2 from 'through2';
import merge2 from 'merge2';
import { antdPath } from '@bees-ui/internal-path';
import babel from 'gulp-babel';

import type { Options } from '../build';
import type { Module } from '../utils';
import { getProjectPath } from './utils';
import getBabelCommonConfig from './babel';
import replaceLib from './replace-lib';



const tsDefaultReporter = ts.reporter.defaultReporter();
const libDir = getProjectPath('lib');
const esDir = getProjectPath('es');

async function getTsConfig(): Promise<any> {
  let my = {
    compilerOptions: {},
  };
  const tsconfigPath = path.resolve(antdPath, 'tsconfig.json');
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

interface Config {
  compile?: {
    transformTSFile?: (file: any) => any;
    transformFile?: (file: any) => any;
  };
}

async function getConfig(): Promise<Config> {
  const configPath = getProjectPath('.antd-tools.config.js');
  if (fs.existsSync(configPath)) {
    return await import(configPath);
  }

  return {};
}

function insertUseClient() {
  const header = '"use client"\n';
  return through2.obj(function (file, _, next) {
    const { path: filepath } = file;
    if (
      // eslint-disable-next-line regexp/no-unused-capturing-group
      /\.(j|t)sx$/.test(filepath) ||
      // components/index.ts
      // components/xxx/index.ts
      // eslint-disable-next-line regexp/no-unused-capturing-group
      /components(\/[\w-]+)?\/index\.ts$/.test(filepath)
    ) {
      file.contents = Buffer.concat([Buffer.from(header), file.contents]);
    }
    this.push(file);
    next();
  });
}

export async function babelify(js: Readable, modules: Module) {
  const babelConfig = await getBabelCommonConfig(modules);
  // delete babelConfig.cacheDirectory;
  if (modules === 'esm') {
    babelConfig.plugins.push(replaceLib as any);
  }
  const stream = js.pipe(babel(babelConfig as any));
  return stream.pipe(gulp.dest(modules === 'esm' ? esDir : libDir));
}

export async function compile(options: Options = {}, modules: Module) {
  const { compile: { transformTSFile, transformFile } = {} } = await getConfig();
  const tsConfig = await getTsConfig();

  rimraf.sync(path.resolve(antdPath, modules === 'cjs' ? libDir : esDir));

  // const assets = gulp
  //   .src(['components/**/*.@(png|svg)'])
  //   .pipe(gulp.dest(modules === 'cjs' ? libDir : esDir));
  let error = 0;

  // =============================== FILE ===============================
  let transformFileStream;

  if (transformFile) {
    transformFileStream = gulp
      .src(['components/**/*.tsx'])
      .pipe(
        through2.obj(function (file, _encoding, next) {
          let nextFile = transformFile(file) || file;
          nextFile = Array.isArray(nextFile) ? nextFile : [nextFile];
          nextFile.forEach((f: any) => this.push(f));
          next();
        })
      )
      .pipe(gulp.dest(modules === 'esm' ? esDir : libDir));
  }

  // ================================ TS ================================
  const source = [
    'components/**/*.tsx',
    'components/**/*.ts',
    'typings/**/*.d.ts',
    '!components/**/__tests__/**',
    '!components/**/demo/**',
    '!components/**/design/**',
  ];

  if (tsConfig.allowJs) {
    source.unshift('components/**/*.jsx');
  }

  let sourceStream = gulp.src(source, { cwd: antdPath });
  if (modules === 'esm') {
    sourceStream = sourceStream.pipe(
      stripCode({
        start_comment: '@remove-on-es-build-begin',
        end_comment: '@remove-on-es-build-end',
      })
    );
  }

  if (transformTSFile) {
    sourceStream = sourceStream.pipe(
      through2.obj(function (file, _encoding, next) {
        let nextFile = transformTSFile(file) || file;
        nextFile = Array.isArray(nextFile) ? nextFile : [nextFile];
        nextFile.forEach((f: any) => this.push(f));
        next();
      })
    );
  }

  sourceStream = sourceStream.pipe(insertUseClient());

  const tsResult = sourceStream.pipe(
    ts(tsConfig, {
      error(e) {
        tsDefaultReporter.error(e, typescript);
        error = 1;
      },
      finish: tsDefaultReporter.finish,
    })
  );

  function check() {
    if (error && !options['ignore-error']) {
      process.exit(1);
    }
  }

  tsResult.on('finish', check);
  tsResult.on('end', check);

  // const tsFilesStream = await babelify(tsResult.js, modules);
  const tsd = tsResult.dts.pipe(gulp.dest(modules === 'esm' ? esDir : libDir));
  return merge2([transformFileStream, tsd]).filter(s => s);
}
