import { vi } from 'vitest';

// Mock Inertia
vi.mock('@inertiajs/vue3', () => ({
  usePage: vi.fn(),
}));

// Setup JSDOM
global.window = window;
