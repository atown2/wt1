module.exports = {
 'extends': 'airbnb-base',
 'parserOptions': {
  'ecmaVersion': 8,
  'sourceType': 'module',
  'ecmaFeatures': {
   'jsx': true
  }
 },
 'rules': {
  'func-names': [ 'error', 'never' ],
  'prefer-arrow-callback': 'off',
  'indent': 'off',
  'no-mixed-spaces-and-tabs': 'off',
  'no-multiple-empty-lines': 'off',
  'no-multi-spaces': 'off',
  'no-tabs': 'off',
  'no-unused-vars': 'off',

 },
 'env': {
  'browser': true,
  'node': true,
  'jquery': true,
  'es6': true
 }
};
