import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { usePage } from '@inertiajs/vue3';
import { useLocalizer } from '../src/useLocalizer';

// Mock usePage
vi.mock('@inertiajs/vue3', () => ({
  usePage: vi.fn(),
}));

describe('useLocalizer', () => {
  beforeEach(() => {
    // Setup default mock
    const mockPage = {
      component: 'Test',
      props: {
        locale: {
          current: 'en',
          dir: 'ltr' as const,
          available: {
            en: { label: 'English', flag: '🇺🇸', dir: 'ltr' as const },
            bn: { label: 'বাংলা', flag: '🇧🇩', dir: 'ltr' as const },
          },
        },
      },
      rememberedState: {},
      scrollRegions: [],
      url: '',
      version: null,
    };

    (usePage as any).mockReturnValue(mockPage);

    // Mock window translations
    (window as any).localizer = {
      translations: {
        en: {
          welcome: 'Welcome',
          'validation.required': 'This field is required',
          'greeting.hello': 'Hello :name!',
          'items.count': 'You have :count items',
        },
        bn: {
          welcome: 'স্বাগতম',
          'validation.required': 'এই ক্ষেত্রটি আবশ্যক',
        },
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (window as any).localizer;
  });

  describe('Basic Translation', () => {
    it('should return translated string for a valid key', () => {
      const { __ } = useLocalizer();

      expect(__('welcome')).toBe('Welcome');
    });

    it('should return the key if translation is not found', () => {
      const { __ } = useLocalizer();

      expect(__('missing.key')).toBe('missing.key');
    });

    it('should support nested keys with dot notation', () => {
      const { __ } = useLocalizer();

      expect(__('validation.required')).toBe('This field is required');
    });
  });

  describe('Placeholder Replacement', () => {
    it('should replace placeholders with :placeholder format', () => {
      const { __ } = useLocalizer();

      expect(__('greeting.hello', { name: 'John' })).toBe('Hello John!');
    });

    it('should replace multiple placeholders', () => {
      const { __ } = useLocalizer();

      expect(__('items.count', { count: 5 })).toBe('You have 5 items');
    });

    it('should handle numeric replacements', () => {
      const { __ } = useLocalizer();

      expect(__('items.count', { count: 0 })).toBe('You have 0 items');
    });
  });

  describe('Fallback', () => {
    it('should use fallback if translation key is missing', () => {
      const { __ } = useLocalizer();

      expect(__('missing.key', {}, 'Default text')).toBe('Default text');
    });

    it('should not use fallback if translation exists', () => {
      const { __ } = useLocalizer();

      expect(__('welcome', {}, 'Fallback')).toBe('Welcome');
    });
  });

  describe('Aliases', () => {
    it('trans should work as alias for __', () => {
      const { __, trans } = useLocalizer();

      expect(trans('welcome')).toBe('Welcome');
      expect(trans('welcome')).toBe(__('welcome'));
    });

    it('lang should work as alias for __', () => {
      const { __, lang } = useLocalizer();

      expect(lang('welcome')).toBe('Welcome');
      expect(lang('welcome')).toBe(__('welcome'));
    });
  });

  describe('has() method', () => {
    it('should return true for existing keys', () => {
      const { has } = useLocalizer();

      expect(has('welcome')).toBe(true);
      expect(has('validation.required')).toBe(true);
    });

    it('should return false for missing keys', () => {
      const { has } = useLocalizer();

      expect(has('missing.key')).toBe(false);
    });
  });

  describe('choice() method', () => {
    it('should include count in replacements', () => {
      const { choice } = useLocalizer();

      expect(choice('items.count', 5)).toBe('You have 5 items');
    });

    it('should merge count with other replacements', () => {
      (window as any).localizer.translations.en['user.items'] = ':name has :count items';

      const { choice } = useLocalizer();

      expect(choice('user.items', 3, { name: 'Alice' })).toBe('Alice has 3 items');
    });
  });

  describe('Locale Information', () => {
    it('should return current locale as ComputedRef', () => {
      const { locale } = useLocalizer();

      expect(locale.value).toBe('en');
    });

    it('should return text direction as ComputedRef', () => {
      const { dir } = useLocalizer();

      expect(dir.value).toBe('ltr');
    });

    it('should handle RTL locales', () => {
      const mockPage = {
        component: 'Test',
        props: {
          locale: { current: 'ar', dir: 'rtl' as const, available: {} },
        },
        rememberedState: {},
        scrollRegions: [],
        url: '',
        version: null,
      };

      (usePage as any).mockReturnValue(mockPage);

      const { dir } = useLocalizer();

      expect(dir.value).toBe('rtl');
    });

    it('should return available locales as ComputedRef', () => {
      const { availableLocales } = useLocalizer();

      expect(availableLocales.value).toEqual({
        en: { label: 'English', flag: '🇺🇸', dir: 'ltr' },
        bn: { label: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
      });
    });
  });

  describe('getLocales() method', () => {
    it('should return array of locale codes', () => {
      const { getLocales } = useLocalizer();

      expect(getLocales()).toEqual(['en', 'bn']);
    });

    it('should return empty array if no locales available', () => {
      const mockPage = {
        component: 'Test',
        props: {
          locale: {
            current: 'en',
            dir: 'ltr' as const,
          },
        },
        rememberedState: {},
        scrollRegions: [],
        url: '',
        version: null,
      };

      (usePage as any).mockReturnValue(mockPage);

      const { getLocales } = useLocalizer();

      expect(getLocales()).toEqual([]);
    });
  });

  describe('Translations object', () => {
    it('should expose all translations as ComputedRef', () => {
      const { translations } = useLocalizer();

      expect(translations.value).toEqual({
        welcome: 'Welcome',
        'validation.required': 'This field is required',
        'greeting.hello': 'Hello :name!',
        'items.count': 'You have :count items',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing locale prop', () => {
      const mockPage = {
        component: 'Test',
        props: {},
        rememberedState: {},
        scrollRegions: [],
        url: '',
        version: null,
      };

      (usePage as any).mockReturnValue(mockPage);

      const { locale, dir } = useLocalizer();

      expect(locale.value).toBe('en'); // Default
      expect(dir.value).toBe('ltr'); // Default
    });

    it('should handle missing translations gracefully', () => {
      delete (window as any).localizer;

      const { translations } = useLocalizer();

      expect(translations.value).toEqual({});
    });

    it('should handle empty string replacements', () => {
      const { __ } = useLocalizer();

      expect(__('greeting.hello', { name: '' })).toBe('Hello !');
    });

    it('should handle undefined replacements', () => {
      const { __ } = useLocalizer();

      expect(__('greeting.hello', undefined)).toBe('Hello :name!');
    });
  });

  describe('Reactivity', () => {
    it('should provide reactive computed refs', () => {
      const { locale, dir, translations, availableLocales } = useLocalizer();

      // All should be ComputedRefs
      expect(locale.value).toBeDefined();
      expect(dir.value).toBeDefined();
      expect(translations.value).toBeDefined();
      expect(availableLocales.value).toBeDefined();
    });
  });
});
