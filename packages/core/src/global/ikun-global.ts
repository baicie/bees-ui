import { Env } from '@stencil/core';

// useless
export const initialize = () => {
  console.log('Env: ', Env);
};

export default initialize;
