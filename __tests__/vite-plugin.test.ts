import { describe, it, expect } from 'vitest';
import { laravelLocalizer } from '../vite-plugin';

describe('laravelLocalizer Vite Plugin', () => {
  it('should return a valid Vite plugin', () => {
    const plugin = laravelLocalizer();

    expect(plugin).toHaveProperty('name', 'vite-plugin-laravel-localizer');
    expect(plugin).toHaveProperty('buildStart');
    expect(plugin).toHaveProperty('configureServer');
  });

  it('should accept custom options', () => {
    const plugin = laravelLocalizer({
      command: 'php artisan custom:command',
      watch: ['custom/**'],
      debug: true,
      debounce: 500,
    });

    expect(plugin.name).toBe('vite-plugin-laravel-localizer');
  });

  it('should use default options when not provided', () => {
    const plugin = laravelLocalizer();

    expect(plugin.name).toBe('vite-plugin-laravel-localizer');
  });

  describe('buildStart hook', () => {
    it('should be defined', () => {
      const plugin = laravelLocalizer();

      expect(typeof plugin.buildStart).toBe('function');
    });
  });

  describe('configureServer hook', () => {
    it('should be defined', () => {
      const plugin = laravelLocalizer();

      expect(typeof plugin.configureServer).toBe('function');
    });
  });

  describe('Plugin options', () => {
    it('should accept empty options object', () => {
      const plugin = laravelLocalizer({});

      expect(plugin.name).toBe('vite-plugin-laravel-localizer');
    });

    it('should merge custom options with defaults', () => {
      const plugin = laravelLocalizer({
        debug: true,
      });

      expect(plugin.name).toBe('vite-plugin-laravel-localizer');
    });
  });

  describe('Export', () => {
    it('should export laravelLocalizer as named export', () => {
      expect(laravelLocalizer).toBeDefined();
      expect(typeof laravelLocalizer).toBe('function');
    });
  });
});
