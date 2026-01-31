import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import projectStructure from "eslint-plugin-project-structure";
import globals from "globals";

// Modern ESLint config with strict TypeScript and unicorn rules
export default function modernConfig(options = {}) {
  const {
    files = ["src/**/*.ts", "**/*.ts"],
    ignores = ["node_modules/", "dist/"],
    maxDepth = 1,
    maxFilesPerDir = 10,
    rules = {},
  } = options;

  return tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    unicorn.configs.recommended,
    {
      files,
      plugins: {
        "project-structure": projectStructure,
      },
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.browser,
        },
      },
      rules: {
        // Project structure
        "project-structure/folder-structure": ["error", {
          structure: { children: [{ name: "*", children: [{ name: "*" }], maxChildren: maxFilesPerDir }] },
        }],

        // TypeScript
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/consistent-type-definitions": ["error", "type"], // type > interface
        "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }], // no type assertions

        // Variable declarations
        "prefer-const": "error", // const > let
        "no-var": "error", // no var
        "no-restricted-syntax": [
          "error",
          { selector: "VariableDeclaration[kind='let']", message: "Use const instead of let" },
        ],

        // Function style
        "func-style": ["error", "expression"], // arrow function > function
        "no-ternary": "error", // if/else > ternary

        // Complexity
        "max-depth": ["error", maxDepth],
        "max-nested-callbacks": ["error", 1],
        complexity: ["error", 5],
        "max-lines": ["error", { max: 200, skipBlankLines: true, skipComments: true }],

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
export { eslint, tseslint, unicorn, projectStructure, globals };
