import { rollup } from 'rollup'
import { findWorkspacePackages } from '@pnpm/find-workspace-packages';
import path from 'node:path';
import { DEFAULT, generateExternal} from './ustils';
import svelte from 'rollup-plugin-svelte';

interface Options {
  /**
   * @description
   */
  input?:string;
}

export async function build(root:string,options:Options) {
  const {input:_input = DEFAULT} = options;
  const input = path.resolve(root,_input)
  const output = path.resolve(root,'dist')

  const packages = await findWorkspacePackages(root);
  const manifest = packages[0].manifest;

  const bundle =  await rollup({
    input,
    plugins:[
      svelte({
        compilerOptions:{
          customElement:true,
          generate:'dom'
        }
      }),
      // resolve(),
      // terser(),
      // cleanup()
    ],
    treeshake:true,
    external:generateExternal(manifest),
  })

  await bundle.write({
    format:'esm',
    dir:output,
  })
}
