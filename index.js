import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

/**
 * Modern ESLint config with strict TypeScript and unicorn rules
 * @param {Object} options
 * @param {string[]} [options.files] - File patterns to lint (default: ["src/**/*.ts"])
 * @param {string[]} [options.ignores] - Patterns to ignore
 * @param {number} [options.maxDepth] - Maximum nesting depth (default: 1, no nesting allowed)
 * @param {Object} [options.rules] - Additional rules to override
 */
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

        // Complexity
        "max-depth": ["error", maxDepth],
        "max-nested-callbacks": ["error", 3],
        complexity: ["error", 10],

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
