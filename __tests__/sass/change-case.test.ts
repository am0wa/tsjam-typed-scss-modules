import { camelCase, camelCaseTransformMerge, paramCase } from "change-case";

describe("change-case v4 consistency", () => {
  it("check deprecated camelCaseTransformMerge behaviour", () => {
    expect(camelCase("two words")).toEqual("twoWords");
    expect(
      camelCase("version 12", { transform: camelCaseTransformMerge })
    ).toEqual("version12");
  });
  it("check deprecated paramCase behaviour", () => {
    expect(paramCase("two words")).toEqual("two-words");
    expect(paramCase("version 12")).toEqual("version-12");
  });
});
