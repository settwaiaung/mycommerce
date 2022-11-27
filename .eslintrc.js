// module.exports = {
//   root: true,
//   env: {
//     browser: true,
//     node: true
//   },
//   parserOptions: {
//     parser: '@babel/eslint-parser',
//     requireConfigFile: false
//   },
//   extends: [
//     '@nuxtjs',
//     'plugin:nuxt/recommended'
//   ],
//   plugins: [
//   ],
//   // add your custom rules here
//   rules: {}
// }
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
  plugins: [],
  // add your custom rules here
  rules: {
    // 'vue/valid-v-slot': ['error', {
    //   allowModifiers: true
    // }]
    // 'vetur.validation.template': false,
    // indent: [2, 'tab'],
    // 'no-tabs': 0,
    camelcase: 'off',
    // 'prettier/prettier': ['warn', { singleQuote: true }],
    'space-before-function-paren': ['warn', 'always'],
    // 'space-before-function-paren': ['off', 'always'],
    'space-in-parens': 'off',
    'vue/multi-word-component-names': 'off',
    'no-extra-semi:': 'off'
  }
}
