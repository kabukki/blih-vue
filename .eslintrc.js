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
    'indent': [2, 'tab', { SwitchCase: 1 }],
		'no-tabs': 0,
    'arrow-parens': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-unused-vars': [2, { 'argsIgnorePattern': '^_' }],
    'semi': [2, 'always']
  }
}
