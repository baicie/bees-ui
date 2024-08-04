// @ts-check
import { builtinModules } from 'node:module';
import { fileURLToPath, URL } from 'node:url';
// import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import pluginImportX from 'eslint-plugin-import-x';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import pluginN from 'eslint-plugin-n';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import pluginRegExp from 'eslint-plugin-regexp';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
// const compat = new FlatCompat({ baseDirectory: __dirname });

export default tseslint.config(
  {
    plugins: {
      ['@typescript-eslint']: tseslint.plugin,
      ['jsx-a11y']: jsxA11yPlugin,
      ['n']: pluginN,
      ['react-hooks']: reactHooksPlugin,
      ['react']: reactPlugin,
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
      'packages',
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
      'n/no-extraneous-require': 'off',
    },
  },

  // website
  {
    files: ['{components}/**/*.{ts,tsx,mts,cts,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    // extends: [...compat.config(jsxA11yPlugin.configs.recommended)],
    rules: {
      'react/jsx-one-expression-per-line': 0,
      'react/prop-types': 0,
      'react/forbid-prop-types': 0,
      'react/jsx-indent': 0,
      'react/jsx-wrap-multilines': ['error', { declaration: false, assignment: false }],
      'react/jsx-filename-extension': 0,
      'react/state-in-constructor': 0,
      'react/jsx-props-no-spreading': 0,
      'react/destructuring-assignment': 0, // TODO: remove later
      'react/require-default-props': 0,
      'react/sort-comp': 0,
      'react/display-name': 0,
      'react/static-property-placement': 0,
      'react/jsx-no-bind': 0, // Should not check test file
      'react/no-find-dom-node': 0,
      'react/no-unused-prop-types': 0,
      'react/default-props-match-prop-types': 0,
      'react-hooks/rules-of-hooks': 2, // Checks rules of Hooks
      'react/function-component-definition': 0,
      'react/no-unused-class-component-methods': 0,
      'import/extensions': 0,
      'import/no-cycle': 2,
      'lodash/import-scope': 2,
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            'site/**',
            'tests/**',
            'scripts/**',
            'scripts/*.ts',
            '**/*.test.js',
            '**/__tests__/*',
            '*.config.js',
            '**/*.md',
          ],
        },
      ],
      'jsx-a11y/no-static-element-interactions': 0,
      'jsx-a11y/anchor-has-content': 0,
      'jsx-a11y/click-events-have-key-events': 0,
      'jsx-a11y/anchor-is-valid': 0,
      'jsx-a11y/no-noninteractive-element-interactions': 0,
      // label-has-for has been deprecated
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
      'jsx-a11y/label-has-for': 0,

      'comma-dangle': ['error', 'always-multiline'],
      'consistent-return': 0, // TODO: remove later
      'no-param-reassign': 0, // TODO: remove later
      'no-underscore-dangle': 0,
      // for (let i = 0; i < len; i++)
      'no-plusplus': 0,
      // https://eslint.org/docs/rules/no-continue
      // labeledLoop is conflicted with `eslint . --fix`
      'no-continue': 0,
      // ban this for Number.isNaN needs polyfill
      'no-restricted-globals': 0,
      'max-classes-per-file': 0,

      'jest/no-test-callback': 0,
      'jest/expect-expect': 0,
      'jest/no-done-callback': 0,
      'jest/valid-title': 0,
      'jest/no-conditional-expect': 0,
      'jest/no-standalone-expect': 0,

      'unicorn/better-regex': 2,
      'unicorn/prefer-string-trim-start-end': 2,
      'unicorn/expiring-todo-comments': 2,
      'unicorn/no-abusive-eslint-disable': 0,

      // https://github.com/typescript-eslint/typescript-eslint/issues/2540#issuecomment-692866111
      'no-use-before-define': 0,
      '@typescript-eslint/no-use-before-define': 2,
      'no-shadow': 0,
      '@typescript-eslint/no-shadow': [2, { ignoreTypeValueShadow: true }],
      // https://github.com/typescript-eslint/typescript-eslint/issues/2528#issuecomment-689369395
      'no-undef': 0,
      'import/order': 0,
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
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
);
