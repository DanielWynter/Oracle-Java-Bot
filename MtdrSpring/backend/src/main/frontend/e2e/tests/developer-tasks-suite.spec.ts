import { test, expect } from "@playwright/test";
import { CREDENTIALS } from "../fixtures/mock-data.ts";
import { mockAllApis } from "../helpers/api-mocks.ts";
import { LoginPage } from "../pages/LoginPage.ts";
import { DashboardPage } from "../pages/DashboardPage.ts";
import { TasksPage } from "../pages/TasksPage.ts";

const developerCases = [
  { label: "todo filter", status: "To Do", expected: "Implement login flow" },
  { label: "done filter", status: "Done", expected: "Dashboard KPI widgets" },
] as const;

test.describe("Developer Tasks Suite @developer", () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
    const login = new LoginPage(page);
    await login.goto();
    await login.loginAs(CREDENTIALS.validDeveloper);
    await page.waitForURL(/\/dashboard/);
  });

  test("developer sees assigned tasks count", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goToTasks();

    const tasks = new TasksPage(page);
    await expect(tasks.heading).toBeVisible();
    await tasks.expectTaskVisible("Implement login flow");
    await tasks.expectTaskVisible("Fix API timeout");

    const rows = page.getByRole("row");
    await expect(rows).not.toHaveCount(0);
  });

  for (const { label, status, expected } of developerCases) {
    test(`parameterized filter: ${label}`, async ({ page }) => {
      const dashboard = new DashboardPage(page);
      await dashboard.goToTasks();

      const tasks = new TasksPage(page);
      await tasks.filterByStatus(status);
      await expect(page.getByText(expected)).toBeVisible();
    });
  }

  test("developer marks a task as done via details panel", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goToTasks();

    const tasks = new TasksPage(page);
    await tasks.openTask("Fix API timeout");

    await tasks.detailsPanelSelect(0).selectOption("done");
    await page.getByRole("button", { name: "Save Changes" }).click();

    await tasks.filterByStatus("Done");
    await expect(page.getByRole("row", { name: /Fix API timeout/ })).toBeVisible();
  });
});
