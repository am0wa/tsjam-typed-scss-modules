const config = {
  preset: "ts-jest/presets/default-esm",
  clearMocks: true,
  testMatch: ["**/__tests__/**/*.test.ts"],
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/node_modules/",
    "(.*).d.ts",
  ],
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\](?!bundle-require).+\\.js$",
  ],
  transform: {
    "^.+.[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "esnext",
        },
      },
    ],
  },
};

export default config;
