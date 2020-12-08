const commonjs = process.env.BABEL_ENV !== 'esm';

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        shippedProposals: true,
        // modules: commonjs ? 'commonjs' : false,
        modules: 'amd',
        targets: {
          browsers: [
            '>0.25%',
            'ie >= 11',
            'not op_mini all' // opera mini doesn't support client side
          ]
        }
      }
    ],
    [
      '@vue/babel-preset-jsx',
      {
        'vModel': false
      }
    ]
  ],
  "env": {
    "test": {
      "presets": [
        ["env", {  "targets": { "node": "current" }}]
      ]
    }
  },
  plugins: [
    'transform-vue-jsx',
    [
      "module-resolver",
      {
      }
    ],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    ['@babel/plugin-transform-runtime', { useESModules: true }],
    'babel-plugin-dev-expression'
  ].filter(Boolean)
};
