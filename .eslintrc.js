module.exports = {
  env: {
    node: true,
    jest: true,
    es6: true
  },
  extends: 'react-app',
  parserOptions: {
    ecmaFeature: {
      jsx: true
    }
  },
  plugins: ['react', 'jsx-a11y', 'import', 'spellcheck'],
  settings: {
    react: {
      version: '16.5'
    }
  },
  rules: {
    'func-names': 'off',
    'no-underscore-dangle': 'off',
    'import/no-unresolved': 'off',
    'comma-dangle': ['error', 'never'],
    'no-plusplus': 'off',
    'jsx-a11y/href-no-hash': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-param-reassign': ['error', { props: false }],
    'new-cap': ['error', { capIsNew: false }],
    'no-lone-block': 'off',
    'no-lone-blocks': 'off',
    'no-mixed-operators': 'off',
    'object-curly-spacing': ['error', 'always'],
    'no-unused-vars': ['error', { args: 'after-used' }],
    'max-len': 'off',
    'no-control-regex': 'off',
    'eol-last': ['error', 'always'],
    'no-console': ['error']
  }
}
