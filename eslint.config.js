import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import eslintPluginAstro from 'eslint-plugin-astro'

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'public/**', // exclude all of public (or narrow to 'public/s3-public/**')
      '.output/**',
      '.astro/**',
      'coverage/**',
      '*.log',
      '.env*',
      '.cache/**',
      '.DS_Store'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'astro/no-set-html-directive': 'off'
    }
  },

  prettier
]
