/**
 * Laravel Localizer - Translation Composable for Vue 3
 *
 * This file provides Vue 3 Composition API utilities for using Laravel translations
 * in your Vue/Inertia.js application.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useTranslation } from '@devwizard/laravel-localizer-vue';
 *
 * const { __, trans, locale, dir } = useTranslation();
 * </script>
 *
 * <template>
 *   <div :dir="dir">
 *     <h1>{{ __('welcome') }}</h1>
 *     <p>{{ __('validation.required') }}</p>
 *   </div>
 * </template>
 * ```
 */

import { computed, type ComputedRef } from 'vue';
import { usePage } from '@inertiajs/vue3';

/**
 * Translation replacements
 */
export type Replacements = Record<string, string | number>;

/**
 * Locale metadata
 */
export interface LocaleData {
  current: string;
  dir: 'ltr' | 'rtl';
  available?: Record<
    string,
    {
      label: string;
      flag: string;
      dir: 'ltr' | 'rtl';
    }
  >;
}

/**
 * Page props with locale data
 */
export interface PageProps extends Record<string, unknown> {
  locale?: LocaleData;
}

/**
 * Translation composable return type
 */
export interface UseTranslationReturn {
  /**
   * Main translation function
   */
  __: (key: string, replacements?: Replacements, fallback?: string) => string;

  /**
   * Alias for __ function (Laravel compatibility)
   */
  trans: (key: string, replacements?: Replacements, fallback?: string) => string;

  /**
   * Alias for __ function (Laravel compatibility)
   */
  lang: (key: string, replacements?: Replacements, fallback?: string) => string;

  /**
   * Check if a translation key exists
   */
  has: (key: string) => boolean;

  /**
   * Get translation with pluralization support
   */
  choice: (key: string, count: number, replacements?: Replacements) => string;

  /**
   * Current locale code (reactive)
   */
  locale: ComputedRef<string>;

  /**
   * Text direction (reactive)
   */
  dir: ComputedRef<'ltr' | 'rtl'>;

  /**
   * Available locales with metadata (reactive)
   */
  availableLocales: ComputedRef<
    Record<string, { label: string; flag: string; dir: 'ltr' | 'rtl' }>
  >;

  /**
   * All translations for current locale (reactive)
   */
  translations: ComputedRef<Record<string, string>>;

  /**
   * Get all available locale codes
   */
  getLocales: () => string[];
}

/**
 * Replace placeholders in translation strings
 *
 * Supports both :placeholder and {placeholder} formats
 *
 * @example
 * replacePlaceholders('Hello :name!', { name: 'John' })
 * // Returns: "Hello John!"
 *
 * replacePlaceholders('Hello {name}!', { name: 'John' })
 * // Returns: "Hello John!"
 */
function replacePlaceholders(text: string, replacements?: Replacements): string {
  if (!replacements) return text;

  return Object.entries(replacements).reduce((result, [key, value]) => {
    // Support both :key and {key} formats
    result = result.replace(new RegExp(`:${key}\\b`, 'g'), String(value));
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    return result;
  }, text);
}

/**
 * Vue 3 composable for translations
 *
 * @returns Translation utilities and reactive locale information
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useTranslation } from '@devwizard/laravel-localizer-vue';
 *
 * const { __, trans, lang, locale, dir } = useTranslation();
 * </script>
 *
 * <template>
 *   <div :dir="dir">
 *     <h1>{{ __('welcome') }}</h1>
 *     <p>{{ trans('greeting', { name: 'John' }) }}</p>
 *     <p>{{ lang('validation.required') }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useTranslation(): UseTranslationReturn {
  const page = usePage<PageProps>();

  const locale = computed(() => page.props.locale?.current || 'en');
  const dir = computed(() => page.props.locale?.dir || 'ltr');
  const availableLocales = computed(() => page.props.locale?.available || {});

  // Dynamically import translations from generated files
  // Note: Users need to set up path alias '@/lang' -> 'resources/js/lang'
  // The actual translations object will be available at runtime
  const translations = computed<Record<string, string>>(() => {
    try {
      // This will be resolved at build time by Vite
      // The generated files are created by php artisan localizer:generate
      interface WindowWithTranslations extends Window {
        __LARAVEL_LOCALIZER_TRANSLATIONS__?: Record<string, Record<string, string>>;
      }
      return (
        (window as WindowWithTranslations).__LARAVEL_LOCALIZER_TRANSLATIONS__?.[locale.value] || {}
      );
    } catch {
      console.warn(`[Laravel Localizer] Could not load translations for locale: ${locale.value}`);
      return {};
    }
  });

  /**
   * Main translation function
   */
  const __ = (key: string, replacements?: Replacements, fallback?: string): string => {
    const text = translations.value[key] || fallback || key;
    return replacePlaceholders(String(text), replacements);
  };

  /**
   * Alias for __ function (Laravel compatibility)
   */
  const trans = __;

  /**
   * Alias for __ function (Laravel compatibility)
   */
  const lang = __;

  /**
   * Check if a translation key exists
   */
  const has = (key: string): boolean => {
    return key in translations.value;
  };

  /**
   * Get translation with pluralization support
   */
  const choice = (key: string, count: number, replacements?: Replacements): string => {
    const merged = { ...replacements, count };
    return __(key, merged);
  };

  /**
   * Get all available locale codes
   */
  const getLocales = (): string[] => {
    return Object.keys(availableLocales.value);
  };

  return {
    __,
    trans,
    lang,
    has,
    choice,
    locale,
    dir,
    availableLocales,
    translations,
    getLocales,
  };
}
