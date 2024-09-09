// @ts-check
import { builtinModules } from 'node:module';
import { fileURLToPath, URL } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import pluginImportX from 'eslint-plugin-import-x';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import pluginN from 'eslint-plugin-n';
import pluginRegExp from 'eslint-plugin-regexp';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: undefined,
  allConfig: undefined,
});

export default tseslint.config(
  {
    plugins: {
      ['@typescript-eslint']: tseslint.plugin,
      ['jsx-a11y']: jsxA11yPlugin,
      ['n']: pluginN,
      ['import-x']: pluginImportX,
    },
  },

  {
    ignores: [
      'node_modules/',
      '**/dist/**',
      '**/static/**',
      '**/.turbo/**',
      '**/temp/**',
      '**/.vitepress/**',
      '**/*.snap',
      '**/vite.config.ts',
      'bcz.confit.ts',
      '**/buildEnd.config.ts',
      '**/rollup.config.ts',
      '**/vitest.config.ts',
      '**/vitest.config.e2e.ts',
      'scripts',
      'coverage',
      'docs',
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  pluginRegExp.configs['flat/recommended'],

  {
    languageOptions: {
      globals: {
        ...globals.es2022,
      },
      parserOptions: {
        allowImportExportEverywhere: true,
        cacheLifetime: {
          glob: 'Infinity',
        },
        project: [
          'packages/*/tsconfig.json',
          'playground/*/tsconfig.json',
          'components/*/tsconfig.json',
          'internal/*/tsconfig.json',
          'docs/tsconfig.json',
          'tsconfig.json',
          'tsconfig.node.json',
          'tsconfig.test.json',
        ],
        tsconfigRootDir: __dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': 'error',
      'no-empty': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'n/no-extraneous-import': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  // website
  {
    files: ['{components,packages,playground}/**/*.{ts,tsx,mts,cts,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    extends: [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      ...compat.config(jsxA11yPlugin.configs.recommended),
    ],
    rules: {
      '@typescript-eslint/internal/prefer-ast-types-enum': 'off',
      'import/no-default-export': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
    },
    settings: {},
  },

  // node
  {
    files: ['internal/**/*.{ts,mts,cts,js}'],
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
      },
      globals: {
        '...globals.node': true,
      },
    },
    rules: {
      'n/no-exports-assign': 'error',
      'n/no-unpublished-bin': 'error',
      'n/no-unsupported-features/es-builtins': 'error',
      'n/no-unsupported-features/node-builtins': 'error',
      'n/process-exit-as-throw': 'error',
      'n/hashbang': 'error',
      eqeqeq: ['warn', 'always', { null: 'never' }],
      'no-debugger': ['error'],
      'no-console': 'error',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-process-exit': 'off',
      'no-useless-escape': 'off',
      'prefer-const': [
        'warn',
        {
          destructuring: 'all',
        },
      ],
      'n/no-missing-require': [
        'error',
        {
          allowModules: ['pnpapi', 'vite'],
          tryExtensions: ['.ts', '.js', '.jsx', '.tsx', '.d.ts'],
        },
      ],
      'n/no-extraneous-import': [
        'error',
        {
          allowModules: ['tsup'],
        },
      ],
      'n/no-extraneous-require': [
        'error',
        {
          allowModules: ['vite'],
        },
      ],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import-x/no-nodejs-modules': [
        'error',
        {
          allow: builtinModules.map((mod) => `node:${mod}`),
        },
      ],
      'import-x/no-duplicates': 'error',
      'import-x/order': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        },
      ],
      'regexp/no-contradiction-with-assertion': 'error',
      'regexp/use-ignore-case': 'off',
    },
  },

  // tests
  {
    name: 'tests',
    files: ['**/__tests__/**/*.?([cm])[jt]s?(x)', 'tests/**/*.?([cm])[jt]s?(x)'],
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  {
    name: 'disables/js',
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    rules: {
      'typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    name: 'disables/dts',
    files: ['**/*.d.ts'],
    rules: {
      'typescript-eslint/triple-slash-reference': 'off',
    },
  },
  {
    name: 'disables/test',
    files: ['**/__tests__/**/*.?([cm])[jt]s?(x)', 'playground/test/**/*.?([cm])[jt]s?(x)'],
    rules: {
      'no-console': 'off',
      'typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    name: 'disables/playground',
    files: ['playground/**/*.{ts,tsx,mts,cts,js,jsx}'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    name: 'disables/demo',
    files: ['components/**/demo/*.{ts,tsx,mts,cts,js,jsx}'],
    rules: {
      'no-console': 'off',
    },
  },
);
