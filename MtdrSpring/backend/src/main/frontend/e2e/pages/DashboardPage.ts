import type { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly sprintCompletion: Locator;
  readonly totalTasks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Dashboard" });
    this.sprintCompletion = page.getByText("Sprint Completion");
    this.totalTasks = page.getByText("Total Tasks");
  }

  async expectLoaded() {
    await this.heading.waitFor({ state: "visible" });
  }

  navLink(name: string) {
    return this.page.getByRole("link", { name });
  }

  async goToTasks() {
    await this.navLink("Tasks").click();
  }

  async goToReports() {
    await this.navLink("Reports").click();
  }

  async goToTeam() {
    await this.navLink("Team").click();
  }
}
