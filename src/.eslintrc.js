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
  overrides: [
    {
      files: [
        'src/**/components/**/*.{ts,tsx,js,jsx}',
        'src/features/**/components/**/*.{ts,tsx,js,jsx}',
        'src/**/pages/**/*.{ts,tsx,js,jsx}',
      ],
      rules: {
        // Prohibir fetch/axios directamente en componentes React
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'axios',
                message:
                  'No importes axios en componentes. Usa hooks de api/queries por feature.',
              },
            ],
            patterns: [
              {
                group: ['node-fetch', 'whatwg-fetch', 'cross-fetch'],
                message:
                  'No uses fetch directo en componentes. Usa hooks de api/queries por feature.',
              },
            ],
          },
        ],
        // Bloquear uso de fetch/axios dentro de componentes mediante patrón simple
        'no-restricted-syntax': [
          'warn',
          {
            selector: "CallExpression[callee.name='fetch']",
            message:
              'Evita fetch en componentes. Usa useQuery desde api/queries.',
          },
          {
            selector: "CallExpression[callee.object.name='axios']",
            message:
              'Evita axios en componentes. Usa useQuery desde api/queries.',
          },
        ],
      },
    },
  ],
  ignorePatterns: ['dist', 'coverage', 'node_modules'],
};
