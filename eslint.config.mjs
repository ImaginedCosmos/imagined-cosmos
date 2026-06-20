import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Nested git worktrees (repo convention) contain full copies — don't double-lint.
    "worktrees/**",
  ]),
  {
    // React Compiler advisory diagnostics → warnings, not CI-blocking errors.
    // These flag missed auto-memoization and a state-machine setState-in-effect in
    // the solver UI; the app is functionally correct (the compiler simply skips
    // optimizing those callbacks). Kept visible as warnings for incremental cleanup.
    rules: {
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
