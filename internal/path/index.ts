import path from 'node:path';

export const rootPath = path.resolve(__dirname, '..', '..');
export const antdPath = path.resolve(rootPath, 'components', 'antd');
export const componentsPath = path.resolve(antdPath, 'components');
export const distPath = path.resolve(rootPath, 'dist');
export const esPath = path.resolve(distPath, 'es');
export const libPath = path.resolve(distPath, 'lib');
export const typesPath = path.resolve(distPath, 'types');
export const pkgsPath = path.resolve(rootPath, 'packages');
export const tsconfigPath = path.resolve(rootPath, 'tsconfig.json');
