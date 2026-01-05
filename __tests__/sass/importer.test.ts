import {
  aliasImporter,
  aliasResolver,
  customImporters,
  type SASSImporter,
} from "../../lib/sass/importer.js";

// SASS importers receive two other arguments that this package doesn't care about.
const contextStub = {
  fromImport: false,
  containingUrl: null,
};

const endSegments = (
  url: URL | Promise<URL | null> | null,
  segmentsN = 1
): Promise<string> | string => {
  if (url instanceof Promise) {
    return url.then((str) => endSegments(str, segmentsN));
  }
  const segments = url?.href.split("/") ?? [];
  return segments.slice(-segmentsN).join("/");
};

describe("#aliasImporter", () => {
  it("should create an importer to replace aliases and otherwise return null", () => {
    const importer = aliasImporter({
      aliases: { input: "output", "~alias": "node_modules" },
      aliasPrefixes: {},
    });

    expect(endSegments(importer.findFileUrl("input", contextStub))).toEqual(
      "output"
    );
    expect(endSegments(importer.findFileUrl("~alias", contextStub))).toEqual(
      "node_modules"
    );
    expect(importer.findFileUrl("output", contextStub)).toBeNull();
    expect(importer.findFileUrl("input-substring", contextStub)).toBeNull();
    expect(importer.findFileUrl("other", contextStub)).toBeNull();
  });

  it("should create an importer to replace alias prefixes and otherwise return null", () => {
    const importer = aliasImporter({
      aliases: {},
      aliasPrefixes: { "~": "node_modules/", abc: "def" },
    });

    expect(endSegments(importer.findFileUrl("abc-123", contextStub))).toEqual(
      "def-123"
    );
    expect(
      endSegments(importer.findFileUrl("~package", contextStub), 2)
    ).toEqual("node_modules/package");
    expect(importer.findFileUrl("output~", contextStub)).toBeNull();
    expect(importer.findFileUrl("input-substring-abc", contextStub)).toBeNull();
    expect(importer.findFileUrl("other", contextStub)).toBeNull();
  });
});

describe("#customImporters", () => {
  beforeEach(() => {
    console.log = jest.fn(); // avoid console logs showing up
  });

  it("should return only an alias importer by default", () => {
    const resolver = aliasResolver({
      aliases: { "~alias": "secret/path" },
      aliasPrefixes: { "~": "node_modules/" },
    });

    expect(resolver("~package")).toEqual("node_modules/package");
    expect(resolver("~alias")).toEqual("secret/path");
    expect(resolver("other")).toBeNull();
  });

  it("should add additional importers if passed a function", () => {
    const importer = { findFileUrl: jest.fn() };

    const importers = customImporters({
      aliases: {},
      aliasPrefixes: {},
      importers: [importer],
    });

    expect(importers).toHaveLength(2);
    expect(importers[1]).toEqual(importer);
  });

  it("should add multiple importers if passed an array", () => {
    const importer1 = jest.fn() as unknown as SASSImporter;
    const importer2 = jest.fn() as unknown as SASSImporter;
    const importer3 = jest.fn() as unknown as SASSImporter;

    const importers = customImporters({
      aliases: {},
      aliasPrefixes: {},
      importers: [importer1, importer2, importer3],
    });

    expect(importers).toHaveLength(4);
    expect(importers[1]).toEqual(importer1);
    expect(importers[2]).toEqual(importer2);
    expect(importers[3]).toEqual(importer3);
  });
});
