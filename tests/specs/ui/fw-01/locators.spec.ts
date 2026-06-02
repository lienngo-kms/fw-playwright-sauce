import Env from "settings/env/env.global";
import { expect, test } from "settings/fixtures/ui.fixture";

/**
 * fw-01 — Locator identification (Score: 10).
 *
 * Verifies each of the 10 required locators resolves the expected element(s)
 * on the SauceDemo inventory page. Locators themselves live on InventoryPage
 * (CSS + XPath strategies); these checks prove they target correctly.
 */
test.describe("fw-01 locators", () => {
    test.beforeEach(async ({ signInPage, inventoryPage }) => {
        await signInPage.login(Env.USERNAME, Env.PASSWORD);
        await inventoryPage.waitUntilLoaded();
    });

    test("1. shopping cart link is present", async ({ inventoryPage }) => {
        await expect(inventoryPage.elements.shoppingCartLink()).toHaveCount(1);
    });

    test('2. all "Add to cart" buttons (6 on initial load)', async ({ inventoryPage }) => {
        await expect(inventoryPage.elements.allAddToCartButtons()).toHaveCount(6);
    });

    test("3. sort dropdown is present", async ({ inventoryPage }) => {
        await expect(inventoryPage.elements.sortDropdown()).toHaveCount(1);
    });

    test("4. all product images (6 products)", async ({ inventoryPage }) => {
        await expect(inventoryPage.elements.allProductImages()).toHaveCount(6);
    });

    test('5. items priced "$15.99" (Bolt T-Shirt + Test.allTheThings)', async ({
        inventoryPage,
    }) => {
        await expect(inventoryPage.elements.itemsWithPrice1599()).toHaveCount(2);
    });

    test('6. "Add to cart" button for Sauce Labs Backpack', async ({ inventoryPage }) => {
        await expect(inventoryPage.elements.addBackpackButton()).toHaveCount(1);
    });

    test('7. "Remove" button appears after adding Sauce Labs Onesie', async ({ inventoryPage }) => {
        await expect(inventoryPage.elements.removeOnesieButton()).toHaveCount(0);
        await inventoryPage.addToCart("Sauce Labs Onesie");
        await expect(inventoryPage.elements.removeOnesieButton()).toHaveCount(1);
    });

    test('8. all buttons with data-test starting with "add-to-cart"', async ({ inventoryPage }) => {
        await expect(inventoryPage.elements.addToCartByDataTest()).toHaveCount(6);
    });

    test('9. product names that do NOT contain "Sauce Labs"', async ({ inventoryPage }) => {
        const locator = inventoryPage.elements.nonSauceLabsProductNames();
        await expect(locator).toHaveCount(1);
        await expect(locator).toHaveText("Test.allTheThings() T-Shirt (Red)");
    });

    test("10. product image by partial alt text", async ({ inventoryPage }) => {
        await expect(inventoryPage.elements.productImageByPartialAlt("Backpack")).toHaveCount(1);
    });
});
