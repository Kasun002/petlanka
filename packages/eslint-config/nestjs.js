const base = require('./index');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...base,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },
];
