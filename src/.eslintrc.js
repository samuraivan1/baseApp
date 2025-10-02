// .eslintrc.js
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: 'detect' } },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'storybook', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
    'prettier',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    // Enforce imports via public API only
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          // Solo APIs públicas por feature o shared
          '@/features/*',
          '@/shared',
          // Deep imports necesarios de terceros (documentados)
          'react',
          'react-dom/client',
          'react-router-dom',
          '@hookform/resolvers/zod',
          'zustand/middleware',
          'msw/node',
          'react-toastify/dist/ReactToastify.css',
        ],
      },
    ],
  },
  ignorePatterns: ['dist', 'coverage', 'node_modules'],
};
