import sass from "sass";
import * as sassEmbedded from "sass-embedded";
import { getImplementation } from "../../lib/implementations";

describe("getImplementation", () => {
  it("returns the correct implementation when explicitly passed", () => {
    expect(getImplementation("sass")).toEqual(sass);
    expect(getImplementation("sass-embedded")).toEqual(sassEmbedded);
  });

  it("returns the correct default implementation if undefined", () => {
    expect(getImplementation(undefined)).toEqual(sass);
    expect(getImplementation()).toEqual(sass);
  });

  it("returns the correct default implementation if it is invalid", () => {
    const fakeImplementation = "bob-sass";

    expect(() => getImplementation(fakeImplementation)).toThrow(
      new Error(`'${fakeImplementation}' Implementation is not supported`)
    );
  });
});
