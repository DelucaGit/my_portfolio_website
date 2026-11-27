import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Components and pages ask the project layer (src/lib/projects.ts);
  // only the data and lib layers read the project data itself, and the
  // project layer's own modules stay behind @/lib/projects.
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
            {
              regex:
                "(^|/)lib/(case-page|project-files|build-inputs|site-check|adjacent)(\\.ts)?$",
              message:
                "This module is part of the project layer: import it through @/lib/projects.",
            },
          ],
        },
      ],
    },
  },
  // The data layer is plain content: it imports only other data files.
  {
    files: ["src/data/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "(^@/|\\.\\./)(lib|components|app)(/|$)",
              message:
                "src/data holds content only: build links and derived values in src/lib.",
            },
          ],
        },
      ],
    },
  },
  // The lib layer sits under the components: it never imports them.
  {
    files: ["src/lib/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "(^@/|\\.\\./)(components|app)(/|$)",
              message:
                "src/lib must not depend on components or pages: move the shared type into src/lib.",
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
