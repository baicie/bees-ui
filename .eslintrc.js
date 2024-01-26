module.exports = {
  extends: [
    'prettier',
    'plugin:compat/recommended',
    'plugin:import/typescript',
    'plugin:markdown/recommended',
    "eslint:recommended",
    "plugin:solid/typescript",
  ],
  env: {
    browser: false,
    node: true,
    jasmine: true,
    es6: true,
  },
  settings: {
    polyfills: ['Promise', 'URL'],
    'import/resolver': {
      typescript: {},
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    'solid',
    '@typescript-eslint',
    'unicorn',
    'markdown',
    'lodash',
  ],
  // https://github.com/typescript-eslint/typescript-eslint/issues/46#issuecomment-470486034
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 2,
        '@typescript-eslint/consistent-type-imports': [2, { disallowTypeAnnotations: false }],
      },
    },
    {
      // In v2, explicitly apply eslint-plugin-markdown's `markdown`
      // processor on any Markdown files you want to lint.
      files: ['components/*/demo/*.md'],
      processor: 'markdown/markdown',
    },
    {
      // In v2, configuration for fenced code blocks is separate from the
      // containing Markdown file. Each code block has a virtual filename
      // appended to the Markdown file's path.
      files: [
        'components/*/demo/*.md/*.ts',
        'components/*/demo/*.md/*.tsx',
        'components/*/demo/*.md/*.js',
        'components/*/demo/*.md/*.jsx',
      ],
      // Configuration for fenced code blocks goes with the override for
      // the code block's virtual filename, for example:
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
          jsx: true,
        },
      },
      globals: {
        mountNode: true,
      },
      rules: {
        indent: 0,
        'default-case': 0,
        'eol-last': 0,
        'no-console': 0,
        'no-plusplus': 0,
        'no-script-url': 0,
        'prefer-rest-params': 0,
        'compat/compat': 0,
        'class-methods-use-this': 0,
        'jsx-a11y/href-no-hash': 0,
        'jsx-a11y/control-has-associated-label': 0,
      },
    },
    {
      files: ['components/**/demo/*.tsx'],
      rules: {
        'no-console': 0,
        'compat/compat': 0,
        'jsx-a11y/control-has-associated-label': 0,
        'class-methods-use-this': 0,
      },
    },
    {
      files: ['.dumi/**/*.ts', '.dumi/**/*.tsx', '.dumi/**/*.js', '.dumi/**/*.jsx'],
      rules: {
        'no-console': 0,
        'compat/compat': 0,
        'jsx-a11y/control-has-associated-label': 0,
        'class-methods-use-this': 0,
      },
    },
    {
      files: ['**/*.json'],
      rules: {
        'no-unused-expressions': 0,
        'comma-dangle': 0,
      },
    },
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        'compat/compat': 0,
      },
    },
  ],
  rules: {
    'import/extensions': 0,
    'import/no-cycle': 0,
    'lodash/import-scope': 2,
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
    'solid/reactivity': 0,
  },
  globals: {
    gtag: true,
  },
};
