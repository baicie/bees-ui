import { defineProject } from 'vitest/config';

import { vitestCommonConfig } from '../../vitest.workspace.mjs';

export default defineProject({
  ...vitestCommonConfig,
});
