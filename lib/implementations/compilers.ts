import { alerts } from "../core/index.js";
import type {
  AsyncCompiler,
  Implementation,
  Implementations,
  SyncCompiler,
} from "./implementations.js";

const cache: {
  syncCompiler?: SyncCompiler;
  asyncCompiler?: Promise<AsyncCompiler>;
} = {};

export const disposeAllCompilers = async () => {
  // Cleanup of any cached compilers
  cache.syncCompiler?.dispose();
  cache.syncCompiler = undefined;

  if (cache.asyncCompiler) {
    const asyncCompiler = await cache.asyncCompiler;
    await asyncCompiler?.dispose();
    cache.asyncCompiler = undefined;
  }
};

process.on("SIGINT", async () => {
  await disposeAllCompilers();
  process.exit(0);
});

type ImplementationDetails = {
  implementation: Implementations;
  root: Implementation;
};

export const getSyncCompiler = ({
  root,
  implementation,
}: ImplementationDetails): SyncCompiler | Pick<Implementation, "compile"> => {
  /* When calling the compile functions multiple times, using a compiler instance with the sass-embedded npm package
  is much faster than using the top-level compilation methods or the sass npm package */
  const useCompilerInstance = implementation === "sass-embedded";
  if (!useCompilerInstance) {
    return root;
  }
  if (cache.syncCompiler) {
    return cache.syncCompiler;
  }
  cache.syncCompiler = root.initCompiler();
  alerts.info(
    `Using '${implementation}' Sync compiler instance for improved performance.`
  );
  return cache.syncCompiler;
};

/**
 * When calling the compile functions multiple times, using a compiler instance with the sass-embedded npm package
 * is much faster than using the top-level compilation methods or the sass npm package.
 * @see https://sass-lang.com/documentation/js-api/functions/initasynccompiler/
 */
export const getAsyncCompiler = ({
  root,
  implementation,
}: ImplementationDetails): Promise<
  AsyncCompiler | Pick<Implementation, "compileAsync">
> => {
  /* When calling the compile functions multiple times, using a compiler instance with the sass-embedded npm package
  is much faster than using the top-level compilation methods or the sass npm package */
  const useCompilerInstance = implementation === "sass-embedded";
  if (!useCompilerInstance) {
    return Promise.resolve(root);
  }
  if (cache.asyncCompiler) {
    return cache.asyncCompiler;
  }
  cache.asyncCompiler = root.initAsyncCompiler();
  alerts.info(
    `Using '${implementation}' Async compiler instance for improved performance.`
  );
  return cache.asyncCompiler;
};
