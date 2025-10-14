module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
  env: { browser: true, es6: true, node: true },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-empty': ['error', { allowEmptyCatch: false }],
  },
  settings: { react: { version: 'detect' } },
};

