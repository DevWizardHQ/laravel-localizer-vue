# @devwizard/laravel-localizer-vue

[![npm version](https://img.shields.io/npm/v/@devwizard/laravel-localizer-vue.svg)](https://www.npmjs.com/package/@devwizard/laravel-localizer-vue)
[![npm downloads](https://img.shields.io/npm/dm/@devwizard/laravel-localizer-vue.svg)](https://www.npmjs.com/package/@devwizard/laravel-localizer-vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Vue 3 integration for [Laravel Localizer](https://github.com/devwizardhq/laravel-localizer) - seamlessly use Laravel translations in your Vue 3/Inertia.js applications with full TypeScript support.

## Features

- 🎨 **Vue 3 Composable** - `useLocalizer()` composable with Composition API
- 🔌 **Vite Plugin** - Auto-regenerates TypeScript translations on file changes
- 🎯 **TypeScript** - Full type safety with TypeScript support
- ⚡ **Inertia.js** - Native integration with Inertia.js page props
- 🌐 **Pluralization** - Built-in pluralization support
- 🔄 **Replacements** - Dynamic placeholder replacement
- 🌍 **RTL Support** - Automatic text direction detection
- ⚛️ **Reactive** - Fully reactive locale and direction with Vue refs
- 📦 **Tree-shakeable** - Modern ESM build

## Requirements

- Vue 3.0+
- Inertia.js v1 or v2
- Laravel Localizer backend package

## Installation

```bash
npm install @devwizard/laravel-localizer-vue
```

## Backend Setup

First, install and configure the Laravel Localizer package:

```bash
composer require devwizardhq/laravel-localizer
php artisan localizer:install
```

See the [Laravel Localizer documentation](https://github.com/devwizardhq/laravel-localizer) for complete backend setup.

## Setup

### Step 1: Generate Translation Files

First, generate TypeScript translation files from your Laravel app:

```bash
php artisan localizer:generate --all
```

This creates files like `resources/js/lang/en.ts`, `resources/js/lang/fr.ts`, etc.

### Step 2: Configure Vite Plugin

Add the Vite plugin to auto-regenerate translations when language files change.

**File: `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { laravelLocalizer } from '@devwizard/laravel-localizer-vue/vite';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.ts'],
      refresh: true,
    }),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
    laravelLocalizer({
      // Watch patterns for language file changes
      patterns: ['lang/**', 'resources/lang/**'],

      // Command to run when files change
      command: 'php artisan localizer:generate --all',

      // Enable debug logging (optional)
      debug: false,
    }),
  ],
});
```

**What it does:**

- Watches for changes in `lang/**` and `resources/lang/**`
- Automatically runs `php artisan localizer:generate --all` when files change
- Triggers HMR to reload your frontend with updated translations

### Step 3: Initialize Window Translations

Set up the global `window.localizer` object in your app entry point.

**File: `resources/js/app.ts`**

```typescript
import './bootstrap';
import '../css/app.css';

import { createApp, h, DefineComponent } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// Import all generated translation files
import * as translations from './lang';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.vue`,
      import.meta.glob<DefineComponent>('./Pages/**/*.vue')
    ),
  setup({ el, App, props, plugin }) {
    // Initialize window.localizer with translations
    if (typeof window !== 'undefined') {
      window.localizer = {
        translations,
      };
    }

    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el);
  },
  progress: {
    color: '#4B5563',
  },
});
```

**Alternative: Create a separate file**

**File: `resources/js/lang/index.ts`**

```typescript
// Export all generated translations
export * from './en';
export * from './fr';
export * from './ar';
// ... add other locales as needed
```

**File: `resources/js/app.ts`**

```typescript
import * as translations from './lang';

// ... in setup()
window.localizer = { translations };
```

### 3. Configure TypeScript (Optional)

Add types to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@devwizard/laravel-localizer-vue"]
  }
}
```

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
const itemCount = 5;
</script>

<template>
  <div>
    <!-- Supports :placeholder format -->
    <p>{{ __('greeting', { name: userName }) }}</p>
    <!-- "Hello :name!" → "Hello John!" -->

    <!-- Also supports {placeholder} format -->
    <p>{{ __('items', { count: itemCount }) }}</p>
    <!-- "You have {count} items" → "You have 5 items" -->
  </div>
</template>
```

### Pluralization

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { choice } = useLocalizer();
const count = ref(5);
</script>

<template>
  <div>
    <!-- Define in your translation file: -->
    <!-- "apples": "no apples|one apple|many apples" -->

    <p>{{ choice('apples', count) }}</p>
    <!-- count = 0: "no apples" -->
    <!-- count = 1: "one apple" -->
    <!-- count = 5: "many apples" -->

    <!-- With replacements -->
    <p>{{ choice('apples', count, { count }) }}</p>
    <!-- "You have {count} apples" → "You have 5 apples" -->
  </div>
</template>
```

### Checking Translation Existence

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { __, has } = useLocalizer();
</script>

<template>
  <div>
    <h1 v-if="has('welcome')">{{ __('welcome') }}</h1>

    <p v-if="has('custom.message')">
      {{ __('custom.message') }}
    </p>
    <p v-else>Default message</p>
  </div>
</template>
```

### With Fallback

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { __ } = useLocalizer();
</script>

<template>
  <div>
    <!-- Use fallback for missing keys -->
    <p>{{ __('might.not.exist', {}, 'Default Text') }}</p>
  </div>
</template>
```

### Locale Information (Reactive)

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { locale, dir, availableLocales } = useLocalizer();
// Note: locale and dir are ComputedRef, so use .value in script
</script>

<template>
  <div :dir="dir">
    <p>Current Locale: {{ locale }}</p>
    <p>Text Direction: {{ dir }}</p>

    <select :value="locale">
      <option v-for="(meta, code) in availableLocales" :key="code" :value="code">
        {{ meta.flag }} {{ meta.label }}
      </option>
    </select>
  </div>
</template>
```

### RTL Support

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { __, dir } = useLocalizer();
</script>

<template>
  <div :dir="dir" :class="dir === 'rtl' ? 'text-right' : 'text-left'">
    <h1>{{ __('welcome') }}</h1>
    <p>{{ __('description') }}</p>
  </div>
</template>
```

### Accessing All Translations

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { translations } = useLocalizer();
</script>

<template>
  <div>
    <h2>All Translations:</h2>
    <pre>{{ JSON.stringify(translations, null, 2) }}</pre>
  </div>
</template>
```

## API Reference

### `useLocalizer()`

Returns an object with the following properties and methods:

| Property           | Type                                                                      | Description                     |
| ------------------ | ------------------------------------------------------------------------- | ------------------------------- |
| `__`               | `(key: string, replacements?: Replacements, fallback?: string) => string` | Main translation function       |
| `trans`            | `(key: string, replacements?: Replacements, fallback?: string) => string` | Alias for `__()`                |
| `lang`             | `(key: string, replacements?: Replacements, fallback?: string) => string` | Alias for `__()`                |
| `has`              | `(key: string) => boolean`                                                | Check if translation key exists |
| `choice`           | `(key: string, count: number, replacements?: Replacements) => string`     | Pluralization support           |
| `locale`           | `ComputedRef<string>`                                                     | Reactive current locale code    |
| `dir`              | `ComputedRef<'ltr' \| 'rtl'>`                                             | Reactive text direction         |
| `availableLocales` | `ComputedRef<Record<string, LocaleMeta>>`                                 | Reactive available locales      |
| `translations`     | `ComputedRef<Record<string, string>>`                                     | Reactive all translations       |

**Note:** Unlike React, `locale`, `dir`, `availableLocales`, and `translations` are `ComputedRef` values, making them fully reactive in Vue.

### Vite Plugin Options

```typescript
interface LocalizerOptions {
  // Watch patterns for language file changes
  patterns?: string[]; // default: ['lang/**', 'resources/lang/**']

  // Command to run when files change
  command?: string; // default: 'php artisan localizer:generate --all'

  // Enable debug logging
  debug?: boolean; // default: false
}
```

## TypeScript Support

The package is written in TypeScript and provides full type definitions:

```typescript
import {
  useLocalizer,
  UseLocalizerReturn,
  Replacements,
  LocaleData,
  PageProps,
} from '@devwizard/laravel-localizer-vue';

// All types are available for import
```

## Testing

The package includes comprehensive tests using Vitest:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Examples

### Language Switcher

```vue
<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { locale, availableLocales } = useLocalizer();

const changeLocale = (newLocale: string) => {
  router.visit(route('locale.switch', { locale: newLocale }), {
    preserveScroll: true,
    preserveState: true,
  });
};
</script>

<template>
  <select :value="locale" @change="changeLocale($event.target.value)">
    <option v-for="(meta, code) in availableLocales" :key="code" :value="code">
      {{ meta.flag }} {{ meta.label }}
    </option>
  </select>
</template>
```

### Form Validation

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';
import { useForm } from '@inertiajs/vue3';

const { __ } = useLocalizer();

const form = useForm({
  email: '',
  password: '',
});

const submit = () => {
  form.post('/login');
};
</script>

<template>
  <form @submit.prevent="submit">
    <div>
      <label>{{ __('auth.email') }}</label>
      <input v-model="form.email" type="email" required />
      <span v-if="form.errors.email" class="error">
        {{ form.errors.email }}
      </span>
    </div>

    <div>
      <label>{{ __('auth.password') }}</label>
      <input v-model="form.password" type="password" required />
      <span v-if="form.errors.password" class="error">
        {{ form.errors.password }}
      </span>
    </div>

    <button type="submit" :disabled="form.processing">
      {{ __('auth.login') }}
    </button>
  </form>
</template>
```

### Composition API with Reactive Locale

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { __, locale, dir } = useLocalizer();

// locale and dir are reactive, so this will update automatically
const greeting = computed(() => {
  return __('greeting', { locale: locale.value });
});

const containerClass = computed(() => ({
  'text-right': dir.value === 'rtl',
  'text-left': dir.value === 'ltr',
}));
</script>

<template>
  <div :class="containerClass">
    <h1>{{ greeting }}</h1>
    <p>Direction: {{ dir }}</p>
  </div>
</template>
```

## Complete Working Example

Here's a full example of a multilingual user dashboard:

**Backend: `lang/en.json`**

```json
{
  "welcome": "Welcome",
  "dashboard": "Dashboard",
  "greeting": "Hello, :name!",
  "notifications": "You have :count notifications"
}
```

**Backend: `lang/en/dashboard.php`**

```php
<?php

return [
    'title' => 'User Dashboard',
    'stats' => [
        'users' => '{0} No users|{1} One user|[2,*] :count users',
        'posts' => 'You have :count posts',
    ],
];
```

**Generate translations:**

```bash
php artisan localizer:generate --all
```

**Frontend: `resources/js/Pages/Dashboard.vue`**

```vue
<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { useLocalizer } from '@devwizard/laravel-localizer-vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { PageProps } from '@/types';

interface DashboardProps extends PageProps {
  stats: {
    users: number;
    posts: number;
    notifications: number;
  };
}

const props = defineProps<DashboardProps>();
const { __, choice, locale, dir } = useLocalizer();
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        {{ __('dashboard.title') }}
      </h2>
    </template>

    <Head :title="__('dashboard')" />

    <div class="py-12" :dir="dir">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div class="p-6 text-gray-900">
            <!-- Greeting with replacement -->
            <h1 class="text-2xl font-bold mb-4">
              {{ __('greeting', { name: auth.user.name }) }}
            </h1>

            <!-- Notification count -->
            <p class="mb-4">
              {{ __('notifications', { count: stats.notifications }) }}
            </p>

            <!-- Statistics with pluralization -->
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-blue-50 rounded">
                <h3 class="font-semibold">Users</h3>
                <p>{{ choice('dashboard.stats.users', stats.users, { count: stats.users }) }}</p>
              </div>

              <div class="p-4 bg-green-50 rounded">
                <h3 class="font-semibold">Posts</h3>
                <p>{{ __('dashboard.stats.posts', { count: stats.posts }) }}</p>
              </div>
            </div>

            <!-- Locale info -->
            <div class="mt-4 text-sm text-gray-500">
              <p>Current locale: {{ locale }}</p>
              <p>Text direction: {{ dir }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
```

**Language Switcher Component:**

```vue
<script setup lang="ts">
import { useLocalizer } from '@devwizard/laravel-localizer-vue';

const { locale, availableLocales } = useLocalizer();

const switchLocale = (newLocale: string) => {
  // Simple page reload with locale parameter
  window.location.href = `${window.location.pathname}?locale=${newLocale}`;
};
</script>

<template>
  <div class="relative">
    <select
      :value="locale"
      @change="switchLocale(($event.target as HTMLSelectElement).value)"
      class="block w-full px-3 py-2 border border-gray-300 rounded-md"
    >
      <option v-for="(meta, code) in availableLocales" :key="code" :value="code">
        {{ meta.flag }} {{ meta.label }}
      </option>
    </select>
  </div>
</template>
```

**What happens:**

1. User changes locale in dropdown
2. Page reloads with `?locale=fr` parameter
3. Laravel middleware detects locale and updates session
4. Vue components re-render with new translations
5. Text direction automatically adjusts for RTL languages

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for recent changes.

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

## Related Packages

- [Laravel Localizer](https://github.com/devwizardhq/laravel-localizer) - Backend package
- [@devwizard/laravel-localizer-react](https://www.npmjs.com/package/@devwizard/laravel-localizer-react) - React integration

## Credits

- [IQBAL HASAN](https://github.com/iqbalhasandev)
- [All Contributors](../../contributors)
