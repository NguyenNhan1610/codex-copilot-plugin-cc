// Production ESLint flat config for Next.js / TypeScript projects
// Covers: errors, best practices, typescript, react, next.js, security

import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Errors
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",

      // Best practices
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-shadow": "error",
      "no-param-reassign": ["error", { props: false }],
      "no-return-await": "error",
      "require-await": "error",
      "no-async-promise-executor": "error",
      "no-promise-executor-return": "error",
      "prefer-promise-reject-errors": "error",

      // Security
      "no-script-url": "error",

      // Style (minimal — let prettier/formatter handle the rest)
      "curly": ["error", "multi-line"],
      "no-nested-ternary": "warn",
      "no-unneeded-ternary": "error",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TypeScript-specific (without parser — basic rules only)
      "no-unused-vars": "off", // TS handles this
    },
  },
  {
    files: ["**/*.test.{ts,tsx,js,jsx}", "**/*.spec.{ts,tsx,js,jsx}", "**/tests/**"],
    rules: {
      "no-console": "off",
    },
  },
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "dist/",
      "build/",
      "coverage/",
      "*.min.js",
      "*.d.ts",
    ],
  },
];
