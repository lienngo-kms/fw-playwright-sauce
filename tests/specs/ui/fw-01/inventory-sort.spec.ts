import { SortOption } from "page-objects/pages/inventory.page";
import Env from "settings/env/env.global";
import { expect, test } from "settings/fixtures/ui.fixture";

const ALPHABETICAL_PRODUCTS = [
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-Shirt",
    "Sauce Labs Fleece Jacket",
    "Sauce Labs Onesie",
    "Test.allTheThings() T-Shirt (Red)",
];

/** Assert prices are sorted from highest to lowest. */
function isDescending(prices: number[]): boolean {
    return prices.every((p, i) => i === 0 || prices[i - 1] >= p);
}

test.describe("fw-01 inventory sorting", () => {
    test("Scenario 1: default sort state after login", async ({ signInPage, inventoryPage }) => {
        // Given the user is on the login page / When they log in
        await signInPage.login(Env.USERNAME, Env.PASSWORD);

        // Then the inventory page is displayed
        await inventoryPage.waitUntilLoaded();
        expect(await inventoryPage.isDisplayed()).toBe(true);

        // And the sort dropdown shows "Name (A to Z)"
        expect(await inventoryPage.getSelectedSortLabel()).toBe(SortOption.NAME_AZ.label);

        // And products are listed in alphabetical order
        expect(await inventoryPage.getProductNames()).toEqual(ALPHABETICAL_PRODUCTS);
    });

    test("Scenario 2: sort resets after logout and re-login", async ({
        signInPage,
        inventoryPage,
    }) => {
        // Given the user is logged in and on the inventory page
        await signInPage.login(Env.USERNAME, Env.PASSWORD);
        await inventoryPage.waitUntilLoaded();

        // When the user selects "Name (Z to A)"
        await inventoryPage.selectSort(SortOption.NAME_ZA);
        expect(await inventoryPage.getSelectedSortLabel()).toBe(SortOption.NAME_ZA.label);

        // And opens the hamburger menu and clicks "Logout"
        await inventoryPage.logout();

        // Then the login page is displayed
        expect(await signInPage.isDisplayed()).toBe(true);

        // When the user logs in again
        await signInPage.login(Env.USERNAME, Env.PASSWORD);
        await inventoryPage.waitUntilLoaded();

        // Then the inventory page is displayed
        expect(await inventoryPage.isDisplayed()).toBe(true);

        // And the sort dropdown shows "Name (A to Z)" (default)
        expect(await inventoryPage.getSelectedSortLabel()).toBe(SortOption.NAME_AZ.label);

        // And products are listed in alphabetical ascending order
        expect(await inventoryPage.getProductNames()).toEqual(ALPHABETICAL_PRODUCTS);
    });

    test("Scenario 3: sort with items in cart and stable order for equal prices", async ({
        signInPage,
        inventoryPage,
    }) => {
        const BACKPACK = "Sauce Labs Backpack";
        const ONESIE = "Sauce Labs Onesie";
        const BOLT = "Sauce Labs Bolt T-Shirt";
        const ALL_THE_THINGS = "Test.allTheThings() T-Shirt (Red)";

        // Given the user is logged in and on the inventory page
        await signInPage.login(Env.USERNAME, Env.PASSWORD);
        await inventoryPage.waitUntilLoaded();

        // When the user adds Backpack and Onesie to the cart
        await inventoryPage.addToCart(BACKPACK);
        await inventoryPage.addToCart(ONESIE);

        // Then the cart badge shows "2"
        expect(await inventoryPage.getCartCount()).toBe(2);

        // When the user selects "Price (high to low)"
        await inventoryPage.selectSort(SortOption.PRICE_HIGH_LOW);

        // Then products are re-ordered by descending price
        expect(isDescending(await inventoryPage.getProductPrices())).toBe(true);

        // And the cart badge still shows "2"
        expect(await inventoryPage.getCartCount()).toBe(2);

        // And the added products show "Remove" while others show "Add to cart"
        expect(await inventoryPage.getProductButtonText(BACKPACK)).toBe("Remove");
        expect(await inventoryPage.getProductButtonText(ONESIE)).toBe("Remove");
        expect(await inventoryPage.getProductButtonText(BOLT)).toBe("Add to cart");
        expect(await inventoryPage.getProductButtonText(ALL_THE_THINGS)).toBe("Add to cart");
        // 6 products, 2 added -> 4 still show "Add to cart"
        await expect(inventoryPage.elements.allAddToCartButtons()).toHaveCount(4);

        // When the user selects "Price (low to high)"
        await inventoryPage.selectSort(SortOption.PRICE_LOW_HIGH);

        // Then the two $15.99 items keep a stable relative order (Bolt before AllTheThings)
        let names = await inventoryPage.getProductNames();
        expect(names.indexOf(BOLT)).toBeLessThan(names.indexOf(ALL_THE_THINGS));

        // When the user selects "Price (high to low)" again
        await inventoryPage.selectSort(SortOption.PRICE_HIGH_LOW);

        // Then the stable order of the equal-price items is preserved
        names = await inventoryPage.getProductNames();
        expect(names.indexOf(BOLT)).toBeLessThan(names.indexOf(ALL_THE_THINGS));
    });
});
