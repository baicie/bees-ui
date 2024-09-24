import fs from 'node:fs';
import { ButtonProps } from '@bees-ui/antd';
import { antdPath } from '@bees-ui/internal-path';
import * as tsj from 'ts-json-schema-generator';
import * as ts from 'typescript';

const config = {
  path: '/Users/liuzhiwei/Desktop/workspeace/git-code/bees-ui/components/antd/components/index.ts',
  tsconfig: '/Users/liuzhiwei/Desktop/workspeace/git-code/bees-ui/components/antd/tsconfig.json',
  type: 'ButtonProps',
};
const outputPath = 'outputPath.json';
const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(outputPath, schemaString, (err) => {
  if (err) throw err;
});
