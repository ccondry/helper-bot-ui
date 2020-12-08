var path = require('path');
var nodeExternals = require('webpack-node-externals');

var externals = {};

externals = [
  Object.assign(
    {
      vue: 'vue',
    },
    externals
  ),
  nodeExternals(),
];

exports.externals = externals;

exports.alias = {
  main: path.resolve(__dirname, '../src')
};

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue',
};

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/;

exports.CDN_OBJECTS = [
  'bundles',
  'es',
  'lib',
  'src',
  'CHANGELOG.md',
  'components.json',
  'LICENSE',
  'README.md',
  'package.json'
];
