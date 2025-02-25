// mainlayout-testing.spec.js

import { test, expect } from '@playwright/test';

test.describe('Main Layout End-to-End Tests', () => {
  test('should display NavBar with "Sign in" and "Join now" links when not logged in', async ({ page }) => {
    // Navigate to the homepage which uses MainLayout.
    await page.goto('http://localhost:5173/homepage');
    
    // Verify that the NavBar shows "Sign in" and "Join now" links.
    await expect(page.locator('text=Sign in')).toBeVisible();
    await expect(page.locator('text=Join now')).toBeVisible();
    
    // Also verify that footer content is visible.
    await expect(page.locator('text=Ailav.co © 2000-2023, All Rights Reserved')).toBeVisible();
  });
});
