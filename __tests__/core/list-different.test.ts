import { listDifferent } from "../../lib/core/index.js";

//describeAllImplementations((implementation) => {
describe("listDifferent", () => {
  let exit: jest.SpyInstance;
  let alertSpy: jest.SpyInstance;
  const implementation = "sass";

  beforeEach(() => {
    alertSpy = jest.spyOn(console, "log");
    exit = jest.spyOn(process, "exit").mockImplementation();
  });

  afterEach(() => {
    exit.mockRestore();
  });

  it("logs invalid type definitions and exits with 1", async () => {
    const pattern = `${__dirname}/../**/*.scss`;

    await listDifferent(pattern, {
      banner: "",
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      exportTypeName: "ClassNames",
      exportTypeInterface: "Styles",
      listDifferent: true,
      aliases: {
        "~fancy-import": "complex",
        "~another": "style",
      },
      aliasPrefixes: {
        "~": "nested-styles/",
      },
      ignore: [],
      implementation: "sass",
      quoteType: "single",
      updateStaleOnly: false,
      logLevel: "verbose",
      outputFolder: null,
      allowArbitraryExtensions: false,
    });

    expect(exit).toHaveBeenCalledWith(1);
    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining(`[INVALID TYPES] Check type definitions for`)
    );
    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining(`invalid.scss`)
    );
  });

  it("logs nothing and does not exit when formatted using Prettier", async () => {
    const pattern = `${__dirname}/list-different/formatted.scss`;

    await listDifferent(pattern, {
      banner: "",
      watch: false,
      ignoreInitial: false,
      exportType: "default",
      exportTypeName: "ClassNames",
      exportTypeInterface: "Styles",
      listDifferent: true,
      ignore: [],
      implementation,
      quoteType: "double",
      updateStaleOnly: false,
      logLevel: "verbose",
      nameFormat: ["kebab"],
      outputFolder: null,
      allowArbitraryExtensions: false,
    });

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Only 1 file found for`)
    );
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(exit).not.toHaveBeenCalled();
  });

  it("logs nothing and does not exit if all files are valid", async () => {
    const pattern = `${__dirname}/../dummy-styles/**/style.scss`;

    await listDifferent(pattern, {
      banner: "",
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      exportTypeName: "ClassNames",
      exportTypeInterface: "Styles",
      listDifferent: true,
      ignore: [],
      implementation,
      quoteType: "single",
      updateStaleOnly: false,
      logLevel: "verbose",
      outputFolder: null,
      allowArbitraryExtensions: false,
    });

    expect(exit).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("logs not generated type file and exits with 1", async () => {
    const pattern = `${__dirname}/list-different/no-generated.scss`;

    await listDifferent(pattern, {
      banner: "",
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      exportTypeName: "ClassNames",
      exportTypeInterface: "Styles",
      listDifferent: true,
      ignore: [],
      implementation,
      quoteType: "single",
      updateStaleOnly: false,
      logLevel: "verbose",
      outputFolder: null,
      allowArbitraryExtensions: false,
    });

    expect(exit).toHaveBeenCalledWith(1);
    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `[INVALID TYPES] Type file needs to be generated for`
      )
    );
    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining(`no-generated.scss`)
    );
  });

  it("ignores ignored files", async () => {
    const pattern = `${__dirname}/list-different/no-generated.scss`;

    await listDifferent(pattern, {
      banner: "",
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      exportTypeName: "ClassNames",
      exportTypeInterface: "Styles",
      listDifferent: true,
      ignore: ["**/no-generated.scss"],
      implementation,
      quoteType: "single",
      updateStaleOnly: false,
      logLevel: "verbose",
      outputFolder: null,
      allowArbitraryExtensions: false,
    });

    expect(exit).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining(`No files found`)
    );
  });
});
//});
