import baseConfig from "@tsjam/swc-jest-config-recommended/jest.config.mjs";

console.log("Jest SWC ESM!! Windmills...");

const config = {
  ...baseConfig,
  clearMocks: true,
  testMatch: ["**/__tests__/**/*.test.ts"],
};

export default config;
