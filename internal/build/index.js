#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-undef */
try {
  import('./dist/index.cjs')
} catch (error) {
  console.log(error)
}
