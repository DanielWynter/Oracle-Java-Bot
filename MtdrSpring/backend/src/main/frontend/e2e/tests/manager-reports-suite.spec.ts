import { test, expect } from "@playwright/test";
import { CREDENTIALS } from "../fixtures/mock-data.ts";
import { mockAllApis } from "../helpers/api-mocks.ts";
import { LoginPage } from "../pages/LoginPage.ts";
import { DashboardPage } from "../pages/DashboardPage.ts";
import { ReportsPage } from "../pages/ReportsPage.ts";

test.describe("Manager Reports Suite @manager", () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
    const login = new LoginPage(page);
    await login.goto();
    await login.loginAs(CREDENTIALS.validManager);
    await page.waitForURL(/\/dashboard/);
  });

  test("manager views team analytics on reports page", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goToReports();

    await expect(page.getByText(/Showing \d+ task/)).toBeVisible({ timeout: 20_000 });

    const reports = new ReportsPage(page);
    await expect(reports.heading).toBeVisible();
    await reports.expectMetricsVisible();

    await expect.soft(page.getByText("Total Tasks Completed")).toBeVisible();
    await expect(page.getByText("Sprint Summary")).toBeVisible();
  });

  test("manager exports CSV with mocked data", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goToReports();

    await expect(page.getByText(/Showing \d+ task/)).toBeVisible({ timeout: 20_000 });

    const downloadPromise = page.waitForEvent("download", { timeout: 15_000 });
    await page.getByRole("button", { name: /Export CSV/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/report_.*\.csv/);
  });

  test("manager opens team page and sees members", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goToTeam();

    await expect(page.getByRole("heading", { name: "Team" })).toBeVisible();
    await expect(page.getByText("Esteban")).toBeVisible();
    await expect(page.getByText("Daniel")).toBeVisible();
  });

  test.skip("skipped example: PDF export on CI only", async () => {
    // Demonstrates test.skip annotation from assignment topics.
  });
});
