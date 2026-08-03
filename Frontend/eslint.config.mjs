import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  ...next,
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "react-compiler/react-compiler": "off",
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off"
    }
  }
]);
