import fs from "fs";
import { dirname, join as joinPath } from "path";

export const ESM_TS_JS_TRANSFORM_PATTERN = "^.+\\.m?[tj]sx?$";

const __dirname = dirname(import.meta.filename);
/**
 * @param {string} name
 * @returns {string}
 */
export const joinLocalPath = (name) => joinPath(__dirname, name);

console.log("Jest ESM!! Windmills...");

const config = {
  clearMocks: true,
  testMatch: ["**/__tests__/**/*.test.ts"],
  extensionsToTreatAsEsm: [".mts", ".ts", ".tsx"],
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  moduleDirectories: ["node_modules", "src", "__tests__"],
  resolver: "ts-jest-resolver",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    [ESM_TS_JS_TRANSFORM_PATTERN]: [
      "@swc/jest",
      JSON.parse(fs.readFileSync(joinLocalPath(".swcrc"), "utf-8")),
    ],
  },
};

export default config;
