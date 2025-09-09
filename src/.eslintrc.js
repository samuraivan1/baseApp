module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    ' plugin:@typescript-eslint/recommended',
    'prettier', // IMPORTANTE: 'prettier' siempre debe ser el último.
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  // ✅ --- AÑADE ESTA SECCIÓN --- ✅
  rules: {
    'react/react-in-jsx-scope': 'off', // Apaga la regla que requiere importar React
    'react/prop-types': 'off', // Apaga la regla que requiere definir prop-types
  },
};
