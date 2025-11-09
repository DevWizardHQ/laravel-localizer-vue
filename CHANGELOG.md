# Changelog

All notable changes to `@devwizard/laravel-localizer-vue` will be documented in this file.

## v0.0.7 - 2025-11-09

### 🔄 Major Update - Alignment with React Version

- **Breaking Change**: Renamed `useTranslation` to `useLocalizer` for consistency with React version
  - No backward compatibility - all imports must be updated
  - Function signature and API remain the same

- **File Structure**: Reorganized to match React package structure
  - Created `src/` directory for all source files
  - Moved `composables/useTranslation.ts` to `src/useLocalizer.ts`
  - Renamed `vite-plugin.ts` to `src/vite-plugin-laravel-localizer.ts`

- **Translation Loading**: Updated to use `window.localizer` object (consistent with React version)
  - Changed from `window.__LARAVEL_LOCALIZER_TRANSLATIONS__` to `window.localizer.translations`
  - Better integration with bootstrap.ts initialization
  - Synchronous translation loading for improved performance

- **Vite Plugin Improvements**: Updated to match React implementation
  - Simplified plugin structure using `minimatch` for pattern matching
  - Better error handling and logging
  - Non-blocking command execution
  - Changed from `watch` option to `patterns` option for consistency
  - Removed debounce functionality for faster regeneration
  - Uses `handleHotUpdate` hook instead of `configureServer`

- **Dependencies**: Added `minimatch` for glob pattern matching

- **Documentation**: Updated README to match React version structure
  - Added bootstrap.ts initialization section
  - Updated Vite plugin options documentation
  - Improved setup instructions
  - All examples now use `useLocalizer`

### 🐛 Bug Fixes

- Fixed translation initialization warnings
- Improved error messages for missing translations

---

## v0.0.1 - 2025-11-09

### 🎉 Initial Beta Release

- **useTranslation Composable**: Vue 3 Composition API for accessing Laravel translations
  - `__()` - Main translation function with replacements and fallback
  - `trans()` - Alias for `__()`
  - `lang()` - Alias for `__()`
  - `has()` - Check if translation key exists
  - `choice()` - Pluralization support
  - `locale` - Reactive current locale code (ComputedRef)
  - `dir` - Reactive text direction (ComputedRef)
  - `availableLocales` - Reactive available locales with metadata (ComputedRef)
  - `translations` - Reactive all translations for current locale (ComputedRef)

- **Vite Plugin**: Automatic TypeScript generation
  - Watches `lang/**` directory for changes
  - Debounced regeneration (300ms)
  - Runs `php artisan localizer:generate --all` automatically
  - Zero configuration required

- **TypeScript Support**: Full type safety
  - Comprehensive interfaces for all types
  - IntelliSense support in IDEs
  - Strict mode compatible

- **Inertia.js Integration**: Seamless integration with Inertia.js
  - Works with both Inertia v1 and v2
  - Supports Vue 3.0+
  - Automatic page props detection

### 📚 Documentation

- Comprehensive README with usage examples
- API documentation with TypeScript interfaces
- Migration guide from v1 to v2

### 🧪 Testing

- Vitest configuration
- Comprehensive test suite with 100% coverage
- Vue Test Utils for component testing
- ESM module support

### 🛠️ Development Tools

- ESLint configuration with TypeScript and Vue rules
- Prettier for code formatting
- tsup for building and bundling
- GitHub Actions for CI/CD

### 📦 Package Configuration

- ESM-only distribution
- Tree-shakeable exports
- Proper package.json exports field
- Peer dependencies: Vue 3+, Inertia v1/v2, Vite 5+
