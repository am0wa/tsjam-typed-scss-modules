import { getDefaultImplementation } from "../../lib/implementations/implementations.js";

describe("getDefaultImplementation", () => {
  it("returns sass by default", () => {
    expect(getDefaultImplementation()).toBe("sass");
  });

  it("returns sass if it exists", () => {
    expect(getDefaultImplementation()).toBe("sass");
  });

  it("returns sass if sass-embedded does not exist", () => {
    const resolver = jest.fn((implementation) => {
      if (implementation === "sass") {
        throw new Error("Not Found");
      }
    }) as unknown as RequireResolve;

    expect(getDefaultImplementation(resolver)).toBe("sass-embedded");
    expect(resolver).toHaveBeenCalledTimes(2);
    expect(resolver).toHaveBeenNthCalledWith(1, "sass");
    expect(resolver).toHaveBeenNthCalledWith(2, "sass-embedded");
  });

  it("returns sass even if both sass and sass-embedded do not exist", () => {
    const resolver = jest.fn(() => {
      throw new Error("Not Found");
    }) as unknown as RequireResolve;

    expect(getDefaultImplementation(resolver)).toBe("sass");
    expect(resolver).toHaveBeenCalledTimes(2);
    expect(resolver).toHaveBeenNthCalledWith(2, "sass-embedded");
  });
});
