import path from 'node:path';

export const rootPath = path.resolve(__dirname, '..', '..');

export const pkgsPath = path.resolve(rootPath, 'packages');
export const internalPath = path.resolve(rootPath, 'internal');
export const compsPath = path.resolve(pkgsPath, 'components');
export const testPath = path.resolve(rootPath, 'tests');
