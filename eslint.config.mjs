import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Components and pages ask the project layer (src/lib/projects.ts);
  // only the data and lib layers read the project data itself.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/**", "src/data/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "(^|/)data/projects(\\.ts)?$",
              message:
                "Read projects through the project layer (@/lib/projects), not the data file.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "out-ended/**",
    "out-featured/**",
    "build/**",
    "next-env.d.ts",
    // Claude Code's worktrees hold whole checkouts with their own builds.
    ".claude/**",
  ]),
]);

export default eslintConfig;
