#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-undef */
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./dist/index.cjs');
} catch (error) {
  console.log(error);
}
