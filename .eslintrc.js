module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    indent: 0,
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'always'],
    strict: ['error', 'global'],
    'no-eval': ['error'],
    eqeqeq: ['error'],
    'max-params': ['error', 6],
    'prettier/prettier': 2,
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  plugins: ['jest', '@typescript-eslint', 'prettier'],
};
