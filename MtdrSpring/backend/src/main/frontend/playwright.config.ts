import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/tests",
  outputDir: "./e2e/test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 60_000,
  reporter: [
    ["html", { open: "never", outputFolder: "e2e/playwright-report" }],
    ["list"],
    ["json", { outputFile: "e2e/test-results/results.json" }],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on",
    video: {
      mode: "on",
      size: { width: 1280, height: 720 },
    },
    screenshot: "on",
    acceptDownloads: true,
    actionTimeout: 15_000,
    launchOptions: {
      slowMo: process.env.E2E_SLOW_MO ? Number(process.env.E2E_SLOW_MO) : 0,
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_SKIP_WEBSERVER
    ? undefined
    : {
        command: "npm start",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
