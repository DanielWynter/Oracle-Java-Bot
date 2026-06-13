import type { Page, Locator } from "@playwright/test";

export class ReportsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly exportCsvButton: Locator;
  readonly exportPdfButton: Locator;
  readonly dateRangeSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /Reports/i });
    this.exportCsvButton = page.getByRole("button", { name: /Export CSV/i });
    this.exportPdfButton = page.getByRole("button", { name: /Export PDF/i });
    this.dateRangeSelect = page.locator("select").first();
  }

  async expectMetricsVisible() {
    await this.page.getByText("Avg Team Productivity").waitFor({ state: "visible" });
    await this.page.getByText("Total Tasks Completed").waitFor({ state: "visible" });
  }
}
