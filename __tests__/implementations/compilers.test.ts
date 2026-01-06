import { AsyncCompiler } from "sass";
import {
  disposeAllCompilers,
  getAsyncCompiler,
  getSyncCompiler,
  type Implementation,
  type SyncCompiler,
} from "../../lib/implementations/index.js";

describe("get compilers", () => {
  let mock: Partial<Implementation>;
  let syncCompiler: SyncCompiler;
  let asyncCompiler: AsyncCompiler;

  beforeEach(() => {
    syncCompiler = {
      compile: jest.fn(),
      compileString: jest.fn(),
      dispose: jest.fn(),
    };
    asyncCompiler = {
      compileAsync: jest.fn(),
      compileStringAsync: jest.fn(),
      dispose: jest.fn(),
    };
    mock = {
      initCompiler: jest.fn().mockReturnValue(syncCompiler),
      initAsyncCompiler: jest
        .fn()
        .mockReturnValue(Promise.resolve(asyncCompiler)),
      compile: jest.fn(),
      compileString: jest.fn(),
      compileAsync: jest.fn(),
      compileStringAsync: jest.fn(),
    };
  });
  afterEach(() => {
    disposeAllCompilers(); // cleanup after each test
  });
  it("should return root by default for sass", async () => {
    const iml = {
      root: mock as Implementation,
      implementation: "sass" as const,
    };
    expect(getSyncCompiler(iml)).toBe(iml.root);
    expect(await getAsyncCompiler(iml)).toBe(iml.root);
  });
  it("should return sync compiler instance singleton for sass-embedded", () => {
    const iml = {
      root: mock as Implementation,
      implementation: "sass-embedded" as const,
    };
    getSyncCompiler(iml);
    expect(getSyncCompiler(iml)).toBe(syncCompiler);
    expect(mock.initCompiler).toHaveBeenCalledTimes(1);
  });
  it("should return async compiler instance singleton for sass-embedded", async () => {
    const iml = {
      root: mock as Implementation,
      implementation: "sass-embedded" as const,
    };
    await getAsyncCompiler(iml);
    expect(await getAsyncCompiler(iml)).toBe(asyncCompiler);
    expect(mock.initAsyncCompiler).toHaveBeenCalledTimes(1);
  });
  it("should dispose all compiler instances", async () => {
    const iml = {
      root: mock as Implementation,
      implementation: "sass-embedded" as const,
    };
    getSyncCompiler(iml);
    await getAsyncCompiler(iml);
    await disposeAllCompilers();
    expect(syncCompiler.dispose).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(asyncCompiler.dispose).toHaveBeenCalled();
  });
});
