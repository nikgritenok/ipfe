import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin'
import eslintParserTypeScript from '@typescript-eslint/parser'

export default [
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: eslintParserTypeScript,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypeScript,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintPluginTypeScript.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
]
