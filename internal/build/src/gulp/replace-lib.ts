import { dirname } from 'node:path';
import fs from 'node:fs';
import { getProjectPath } from './utils';

function replacePath(path: { node: { source: { value: string; }; }; }) {
  if (path.node.source && /\/lib\//.test(path.node.source.value)) {
    const esModule = path.node.source.value.replace('/lib/', '/es/');
    const esPath = dirname(getProjectPath('node_modules', esModule));
    if (fs.existsSync(esPath)) {
      path.node.source.value = esModule;
    }
  }

  // @ant-design/icons/xxx => @ant-design/icons/es/icons/xxx
  const antdIconMatcher = /@ant-design\/icons\/([^/]*)$/;
  if (path.node.source && antdIconMatcher.test(path.node.source.value)) {
    const esModule = path.node.source.value.replace(
      antdIconMatcher,
      (_, iconName) => `@ant-design/icons/es/icons/${iconName}`
    );
    const esPath = dirname(getProjectPath('node_modules', esModule));
    if (fs.existsSync(esPath)) {
      path.node.source.value = esModule;
    }
  }
}

function replaceLib() {
  return {
    visitor: {
      ImportDeclaration: replacePath,
      ExportNamedDeclaration: replacePath,
    },
  };
}

export default replaceLib;
