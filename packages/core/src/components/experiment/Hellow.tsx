import { FunctionalComponent } from '@stencil/core';

interface HelloProps {
  name: string;
}

export const Hello: FunctionalComponent<HelloProps> = (_, children, utils) => {
  console.log('children', children, _, utils);

  return utils.map(children, (child) => ({
    ...child,
    vattrs: {
      ...child.vattrs,
    },
  }));
};
