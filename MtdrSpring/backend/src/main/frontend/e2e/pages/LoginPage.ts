import type { Page, Locator } from "@playwright/test";
import type { Credentials } from "../fixtures/mock-data.ts";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly developerRoleButton: Locator;
  readonly managerRoleButton: Locator;
  readonly errorBanner: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.signInButton = page.getByRole("button", { name: "Sign In" });
    this.developerRoleButton = page.getByRole("button", { name: "Developer" });
    this.managerRoleButton = page.getByRole("button", { name: "Manager" });
    this.errorBanner = page.getByText("Please enter valid credentials");
    this.logo = page.getByAltText("Oracle Logo");
  }

  async goto() {
    await this.page.goto("/");
  }

  async selectRole(role: Credentials["role"]) {
    if (role === "manager") {
      await this.managerRoleButton.click();
    } else {
      await this.developerRoleButton.click();
    }
  }

  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.signInButton.click();
  }

  async loginAs(credentials: Credentials) {
    await this.selectRole(credentials.role);
    await this.fillCredentials(credentials.email, credentials.password);
    await this.submit();
  }

  /** Bypass HTML5 required validation to test client-side error path. */
  async submitEmptyForm() {
    await this.page.locator("form").evaluate((form: HTMLFormElement) => {
      form.querySelectorAll("[required]").forEach((el) => el.removeAttribute("required"));
      form.requestSubmit();
    });
  }
}
