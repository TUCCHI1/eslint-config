import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

// Modern ESLint config with strict TypeScript and unicorn rules
export default function modernConfig(options = {}) {
  const {
    files = ["src/**/*.ts", "**/*.ts"],
    ignores = ["node_modules/", "dist/"],
    maxDepth = 1,
    rules = {},
  } = options;

  return tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    unicorn.configs.recommended,
    {
      files,
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.browser,
        },
      },
      rules: {
        // TypeScript
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/consistent-type-definitions": ["error", "type"], // type > interface

        // Function style
        "func-style": ["error", "expression"], // arrow function > function
        "no-ternary": "error", // if/else > ternary

        // Complexity
        "max-depth": ["error", maxDepth],
        "max-nested-callbacks": ["error", 1],
        complexity: ["error", 5],

        // User overrides
        ...rules,
      },
    },
    {
      ignores,
    }
  );
}

// Named exports for granular usage
export { eslint, tseslint, unicorn, globals };
