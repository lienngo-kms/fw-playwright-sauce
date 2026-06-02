import { test as base } from "@playwright/test";
import { InventoryPage } from "page-objects/pages/inventory.page";
import { SignInPage } from "page-objects/pages/sign-in.page";

type PageObjects = {
    signInPage: SignInPage;
    inventoryPage: InventoryPage;
};

export const test = base.extend<PageObjects>({
    signInPage: async ({ page }, use) => {
        await use(new SignInPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
});

export const expect = test.expect;
