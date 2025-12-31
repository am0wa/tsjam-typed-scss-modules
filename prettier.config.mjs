console.log("Prettier config loaded. ✨");

const config = {
  $schema: "http://json.schemastore.org/prettierrc",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  plugins: ["prettier-plugin-organize-imports"],
};

export default config;
