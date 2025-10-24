module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  env: { browser: true, es6: true, node: true },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-empty': ['error', { allowEmptyCatch: false }],
    // Boundaries: evitar deep imports entre features; usar sólo public API (index.ts)
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          '**/index.ts',
          '**/index.tsx',
          'src/features/**/index',
          'src/shared/**/index',
          // Tipos y APIs públicas de features (si están organizadas así)
          'src/features/**/types',
          'src/features/**/api',
          // Dev y mocks permitidos
          'src/dev/**',
          'src/mocks/**',
        ],
      },
    ],
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
  settings: { react: { version: 'detect' } },
};
