module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: '6'
  },
  env: {
    browser: true,
    node: true,
    'es6': true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    'arrow-parens': 0,
    'indent': [0, 4],
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-tabs': 0,
    'no-unused-vars': [2, { 'argsIgnorePattern': '^_' }],
    'semi': [2, 'always']
  }
}
