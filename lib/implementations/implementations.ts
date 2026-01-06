import sass, {
  AsyncCompiler as SassAsyncCompiler,
  Compiler as SassCompiler,
} from "sass";
import sassEmbedded, {
  AsyncCompiler as SassEmbeddedAsyncCompiler,
  Compiler as SassEmbeddedCompiler,
} from "sass-embedded";

/**
 * A list of all possible SASS package implementations that can be used to
 * perform the compilation and parsing of the SASS files. The expectation is
 * that they provide a nearly identical API so they can be swapped out but
 * all of the same logic can be reused.
 */
export const IMPLEMENTATIONS = ["sass", "sass-embedded"] as const;
export type Implementations = (typeof IMPLEMENTATIONS)[number];

export type Implementation = typeof sass | typeof sassEmbedded;

export type SyncCompiler = SassCompiler | SassEmbeddedCompiler;
export type AsyncCompiler = SassAsyncCompiler | SassEmbeddedAsyncCompiler;

/**
 * Determine which default implementation to use by checking which packages
 * are actually installed and available to use.
 *
 * @param resolver DO NOT USE - this is unfortunately necessary only for testing.
 */
export const getDefaultImplementation = (
  resolver?: RequireResolve
): Implementations => {
  let pkg: Implementations = "sass";

  try {
    resolver ? resolver("sass") : import("sass");
  } catch (error) {
    try {
      resolver ? resolver("sass-embedded") : import("sass-embedded");
      pkg = "sass-embedded";
    } catch (ignoreError) {
      pkg = "sass";
    }
  }

  return pkg;
};

/**
 * Retrieve the desired implementation.
 *
 * @param implementation the desired implementation.
 */
export const getImplementation = async (
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  implementation: Implementations | string = "sass"
): Promise<Implementation> => {
  return getImplementationAsync(implementation);
};

export const getImplementationAsync = (
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  implementation: Implementations | string = "sass"
): Promise<Implementation> => {
  if (implementation === "sass") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return import("sass");
  }
  if (implementation === "sass-embedded") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return import("sass-embedded");
  }
  throw new Error(`'${implementation}' Implementation is not supported`);
};
