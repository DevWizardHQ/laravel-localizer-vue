# Changelog

All notable changes to `@devwizard/laravel-localizer-vue` will be documented in this file.

## v1.0.1 - 2025-11-10

### What's Changed

- fix: bump version to 1.0.1 in package.json

**Full Changelog**: https://github.com/DevWizardHQ/laravel-localizer-vue/compare/v1.0.0...v1.0.1

## v1.0.0 - 2025-11-09

### 🎉 Initial Stable Release

This is the first stable release of Laravel Localizer Vue, providing seamless integration between Laravel translations and Vue 3 applications.

### ✨ Features

#### useLocalizer Composable

A powerful Vue 3 composable for accessing Laravel translations with full TypeScript support and reactivity:

- **Translation Functions**
  
  - `__()` - Main translation function with placeholder replacement and fallback support
  - `trans()` - Alias for `__()` (Laravel compatibility)
  - `lang()` - Alias for `__()` (Laravel compatibility)
  - `has()` - Check if translation key exists
  - `choice()` - Pluralization support with replacement variables
  
- **Reactive Locale Information**
  
  - `locale` - ComputedRef for current locale code (e.g., 'en', 'fr')
  - `dir` - ComputedRef for text direction ('ltr' or 'rtl')
  - `availableLocales` - ComputedRef for available locales with metadata
  - `translations` - ComputedRef for all translations for current locale
  

#### Placeholder Replacement

- Supports both `:placeholder` and `{placeholder}` formats
- Multiple placeholders in single string
- Numeric and string replacements
- Nested placeholder support

#### Pluralization

- Laravel-compatible pluralization format
- Support for zero, one, and many forms
- Placeholder replacement in pluralized strings
- Custom count-based rules

#### Vite Plugin

Automatic TypeScript generation with hot module replacement:

- Watches language files for changes
- Non-blocking command execution
- Configurable watch patterns
- Debug logging option
- Integrates with Laravel Artisan commands

#### Inertia.js Integration

Seamless integration with Inertia.js:

- Automatic locale detection from page props
- Reactive locale updates
- Shared locale data
- RTL support via page props

### ⚛️ Vue 3 Composition API

- Fully reactive with Vue computed refs
- Works with `<script setup>` syntax
- Composable pattern for reusability
- Automatic reactivity tracking
- No manual watchers needed

### 🎯 TypeScript Support

- Full type definitions
- IntelliSense support in IDEs
- Type-safe placeholder replacements
- Strict mode compatible
- Exported types for custom implementations
- ComputedRef types for reactive values

### 🧪 Testing

- Comprehensive test suite with Vitest
- Vue Test Utils integration
- 100% code coverage
- Mock Inertia.js integration
- Example test patterns

### 📦 Package Configuration

- ESM-only distribution (modern bundlers)
- Tree-shakeable exports
- Separate entry points for composable and Vite plugin
- Proper peer dependencies
- Side-effect free

### 🔧 Build System

- Built with tsup for optimal bundling
- Source maps for debugging
- Minified production builds
- Declaration files included

### 📚 Documentation

- Complete README with examples
- API reference
- Setup guide
- Integration examples
- TypeScript usage patterns
- Composition API examples

### 🔗 Dependencies

- Vue 3.0+ (peer dependency)
- Inertia.js v1 or v2 (peer dependency)
- Vite 5+ (peer dependency for plugin)
- `minimatch` for pattern matching in Vite plugin

### ⚡ Performance

- Computed refs for optimal reactivity
- Cached locale data
- Optimized re-renders
- Lazy evaluation

### 🎨 Developer Experience

- Hot module replacement in development
- Automatic regeneration on file changes
- Clear error messages
- Debug mode for troubleshooting
- Vue DevTools integration

### 📝 Requirements

- Node.js 16+
- Vue 3.0+
- Inertia.js v1 or v2
- Laravel Localizer backend package

### 🔄 Migration from Beta

This release consolidates all beta features into a stable API. Key changes from beta versions:

- Renamed `useTranslation` to `useLocalizer` for consistency
  
- Uses `window.localizer.translations` for global translation access
  
- Improved Vite plugin with better pattern matching
  
- Enhanced TypeScript definitions
  
- All reactive values are now ComputedRef types
  
- Proper package.json exports field
  
- Peer dependencies: Vue 3+, Inertia v1/v2, Vite 5+
  
