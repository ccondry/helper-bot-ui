module.exports = {
  'root': true,

  'env': {
    'browser': true,
    'node': true,
    'amd': false
  },

  'parserOptions': {
    'ecmaVersion': 6,
    "parser": "babel-eslint",
    "sourceType": 'module',
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true
    }
  },
  'extends': [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/recommended'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-useless-escape': 0,
    'vue/html-indent': ['warn', 2, {
      attribute: 0,
      alignAttributesVertically: false
    }],
    'vue/max-attributes-per-line': ['warn', {
      'singleline': 3,
      'multiline': {
        'max': 1,
        'allowFirstLine': true
      }
    }]
  }
}
