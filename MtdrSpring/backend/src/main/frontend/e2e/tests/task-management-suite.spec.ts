import { test, expect } from "@playwright/test";
import path from "path";
import { CREDENTIALS } from "../fixtures/mock-data.ts";
import { mockAllApis, mockFromHar } from "../helpers/api-mocks.ts";
import { LoginPage } from "../pages/LoginPage.ts";
import { DashboardPage } from "../pages/DashboardPage.ts";
import { TasksPage } from "../pages/TasksPage.ts";

const harPath = path.join(process.cwd(), "e2e/har/api-mocks.har");

const tasksToCreate = [
  { title: "E2E Task Alpha", type: "Feature", status: "todo" },
  { title: "E2E Task Beta", type: "Bug", status: "in-progress" },
  { title: "E2E Task Gamma", type: "Issue", status: "blocked" },
];

test.describe("Task Management Suite @tasks", () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page);
    const login = new LoginPage(page);
    await login.goto();
    await login.loginAs(CREDENTIALS.validDeveloper);
    await page.waitForURL(/\/dashboard/);
  });

  for (const task of tasksToCreate) {
    test(`create task: ${task.title}`, async ({ page }) => {
      const dashboard = new DashboardPage(page);
      await dashboard.goToTasks();

      const tasks = new TasksPage(page);
      await page.getByRole("button", { name: "New Task" }).click();
      await page.getByPlaceholder("Enter task title").fill(task.title);
      await page.getByPlaceholder("Describe the task...").fill("Created by Playwright E2E");

      await tasks.createPanelSelect(0).selectOption(task.status);
      await tasks.createPanelSelect(1).selectOption(task.type.toLowerCase());
      await tasks.createPanelSelect(2).selectOption("medium");

      await page.getByRole("button", { name: "Create Task" }).click();
      await expect(page.getByText(task.title)).toBeVisible();
    });
  }

  test("modify three tasks to completed, in-progress, and blocked", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goToTasks();
    const tasks = new TasksPage(page);

    const changes: Array<{ title: string; status: string; label: string }> = [
      { title: "Implement login flow", status: "done", label: "Done" },
      { title: "Fix API timeout", status: "in-progress", label: "In Progress" },
      { title: "Blocked DB migration", status: "blocked", label: "Blocked" },
    ];

    for (const change of changes) {
      await tasks.openTask(change.title);
      await tasks.detailsPanelSelect(0).selectOption(change.status);
      await page.getByRole("button", { name: "Save Changes" }).click();
      await expect(page.getByRole("row", { name: new RegExp(change.title) })).toContainText(change.label);
    }
  });

  test("search filters tasks with negative assertion", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goToTasks();

    const tasks = new TasksPage(page);
    await tasks.searchInput.fill("Dashboard KPI");
    await expect(page.getByText("Dashboard KPI widgets")).toBeVisible();
    await expect(page.getByText("Implement login flow")).not.toBeVisible();
  });
});

test.describe("HAR mock suite @har", () => {
  test("loads tasks from HAR file without backend", async ({ page }) => {
    await mockFromHar(page, harPath);
    await page.route("**/api/users", (r) =>
      r.fulfill({ contentType: "application/json", body: "[]" })
    );
    await page.route("**/api/sprints", (r) =>
      r.fulfill({
        contentType: "application/json",
        body: JSON.stringify([
          { sprintId: 2, sprintName: "Sprint 2", startDate: "2026-01-01", endDate: "2026-12-31", status: "active" },
        ]),
      })
    );
    await page.route("**/api/task-logs", (r) =>
      r.fulfill({ contentType: "application/json", body: "[]" })
    );

    const login = new LoginPage(page);
    await login.goto();
    await login.loginAs(CREDENTIALS.validDeveloper);
    await page.waitForURL(/\/dashboard/);

    const dashboard = new DashboardPage(page);
    await dashboard.goToTasks();
    await expect(page.getByText("HAR mock task")).toBeVisible();
  });
});
