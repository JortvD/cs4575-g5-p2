import globals from "globals";
import pluginJs from "@eslint/js";
import plugin from "../plugin/index.js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: globals.browser }},
  {
    plugins: {
      "sustainable-eslint-plugin": plugin,
    },
    rules: {
      "sustainable-eslint-plugin/test": "error",
      "sustainable-eslint-plugin/propose-document-fragment": "error",
    }
  }
];