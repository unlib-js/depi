import pluginJs from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'
import globals from 'globals'
import tseslint from 'typescript-eslint'


/**
 * @type {import('eslint').Linter.Config}
 */
export default [
  { ignores: ['dist/**/*'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
    },
  },
  {
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/eol-last': ['error', 'always'],
      '@stylistic/js/array-bracket-spacing': ['error', 'never'],
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
      '@stylistic/js/no-trailing-spaces': ['error'],
      '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/js/max-len': ['warn', {
        code: 80,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: ' from \'',
      }],
    },
  },
  {
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      curly: ['error', 'multi-line', 'consistent'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'spaced-comment': ['error', 'always'],
    },
  },
]
