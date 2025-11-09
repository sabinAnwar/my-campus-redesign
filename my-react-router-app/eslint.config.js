import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React Rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // TypeScript or manual validation
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': 'warn',
      'react/no-unknown-property': 'warn',

      // React Hooks Rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General JavaScript Rules
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
      
      // Copilot-friendly rules
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'warn',
      'no-constant-condition': 'warn',
    },
  },
  {
    // Ignore patterns
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/.react-router/**',
      '**/public/build/**',
      '**/prisma/migrations/**',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/postcss.config.cjs',
      // Development & Debug files
      'COURSE_TEMPLATE.js',
      'add-loaders.js',
      'test-login.js',
      'test-user.js',
      'server-dev.js',
      '**/scripts/**',
      // Backup files
      '**/*-old.jsx',
      '**/*-backup.jsx',
      '**/*-fixed.jsx',
      '**/root-backup.jsx',
      '**/login-old.jsx',
      '**/login-new.jsx',
    ],
  },
];
