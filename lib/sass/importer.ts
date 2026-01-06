// import { Importer as ModernImporter } from "sass-embedded";
import type { FileImporter, PromiseOr, Importer as SassImporter } from "sass";
import { pathToFileURL } from "url";

export type SyncMode = "sync" | "async";
type Importer<TSync extends SyncMode = "sync"> =
  | SassImporter<TSync>
  | FileImporter<TSync>;

type AsyncImporter = Importer<"async">;

export type { AsyncImporter as SASSAsyncImporter, Importer as SASSImporter };

export interface Aliases {
  [index: string]: string;
}

interface AliasImporterOptions {
  aliases: Aliases;
  aliasPrefixes: Aliases;
}

/**
 * Construct a SASS importer to create aliases for imports.
 */
export const aliasResolver =
  ({ aliases, aliasPrefixes }: AliasImporterOptions) =>
  (url: string) => {
    if (url in aliases) {
      return aliases[url];
    }

    const prefixMatch = Object.keys(aliasPrefixes).find((prefix) =>
      url.startsWith(prefix)
    );

    if (prefixMatch) {
      return aliasPrefixes[prefixMatch] + url.substr(prefixMatch.length);
    }

    return null;
  };

export const aliasImporter = <TSync extends SyncMode = "sync">({
  aliases,
  aliasPrefixes,
}: AliasImporterOptions): FileImporter<TSync> => {
  const resolveFileUrl = aliasResolver({ aliases, aliasPrefixes });

  return {
    findFileUrl(url): PromiseOr<URL | null, TSync> {
      const alias = resolveFileUrl(url);
      if (!alias) return null;
      return pathToFileURL(alias) as URL;
    },
  };
};

export interface SASSImporterOptions {
  aliases?: Aliases;
  aliasPrefixes?: Aliases;
  importers?: Importer[];
}

/**
 * Construct custom SASS importers based on options.
 *
 *  - Given aliases and alias prefix options, add a custom alias importer.
 *  - Given custom SASS importer(s), append to the list of importers.
 */
export const customImporters = <TSync extends SyncMode = "sync">({
  aliases = {},
  aliasPrefixes = {},
  importers = [],
}: SASSImporterOptions): Importer<TSync>[] => {
  const bundled: Importer<TSync>[] = [
    aliasImporter<TSync>({ aliases, aliasPrefixes }),
  ];
  return bundled.concat(importers);
};
