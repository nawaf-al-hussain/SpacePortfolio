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
    // Static assets (incl. vendored draco decoder)
    "public/**",
  ]),
  {
    // react-three-fiber's useFrame idiom mutates three.js objects
    // (materials, uniforms, matrices) every frame by design — React
    // Compiler immutability rules don't apply to the canvas layer.
    files: ["src/components/canvas/**/*.tsx"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
