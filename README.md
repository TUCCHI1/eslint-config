# @tucchi-/eslint-config

Modern ESLint config with strict TypeScript and unicorn rules.

## Features

- **typescript-eslint strict + stylistic** - Strict type checking
- **eslint-plugin-unicorn** - Modern JavaScript best practices
- **Complexity rules** - Prevent deeply nested code

### Included Rules

| Category | Rules |
|----------|-------|
| TypeScript | `strict`, `stylistic`, no `any`, no `!`, `type` only, arrow functions only |
| Unicorn | Full `recommended` preset |
| Complexity | `max-depth: 1`, `max-nested-callbacks: 1`, `complexity: 5` |

## Install

```bash
npm install -D @tucchi-/eslint-config eslint typescript typescript-eslint @eslint/js eslint-plugin-unicorn globals
```

## Usage

Create `eslint.config.js`:

```js
import config from "@tucchi-/eslint-config";

export default config();
```

### With Options

```js
import config from "@tucchi-/eslint-config";

export default config({
  files: ["src/**/*.ts"],
  ignores: ["dist/", "coverage/"],
  maxDepth: 2, // Allow one level of nesting if needed
  rules: {
    "unicorn/no-null": "off", // Override specific rules
  },
});
```

### With Bun

Add `Bun` global:

```js
import config from "@tucchi-/eslint-config";

export default [
  ...config(),
  {
    languageOptions: {
      globals: { Bun: "readonly" },
    },
  },
];
```

## What's Enforced

- `null` → `undefined`
- Full variable names (`msg` → `message`, `cb` → `callback`)
- `node:` protocol for Node.js imports
- Top-level await preferred
- No nesting allowed (early return pattern enforced)
- No `any` type
- No non-null assertions (`!`)
- `type` only (no `interface`)
- Arrow functions only (no `function`)

## License

MIT
