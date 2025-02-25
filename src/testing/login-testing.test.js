// login-testing.spec.js

import { test, expect } from '@playwright/test';

test.describe('Login Section End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept the login API call and return a dummy successful response.
    await page.route('http://localhost:8080/api/V3/auth/login', async route => {
      const request = route.request();
      const postData = await request.postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'dummyToken',
          role: 'customer',
          userId: 'dummyUserId',
          username: postData.username,
        }),
      });
    });

    // Intercept the current user API call.
    await page.route('http://localhost:8080/api/V3/auth/currentuser', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'dummyUserId',
          username: 'dummyUsername',
          name: 'Dummy User',
          email: 'dummy@example.com',
          phone: '1234567890',
          image: 'dummyImage.jpg',
          role: 'customer',
          createdAt: new Date().toISOString(),
        }),
      });
    });

    // Navigate to the login page on the correct frontend port.
    await page.goto('http://localhost:5173/auth/login');
  });

  test('should successfully log in and navigate to homepage', async ({ page }) => {
    // Fill in the login form.
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    // Submit the login form.
    await page.click('button[type="submit"]');
    // Wait for navigation (assuming homepage URL contains /homepage).
    await page.waitForURL('**/homepage');
    // Verify the URL contains /homepage.
    expect(page.url()).toContain('/homepage');
  });

  test('should display validation errors when login fields are empty', async ({ page }) => {
    // Submit the login form without filling fields.
    await page.click('button[type="submit"]');
    // Expect error messages to be visible.
    await expect(page.locator('text=Username is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });
});
