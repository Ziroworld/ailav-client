// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/testing',  // or wherever your tests are located
  testMatch: ['**/*.test.js'], // include .js files if needed
});
