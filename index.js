import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import { readdirSync } from "node:fs";
import { dirname, extname } from "node:path";

// Cache to avoid counting files multiple times per directory
const dirFileCountCache = new Map();

const countFilesInDir = (dir, extensions) => {
  if (dirFileCountCache.has(dir)) return dirFileCountCache.get(dir);
  try {
    const count = readdirSync(dir).filter((f) => extensions.includes(extname(f))).length;
    dirFileCountCache.set(dir, count);
    return count;
  } catch {
    return 0;
  }
};

const createMaxFilesPerDirRule = (maxFiles) => ({
  meta: {
    type: "problem",
    docs: { description: `Limit files per directory to ${maxFiles}` },
    schema: [],
  },
  create: (context) => ({
    Program: () => {
      const filePath = context.filename;
      const dir = dirname(filePath);
      const extensions = [".ts", ".tsx", ".js", ".jsx"];
      const count = countFilesInDir(dir, extensions);
      if (count > maxFiles) {
        context.report({
          loc: { line: 1, column: 0 },
          message: `Directory has ${count} files (max: ${maxFiles}). Split into subdirectories.`,
        });
      }
    },
  }),
});

// Base no-restricted-syntax rules (without default export ban)
const baseRestrictedSyntax = [
  { selector: "VariableDeclaration[kind='let']", message: "Use const instead of let" },
  { selector: "FunctionExpression", message: "Use arrow function instead of function expression" },
  { selector: "FunctionDeclaration", message: "Use arrow function instead of function declaration" },
];

// Full no-restricted-syntax rules (with default export ban)
const fullRestrictedSyntax = [
  ...baseRestrictedSyntax,
  { selector: "ExportDefaultDeclaration", message: "Use named exports instead of default export" },
];

// Modern ESLint config with strict TypeScript and unicorn rules
export default function modernConfig(options = {}) {
  const {
    files = ["src/**/*.ts", "**/*.ts"],
    ignores = ["node_modules/", "dist/"],
    maxDepth = 1,
    maxFilesPerDir = 10,
    nextjs = false,
    rules = {},
  } = options;

  const configs = [
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    unicorn.configs.recommended,
    {
      files,
      plugins: {
        "custom-structure": {
          rules: {
            "max-files-per-dir": createMaxFilesPerDirRule(maxFilesPerDir),
          },
        },
      },
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.browser,
        },
      },
      rules: {
        // Directory structure
        "custom-structure/max-files-per-dir": "error",

        // TypeScript
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/consistent-type-definitions": ["error", "type"], // type > interface
        "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }], // no type assertions

        // Variable declarations
        "prefer-const": "error", // const > let
        "no-var": "error", // no var
        "no-restricted-syntax": ["error", ...fullRestrictedSyntax],

        // Function style
        "prefer-arrow-callback": "error", // arrow function > function in callbacks
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
    },
  ];

  // Next.js app router requires default exports for pages/layouts
  if (nextjs) {
    configs.push({
      files: ["src/app/**/*.tsx", "app/**/*.tsx"],
      rules: {
        "no-restricted-syntax": ["error", ...baseRestrictedSyntax],
      },
    });
  }

  return tseslint.config(...configs);
}

// Named exports for granular usage
export { eslint, tseslint, unicorn, globals };
