# @devwizard/laravel-localizer-vue

🌍 Vue 3 integration for Laravel Localizer with Vite plugin, `useLocalizer` composable, and automatic TypeScript generation.

## Features

- ✅ **Automatic Generation**: Vite plugin watches for language file changes and regenerates TypeScript files
- ✅ **Type-Safe**: Full TypeScript support with auto-generated types
- ✅ **Vue 3 Composition API**: Intuitive `useLocalizer` composable for Vue components
- ✅ **Customizable Path**: By default reads from `@/lang` folder, customizable via options
- ✅ **Laravel-Compatible**: Matches Laravel's translation API (`__`, `trans`, `choice`)
- ✅ **Inertia.js Integration**: Seamlessly works with Inertia.js page props
- ✅ **RTL Support**: Built-in right-to-left language support
- ✅ **Zero Dependencies**: Only peer dependencies on Vue and Inertia

## Installation

```bash
npm install @devwizard/laravel-localizer-vue
# or
pnpm add @devwizard/laravel-localizer-vue
# or
yarn add @devwizard/laravel-localizer-vue
```

**Backend (Composer):**

```bash
composer require devwizardhq/laravel-localizer
php artisan localizer:install
```

The install command will:
- ✅ Publish configuration files
- ✅ Create default locale files
- ✅ Install npm package (optional)
- ✅ Generate initial TypeScript files

**Note:** You'll need to manually add the bootstrap setup (see step 1 below).

## Setup

### 1. Initialize Translations in Bootstrap

Add this to your `resources/js/bootstrap.ts`:

```typescript
import { translations } from '@/lang';

declare global {
  interface Window {
    localizer?: {
      translations: Record<string, Record<string, string>>;
    };
  }
}

window.localizer = {
  translations,
};
```

This makes translations available globally and synchronously.

### 2. Add Vite Plugin

Update your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { laravelLocalizer } from '@devwizard/laravel-localizer-vue/vite';

export default defineConfig({
  plugins: [
    vue(),
    laravelLocalizer({
      debug: true, // Enable debug logging (optional)
    }),
  ],
  resolve: {
    alias: {
      '@': '/resources/js',
    },
  },
});
```

### 3. Generate Translation Files

```bash
php artisan localizer:generate --all
```

This creates TypeScript files in `resources/js/lang/` directory.

## Usage

### Basic Usage

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { __ } = useLocalizer();
</script>

<template>
  <div>
    <h1>{{ __('welcome') }}</h1>
    <p>{{ __('validation.required') }}</p>
  </div>
</template>
```

### With Replacements

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { __ } = useLocalizer();
const userName = 'John';
</script>

<template>
  <div>
    <p>{{ __('Hello :name!', { name: userName }) }}</p>
    <!-- Output: Hello John! -->
  </div>
</template>
```

### Pluralization

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { choice } = useLocalizer();
const itemCount = ref(5);
</script>

<template>
  <p>{{ choice('items', itemCount) }}</p>
</template>
```

### RTL Support

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { dir, locale } = useLocalizer();
</script>

<template>
  <div :dir="dir" :lang="locale">
    <!-- Your app content -->
  </div>
</template>
```

### Check Translation Exists

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { __, has } = useLocalizer();
</script>

<template>
  <p v-if="has('special.message')">
    {{ __('special.message') }}
  </p>
</template>
```

### Reactive Translations

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { translations, locale } = useLocalizer();

// translations and locale are reactive ComputedRefs
// They automatically update when the locale changes
</script>

<template>
  <div>
    <p>Current locale: {{ locale }}</p>
    <p>Total translations: {{ Object.keys(translations).length }}</p>
  </div>
</template>
```

## API Reference

### `useLocalizer()`

Returns an object with the following properties and methods:

| Property           | Type                                        | Description                                    |
| ------------------ | ------------------------------------------- | ---------------------------------------------- |
| `__`               | `(key, replacements?, fallback?) => string` | Main translation function                      |
| `trans`            | `(key, replacements?, fallback?) => string` | Alias for `__`                                 |
| `lang`             | `(key, replacements?, fallback?) => string` | Alias for `__`                                 |
| `has`              | `(key) => boolean`                          | Check if translation key exists                |
| `choice`           | `(key, count, replacements?) => string`     | Pluralization support                          |
| `locale`           | `ComputedRef<string>`                       | Current locale code (reactive)                 |
| `dir`              | `ComputedRef<'ltr' \| 'rtl'>`               | Text direction (reactive)                      |
| `availableLocales` | `ComputedRef<Record<string, LocaleInfo>>`   | Available locales with metadata (reactive)     |
| `translations`     | `ComputedRef<Record<string, string>>`       | All translations for current locale (reactive) |
| `getLocales`       | `() => string[]`                            | Get all available locale codes                 |

## Vite Plugin Options

```typescript
laravelLocalizer({
  // Watch patterns for language file changes (relative to project root)
  patterns: ['lang/**', 'resources/lang/**'],

  // Command to run when lang files change
  command: 'php artisan localizer:generate --all',

  // Enable debug logging
  debug: false,
});
```

## Backend Integration

Ensure your Laravel backend passes locale data via Inertia:

```php
// In your HandleInertiaRequests middleware or controller

use Illuminate\Support\Facades\App;

Inertia::share([
    'locale' => [
        'current' => App::getLocale(),
        'dir' => in_array(App::getLocale(), ['ar', 'he', 'fa', 'ur']) ? 'rtl' : 'ltr',
        'available' => [
            'en' => ['label' => 'English', 'flag' => '🇺🇸', 'dir' => 'ltr'],
            'bn' => ['label' => 'বাংলা', 'flag' => '🇧🇩', 'dir' => 'ltr'],
            'ar' => ['label' => 'العربية', 'flag' => '🇸🇦', 'dir' => 'rtl'],
        ],
    ],
]);
```

## TypeScript Support

The package is fully typed. Generated translation files include TypeScript definitions:

```typescript
// Generated by localizer:generate
export const en = {
  welcome: 'Welcome',
  'validation.required': 'This field is required',
} as const;

export type TranslationKeys = keyof typeof en;
```

## License

MIT

## Credits

- [IQBAL HASAN](https://github.com/DevWizardHQ)
- [All Contributors](https://github.com/DevWizardHQ/laravel-localizer/contributors)

## Support

- [Documentation](https://github.com/DevWizardHQ/laravel-localizer)
- [Issues](https://github.com/DevWizardHQ/laravel-localizer/issues)
- [Discussions](https://github.com/DevWizardHQ/laravel-localizer/discussions)
