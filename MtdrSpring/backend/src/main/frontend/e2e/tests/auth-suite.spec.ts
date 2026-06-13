import { test, expect } from "@playwright/test";
import { CREDENTIALS, LOGIN_ERROR } from "../fixtures/mock-data.ts";
import { mockAllApis } from "../helpers/api-mocks.ts";
import { LoginPage } from "../pages/LoginPage.ts";
import { DashboardPage } from "../pages/DashboardPage.ts";

test.describe("Authentication Suite @auth", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("shows error on empty credentials then logs in successfully", async ({ page }) => {
    await loginPage.submitEmptyForm();
    await expect(loginPage.errorBanner).toBeVisible();
    await expect(loginPage.errorBanner).toHaveText(LOGIN_ERROR);

    await loginPage.loginAs(CREDENTIALS.validDeveloper);
    await expect(page).toHaveURL(/\/dashboard/);

    const dashboard = new DashboardPage(page);
    await dashboard.expectLoaded();
  });

  test("developer role reaches dashboard with mocked KPIs", async ({ page, context }) => {
    await context.clearCookies();
    await loginPage.loginAs(CREDENTIALS.validDeveloper);

    const dashboard = new DashboardPage(page);
    await dashboard.expectLoaded();
    await expect(dashboard.sprintCompletion).toBeVisible();
    await expect(dashboard.totalTasks).toBeVisible();
    await expect(page.getByText("Implement login flow")).not.toBeVisible();
  });

  test("manager role can open dashboard", async ({ page }) => {
    await loginPage.loginAs(CREDENTIALS.validManager);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  test("login page snapshot", async ({ page }) => {
    await expect(loginPage.logo).toBeVisible();
    await expect(page).toHaveScreenshot("login-page.png", { maxDiffPixels: 500 });
  });

  test.fail("documents optional fail annotation for invalid API", async () => {
    expect(true).toBe(false);
  });
});

test.describe("Auth with clock @auth @slow", () => {
  test.slow();

  test("sign-in loading state with fake clock", async ({ page }) => {
    await mockAllApis(page);
    await page.clock.install({ time: new Date("2026-06-01T12:00:00") });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(CREDENTIALS.validDeveloper);

    await page.clock.fastForward(1100);
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
