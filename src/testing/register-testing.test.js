// register-testing.spec.js

import { test, expect } from '@playwright/test';

test.describe('Register Section End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept the registration API call and return a dummy successful response.
    await page.route('http://localhost:8080/api/V3/auth/register', async route => {
      const request = route.request();
      const postData = await request.postDataJSON();
      // For testing purposes, always return a successful response.
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'dummyToken'
        }),
      });
    });

    // Navigate to the registration page.
    await page.goto('http://localhost:5173/auth/register');
  });

  test('should successfully register and redirect to homepage', async ({ page }) => {
    // Fill in the registration form with valid data.
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="username"]', 'johndoe');
    await page.fill('input[name="email"]', 'johndoe@example.com');
    await page.fill('input[name="phone"]', '+1 (555) 123-4567');
    await page.fill('input[name="age"]', '30');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    // Submit the registration form.
    await page.click('button[type="submit"]');
    // Wait for redirection (assuming homepage URL contains /homepage).
    await page.waitForURL('**/homepage');
    // Verify that the URL contains /homepage.
    expect(page.url()).toContain('/homepage');
  });

  test('should display validation errors when required fields are missing or invalid', async ({ page }) => {
    // Submit the registration form without filling any fields.
    await page.click('button[type="submit"]');
    // Expect validation error messages to be visible.
    await expect(page.locator('text=Full name is required')).toBeVisible();
    await expect(page.locator('text=Username is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Phone number is required')).toBeVisible();
    await expect(page.locator('text=Age is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });
});
