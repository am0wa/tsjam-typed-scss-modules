// import { Importer as ModernImporter } from "sass-embedded";
import type { FileImporter, PromiseOr, Importer as SassImporter } from "sass";
import { pathToFileURL } from "url";

type Importer = SassImporter<"sync"> | FileImporter<"sync">;

export type { Importer as SASSImporter };

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

export const aliasImporter = ({
  aliases,
  aliasPrefixes,
}: AliasImporterOptions): FileImporter => {
  const resolveFileUrl = aliasResolver({ aliases, aliasPrefixes });

  return {
    findFileUrl(url): PromiseOr<URL | null, "sync"> {
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
export const customImporters = ({
  aliases = {},
  aliasPrefixes = {},
  importers = [],
}: SASSImporterOptions): Importer[] => {
  const bundled: Importer[] = [aliasImporter({ aliases, aliasPrefixes })];
  return bundled.concat(importers);
};
