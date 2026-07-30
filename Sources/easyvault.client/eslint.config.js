import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "max-lines": [
        "error",
        { max: 400, skipBlankLines: true, skipComments: true },
      ],
      "no-console": "error",
      "no-restricted-globals": [
        "error",
        { name: "localStorage", message: "Use an application store instead." },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSUnknownKeyword",
          message: "Use a precise type instead of unknown.",
        },
        {
          selector: "TSAsExpression > TSAsExpression",
          message: "Nested type assertions are not allowed.",
        },
        {
          selector: "Literal[value=/\\d+(?:d?vh|d?vw)/i]",
          message: "Viewport sizing units are not allowed.",
        },
      ],
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: ["useAppTheme", "useVault"],
        },
      ],
    },
  },
);
