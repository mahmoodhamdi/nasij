import type { Locale } from './locales.js';
import type { Namespace } from './namespaces.js';

export type TranslateInput = Record<string, Record<string, string>>;

export interface TranslateOptions {
  /** Interpolation values; substituted for `{key}` placeholders. */
  vars?: Record<string, string | number>;
  /** Fallback string if the key is missing. Defaults to the key itself. */
  fallback?: string;
}

const interpolate = (template: string, vars?: Record<string, string | number>): string => {
  if (!vars) return template;
  return template.replaceAll(/\{(\w+)\}/g, (match, name: string) => {
    const value = vars[name];
    return value === undefined ? match : String(value);
  });
};

/**
 * Look up a translation key from a catalog. Returns the interpolated string,
 * the fallback, or the key itself if the catalog has no entry for it.
 *
 * The catalog shape is intentionally simple: `{ [namespace]: { [key]: string } }`.
 * Generating type-safe key unions from a canonical locale is the job of a build
 * step that consumes this catalog — see `pnpm i18n:check`.
 */
export const translate = (
  catalog: TranslateInput,
  namespace: Namespace,
  key: string,
  options: TranslateOptions = {},
): string => {
  const bucket = catalog[namespace];
  const value = bucket?.[key];
  if (value === undefined) {
    return options.fallback ?? key;
  }
  return interpolate(value, options.vars);
};

/** Type-erased helper so consumers can pass a Locale without re-declaring types. */
export const localeOf = (catalog: TranslateInput, _locale: Locale): TranslateInput => catalog;
