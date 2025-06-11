import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': [
        'warn',
        {
          semi: true,
          tabWidth: 2,
          printWidth: 100,
          singleQuote: true,
          trailingComma: 'none',
          bracketSameLine: false,
          endOfLine: 'auto'
        }
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }]
    },
    ignores: ['**/node_modules/', '**/dist/']
  }
]);
