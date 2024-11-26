import globals from 'globals'

export default {
  configs: {
    languageOptions: { globals: globals.node },
    recommended: {
      name: 'example/recommended',
      rules: {
        'no-unused-vars': 'warn',
      },
    },
    strict: {
      name: 'example/strict',
      rules: {
        'no-unused-vars': 'error',
      },
    },
  },
}
