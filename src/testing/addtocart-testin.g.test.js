// cart-testing.spec.js

import { test, expect } from '@playwright/test';

test.describe('Cart Section End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set dummy cart data in localStorage.
    const dummyCart = {
      items: [
        {
          productId: '1',
          productName: 'Test Product',
          price: 10.00,
          quantity: 2,
          productImage: 'https://via.placeholder.com/150'
        },
        {
          productId: '2',
          productName: 'Second Product',
          price: 20.00,
          quantity: 1,
          productImage: 'https://via.placeholder.com/150'
        }
      ]
    };

    await page.addInitScript(cart => {
      window.localStorage.setItem('cart', JSON.stringify(cart));
    }, dummyCart);

    // Navigate to the cart page.
    await page.goto('http://localhost:5173/cart');
  });

  test('should navigate to order page when clicking Proceed to Order', async ({ page }) => {
    // Click the "Proceed to Order" button.
    await page.click('button:has-text("Proceed to Order")');
    // Wait for navigation to the order page (assumed to contain "/customer/order" in the URL).
    await page.waitForURL('**/customer/order');
    expect(page.url()).toContain('/customer/order');
  });
});
