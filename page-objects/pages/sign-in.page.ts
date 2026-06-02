import { Locator, Page } from "@playwright/test";
import { Wait } from "settings/config/timeout.config";
import Env from "settings/env/env.global";

/**
 * Sign-in page for https://www.saucedemo.com.
 *
 * Note: the username/password fields are matched by placeholder rather than
 * getByRole("textbox") because <input type="password"> exposes no `textbox`
 * ARIA role, so a role-based locator would not resolve the password field.
 */
export class SignInPage {
    constructor(protected page: Page) {}

    elements = {
        usernameInput: (): Locator => this.page.getByPlaceholder("Username"),
        passwordInput: (): Locator => this.page.getByPlaceholder("Password"),
        loginButton: (): Locator => this.page.getByRole("button", { name: "Login" }),
        errorMessage: (): Locator => this.page.locator('[data-test="error"]'),
    };

    async goto(): Promise<void> {
        await this.page.goto(Env.WEB_URL);
        await this.page.waitForLoadState("load", { timeout: Wait.LONG });
    }

    async login(username: string, password: string): Promise<void> {
        await this.goto();
        await this.elements.usernameInput().fill(username);
        await this.elements.passwordInput().fill(password);
        await this.elements.loginButton().click();
    }

    async isDisplayed(): Promise<boolean> {
        return this.elements.loginButton().isVisible();
    }
}
