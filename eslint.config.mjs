import jamEslint from "@tsjam/eslint-config-recommended";
import pluginJest from "eslint-plugin-jest";

console.info("Linting..🕵️", "https://eslint.org/docs/latest", pluginJest);

/**
 * @see https://typescript-eslint.io/users/configs/#recommended
 */
export default [
  {
    // https://eslint.org/docs/latest/use/configure/ignore
    ignores: [
      "node_modules",
      "lib",
      "dist",
      ".webpack",
      "**/*.d.ts",
      "*.config.js",
      "*.config.mjs",
      "**/typed-scss-modules.config.js",
      "examples",
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2020,
        sourceType: "module",
        globals: pluginJest.environments.globals,
      },
    },
    plugins: { jest: pluginJest },
  },
  ...jamEslint.configs.recommendedTS,
  {
    rules: {
      // ---- disable for TSX - apply only for TS later ----
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/consistent-type-assertions": "off",
    },
  },
  {
    // https://typescript-eslint.io/rules/explicit-function-return-type/
    files: ["**/*.test.ts"],
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/consistent-test-it": ["error", { fn: "it" }],
    },
  },
];
