import type { Page, Locator } from "@playwright/test";

export class TasksPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly newTaskButton: Locator;
  readonly statusFilter: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Tasks" });
    this.searchInput = page.getByPlaceholder("Search tasks...");
    this.newTaskButton = page.getByRole("button", { name: "New Task" });
    this.statusFilter = page
      .locator("select")
      .filter({ has: page.locator('option[value="all"]', { hasText: "All Status" }) });
    this.emptyState = page.getByText("No tasks found in your database.");
  }

  createPanel() {
    return this.page.locator(".fixed").filter({ has: this.page.getByRole("heading", { name: "New Task" }) });
  }

  detailsPanel() {
    return this.page.locator(".fixed").filter({ has: this.page.getByText("Task Details") });
  }

  createPanelSelect(index: number) {
    return this.createPanel().getByRole("combobox").nth(index);
  }

  detailsPanelSelect(index: number) {
    return this.detailsPanel().getByRole("combobox").nth(index);
  }

  taskRow(title: string) {
    return this.page.getByRole("row").filter({ hasText: title });
  }

  async openTask(title: string) {
    await this.taskRow(title).click();
    await this.detailsPanel().waitFor({ state: "visible" });
  }

  async filterByStatus(statusLabel: string) {
    await this.statusFilter.selectOption({ label: statusLabel });
  }

  async expectTaskVisible(title: string) {
    await this.page.getByRole("row", { name: new RegExp(title) }).waitFor({ state: "visible" });
  }
}
