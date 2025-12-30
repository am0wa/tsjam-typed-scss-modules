import { getImplementation } from "../../lib/implementations/implementations.js";

describe("getImplementation", () => {
  it("returns the correct implementation when explicitly passed", async () => {
    const sassImplementation = await getImplementation("sass");
    expect(await getImplementation("sass")).toEqual(sassImplementation);

    const sassEmbeddedImplementation = await getImplementation("sass-embedded");
    expect(await getImplementation("sass-embedded")).toEqual(
      sassEmbeddedImplementation
    );
  });

  it("returns the sass implementation by default", async () => {
    const sassImplementation = await getImplementation("sass");
    expect(await getImplementation(undefined)).toEqual(sassImplementation);
    expect(await getImplementation()).toEqual(sassImplementation);
  });

  it("returns the correct default implementation if it is invalid", async () => {
    const fakeImplementation = "bob-sass";

    await expect(() => getImplementation(fakeImplementation)).rejects.toThrow(
      new Error(`'${fakeImplementation}' Implementation is not supported`)
    );
  });
});
