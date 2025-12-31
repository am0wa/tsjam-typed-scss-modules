/* eslint-env node */
export const config = {
  aliases: { "not-real": "test-value" },
  aliasPrefixes: { "also-not-real": "test-value" },
  banner: "// config file banner",
  nameFormat: "kebab",
  exportType: "default",
  silenceDeprecations: [
    "legacy-js-api",
    "import",
    "global-builtin",
    "slash-div",
    "color-functions",
    "strict-unary",
  ],
};

export default config;
