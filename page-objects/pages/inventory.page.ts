import { Locator, Page } from "@playwright/test";
import { Wait } from "settings/config/timeout.config";

/**
 * Sort options exposed by the SauceDemo "product_sort_container" dropdown.
 * The `value` matches the <option value> in the DOM; the `label` matches the
 * visible text the user sees (and that the test scenarios assert against).
 */
export const SortOption = {
    NAME_AZ: { value: "az", label: "Name (A to Z)" },
    NAME_ZA: { value: "za", label: "Name (Z to A)" },
    PRICE_LOW_HIGH: { value: "lohi", label: "Price (low to high)" },
    PRICE_HIGH_LOW: { value: "hilo", label: "Price (high to low)" },
} as const;

export type SortOptionKey = keyof typeof SortOption;

/**
 * Inventory (products) page for https://www.saucedemo.com.
 *
 * Per the fw-01 ticket, locators deliberately demonstrate both CSS and XPath
 * strategies (rather than only getByRole) to exercise locator-identification
 * skills. Each `elements` entry is annotated with the ticket requirement it
 * satisfies (items 1-10).
 */
export class InventoryPage {
    constructor(protected page: Page) {}

    elements = {
        // ---- Ticket locator requirements (Score: 10) -------------------------

        // 1. Shopping cart link/icon — CSS
        shoppingCartLink: (): Locator => this.page.locator("a.shopping_cart_link"),

        // 2. All "Add to cart" buttons — XPath (matched by visible button text)
        allAddToCartButtons: (): Locator =>
            this.page.locator("xpath=//button[normalize-space(.)='Add to cart']"),

        // 3. Sort dropdown — CSS
        sortDropdown: (): Locator => this.page.locator("select.product_sort_container"),

        // 4. All product images — CSS
        allProductImages: (): Locator => this.page.locator("img.inventory_item_img"),

        // 5. Items whose price contains "$15.99" — XPath climbing from the price
        //    node up to the owning inventory_item container.
        itemsWithPrice1599: (): Locator =>
            this.page.locator(
                "xpath=//div[@class='inventory_item']" +
                    "[.//div[contains(@class,'inventory_item_price') and contains(normalize-space(.),'$15.99')]]",
            ),

        // 6. "Add to cart" button for "Sauce Labs Backpack" — CSS attribute selector
        addBackpackButton: (): Locator =>
            this.page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]'),

        // 7. "Remove" button for "Sauce Labs Onesie" (present after adding it) — CSS
        removeOnesieButton: (): Locator =>
            this.page.locator('button[data-test="remove-sauce-labs-onesie"]'),

        // 8. All buttons whose data-test starts with "add-to-cart" — CSS ^= selector
        addToCartByDataTest: (): Locator =>
            this.page.locator('button[data-test^="add-to-cart"]'),

        // 9. Product names that do NOT contain "Sauce Labs" — XPath with not()/contains()
        nonSauceLabsProductNames: (): Locator =>
            this.page.locator(
                "xpath=//div[contains(@class,'inventory_item_name') and not(contains(.,'Sauce Labs'))]",
            ),

        // 10. Product image by partial alt-text match — CSS *= selector (parametrised)
        productImageByPartialAlt: (altFragment: string): Locator =>
            this.page.locator(`img.inventory_item_img[alt*="${altFragment}"]`),

        // ---- Supporting locators for the test scenarios ----------------------

        inventoryList: (): Locator => this.page.locator(".inventory_list"),
        cartBadge: (): Locator => this.page.locator("span.shopping_cart_badge"),
        productNames: (): Locator => this.page.locator(".inventory_item_name"),
        productPrices: (): Locator => this.page.locator(".inventory_item_price"),
        selectedSortOption: (): Locator =>
            this.page.locator("select.product_sort_container option:checked"),
        menuButton: (): Locator => this.page.locator("#react-burger-menu-btn"),
        logoutLink: (): Locator => this.page.locator("#logout_sidebar_link"),

        // Add/Remove button scoped to a single product (matched by exact name).
        productActionButton: (productName: string): Locator =>
            this.page.locator(
                "xpath=//div[@class='inventory_item']" +
                    `[.//div[contains(@class,'inventory_item_name') and normalize-space(.)="${productName}"]]` +
                    "//button",
            ),
    };

    /** Wait until the inventory list is rendered (login succeeded). */
    async waitUntilLoaded(): Promise<void> {
        await this.elements.inventoryList().waitFor({ state: "visible", timeout: Wait.MEDIUM });
    }

    async isDisplayed(): Promise<boolean> {
        return this.elements.inventoryList().isVisible();
    }

    /** Visible label of the currently selected sort option (e.g. "Name (A to Z)"). */
    async getSelectedSortLabel(): Promise<string> {
        return (await this.elements.selectedSortOption().innerText()).trim();
    }

    /** Select a sort option by its DOM value, which is stable across labels. */
    async selectSort(option: { value: string; label: string }): Promise<void> {
        await this.elements.sortDropdown().selectOption(option.value);
    }

    /** Product names in their current display order. */
    async getProductNames(): Promise<string[]> {
        return (await this.elements.productNames().allInnerTexts()).map((t) => t.trim());
    }

    /** Product prices as numbers in their current display order. */
    async getProductPrices(): Promise<number[]> {
        const texts = await this.elements.productPrices().allInnerTexts();
        return texts.map((t) => parseFloat(t.replace("$", "").trim()));
    }

    /** Current cart badge count; 0 when the badge is absent. */
    async getCartCount(): Promise<number> {
        const badge = this.elements.cartBadge();
        if ((await badge.count()) === 0) return 0;
        return parseInt((await badge.innerText()).trim(), 10);
    }

    /** Text of a product's action button ("Add to cart" or "Remove"). */
    async getProductButtonText(productName: string): Promise<string> {
        return (await this.elements.productActionButton(productName).innerText()).trim();
    }

    /** Click a product's "Add to cart" button. */
    async addToCart(productName: string): Promise<void> {
        await this.elements.productActionButton(productName).click();
    }

    /** Open the hamburger menu and log out, returning to the login page. */
    async logout(): Promise<void> {
        await this.elements.menuButton().click();
        await this.elements.logoutLink().waitFor({ state: "visible", timeout: Wait.SHORT });
        await this.elements.logoutLink().click();
    }
}
