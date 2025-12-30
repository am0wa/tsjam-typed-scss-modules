/* eslint-env node */
const config = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  plugins: ["babel-plugin-transform-import-meta"],
};
export default config;
