// @ts-check
import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReactCompiler from "eslint-plugin-react-compiler";
import tailwind from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";

// まだFlatConfigに対応していないライブラリはflatCompatで対応する
const flatCompat = new FlatCompat();

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // next/core-web-vitalsはFlatConfig未対応 2024/11/08
  ...fixupConfigRules(flatCompat.extends("next/core-web-vitals")),
  {
    plugins: {
      "react-compiler": pluginReactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "warn",
    },
  },
  ...tailwind.configs["flat/recommended"],
  // @ts-expect-error 厳密な形になってなくてエラーになるため、ここだけ無効化
  eslintConfigPrettier,
);
