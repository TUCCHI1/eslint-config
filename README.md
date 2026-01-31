# eslint-config-modern-ts

Modern ESLint config with strict TypeScript and unicorn rules.

## Features

- **typescript-eslint strict + stylistic** - Strict type checking
- **eslint-plugin-unicorn** - Modern JavaScript best practices
- **Complexity rules** - Prevent deeply nested code

### Included Rules

| Category | Rules |
|----------|-------|
| TypeScript | `strict`, `stylistic`, no `any`, no `!` assertion |
| Unicorn | Full `recommended` preset |
| Complexity | `max-depth: 3`, `max-nested-callbacks: 3`, `complexity: 10` |

## Install

```bash
npm install -D eslint-config-modern-ts eslint typescript
```

## Usage

Create `eslint.config.js`:

```js
import modernConfig from "eslint-config-modern-ts";

export default modernConfig();
```

### With Options

```js
import modernConfig from "eslint-config-modern-ts";

export default modernConfig({
  files: ["src/**/*.ts"],
  ignores: ["dist/", "coverage/"],
  maxDepth: 4,
  rules: {
    "unicorn/no-null": "off", // Override specific rules
  },
});
```

### With Bun

Add `Bun` global:

```js
import modernConfig from "eslint-config-modern-ts";

export default [
  ...modernConfig(),
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
- No deep nesting (max 3 levels)
- No `any` type
- No non-null assertions (`!`)

## License

MIT
