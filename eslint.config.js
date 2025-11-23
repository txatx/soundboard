import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import jsoncPlugin from "eslint-plugin-jsonc";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import sortPlugin from "eslint-plugin-sort";
import globals from "globals";

export default defineConfig([
  { ignores: ["dist", "node_modules"] },
  ...jsoncPlugin.configs["flat/recommended-with-jsonc"],
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module"
      }
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
      jsonc: jsoncPlugin,
      react: reactPlugin,
      sort: sortPlugin
    },
    extends: [reactPlugin.configs.flat.recommended, reactPlugin.configs.flat["jsx-runtime"]],
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx"],
          paths: ["src"],
          moduleDirectory: ["node_modules"]
        }
      },
      react: {
        version: "detect"
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "array-bracket-spacing": ["warn", "never"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "class-methods-use-this": "off",
      "comma-spacing": ["error", { before: false, after: true }],
      curly: "warn",
      "dot-location": ["error", "property"],
      "func-call-spacing": ["error", "never"],
      "import/first": "warn",
      "import/newline-after-import": "warn",
      "import/no-anonymous-default-export": "off",
      "import/no-cycle": "error",
      "import/no-extraneous-dependencies": "error",
      "import/no-mutable-exports": "error",
      "import/no-named-as-default-member": "off",
      "import/no-self-import": "error",
      "import/no-useless-path-segments": "warn",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling"]],
          "newlines-between": "always",
          warnOnUnassignedImports: false,
          alphabetize: {
            order: "asc"
          }
        }
      ],
      indent: ["error", 2, { SwitchCase: 1 }],
      "jsonc/auto": "warn",
      "jsonc/key-spacing": "warn",
      "jsx-a11y/anchor-is-valid": "off",
      "linebreak-style": ["warn", "unix"],
      "max-len": [
        "warn",
        { code: 120, ignoreComments: true, ignoreStrings: true, ignoreTemplateLiterals: true, tabWidth: 2 }
      ],
      "max-params": ["warn", 4],
      "multiline-ternary": "off",
      "no-case-declarations": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-control-regex": "off",
      "no-extra-parens": ["warn", "all", { ignoreJSX: "all", enforceForArrowConditionals: false }],
      "no-lonely-if": "warn",
      "no-loop-func": "off",
      "no-mixed-operators": "off",
      "no-param-reassign": ["error", { props: true }],
      "no-shadow": "warn",
      "no-ternary": "off",
      "no-unused-vars": "warn",
      "no-useless-concat": "warn",
      "object-shorthand": ["error", "always", { avoidQuotes: true }],
      "padded-blocks": "off",
      "prefer-const": "warn",
      "prefer-object-spread": "warn",
      "quote-props": ["warn", "as-needed"],
      quotes: ["warn", "double"],
      "react/default-props-match-prop-types": "warn",
      "react/destructuring-assignment": ["warn", "always"],
      "react/display-name": "off",
      "react/forbid-prop-types": "off",
      "react/function-component-definition": ["warn", { namedComponents: "arrow-function" }],
      "react/jsx-boolean-value": ["warn", "never"],
      "react/jsx-closing-bracket-location": "warn",
      "react/jsx-closing-tag-location": "warn",
      "react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],
      "react/jsx-handler-names": "warn",
      "react/jsx-indent-props": ["error", 2],
      "react/jsx-key": "warn",
      "react/jsx-max-depth": "off",
      "react/jsx-no-bind": ["warn", { allowArrowFunctions: true, allowFunctions: true }],
      "react/jsx-no-useless-fragment": "warn",
      "react/jsx-sort-props": ["warn", { reservedFirst: true }],
      "react/jsx-wrap-multilines": "warn",
      "react/no-multi-comp": ["error", { ignoreStateless: true }],
      "react/no-this-in-sfc": "error",
      "react/no-typos": "warn",
      "react/no-unsafe": "error",
      "react/no-unused-class-component-methods": "warn",
      "react/no-unused-prop-types": "warn",
      "react/no-unused-state": "warn",
      "react/require-default-props": "off",
      "react/self-closing-comp": "warn",
      "react/sort-comp": "warn",
      "react/sort-default-props": "warn",
      "react/sort-prop-types": "warn",
      "react/state-in-constructor": "warn",
      "react/static-property-placement": ["warn", "property assignment"],
      "sort-imports": "off",
      "sort/destructuring-properties": ["warn", { caseSensitive: false, natural: true }],
      "space-in-parens": ["error", "never"],
      yoda: "warn"
    }
  }
]);
