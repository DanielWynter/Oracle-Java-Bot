# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-suite.spec.ts >> Authentication Suite @auth >> documents optional fail annotation for invalid API
- Location: e2e/tests/auth-suite.spec.ts:50:8

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - img "Oracle Logo" [ref=e7]
    - heading "Dev Productivity Portal" [level=1] [ref=e8]
    - paragraph [ref=e9]: Sign in to manage your team's productivity
  - generic [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: Role
        - generic [ref=e14]:
          - button "Developer" [ref=e15] [cursor=pointer]
          - button "Manager" [ref=e16] [cursor=pointer]
      - generic [ref=e17]:
        - generic [ref=e18]: Email
        - textbox "Email" [ref=e19]:
          - /placeholder: you@company.com
      - generic [ref=e20]:
        - generic [ref=e21]: Password
        - generic [ref=e22]:
          - textbox "Password" [ref=e23]:
            - /placeholder: Enter your password
          - button [ref=e24] [cursor=pointer]:
            - img [ref=e25]
      - button "Sign In" [ref=e28] [cursor=pointer]
    - paragraph [ref=e30]: "Demo credentials: any email/password"
  - paragraph [ref=e31]: © 2026 Oracle Dev Productivity Portal
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { CREDENTIALS, LOGIN_ERROR } from "../fixtures/mock-data.ts";
  3  | import { mockAllApis } from "../helpers/api-mocks.ts";
  4  | import { LoginPage } from "../pages/LoginPage.ts";
  5  | import { DashboardPage } from "../pages/DashboardPage.ts";
  6  | 
  7  | test.describe("Authentication Suite @auth", () => {
  8  |   let loginPage: LoginPage;
  9  | 
  10 |   test.beforeEach(async ({ page }) => {
  11 |     await mockAllApis(page);
  12 |     loginPage = new LoginPage(page);
  13 |     await loginPage.goto();
  14 |   });
  15 | 
  16 |   test("shows error on empty credentials then logs in successfully", async ({ page }) => {
  17 |     await loginPage.submitEmptyForm();
  18 |     await expect(loginPage.errorBanner).toBeVisible();
  19 |     await expect(loginPage.errorBanner).toHaveText(LOGIN_ERROR);
  20 | 
  21 |     await loginPage.loginAs(CREDENTIALS.validDeveloper);
  22 |     await expect(page).toHaveURL(/\/dashboard/);
  23 | 
  24 |     const dashboard = new DashboardPage(page);
  25 |     await dashboard.expectLoaded();
  26 |   });
  27 | 
  28 |   test("developer role reaches dashboard with mocked KPIs", async ({ page, context }) => {
  29 |     await context.clearCookies();
  30 |     await loginPage.loginAs(CREDENTIALS.validDeveloper);
  31 | 
  32 |     const dashboard = new DashboardPage(page);
  33 |     await dashboard.expectLoaded();
  34 |     await expect(dashboard.sprintCompletion).toBeVisible();
  35 |     await expect(dashboard.totalTasks).toBeVisible();
  36 |     await expect(page.getByText("Implement login flow")).not.toBeVisible();
  37 |   });
  38 | 
  39 |   test("manager role can open dashboard", async ({ page }) => {
  40 |     await loginPage.loginAs(CREDENTIALS.validManager);
  41 |     await expect(page).toHaveURL(/\/dashboard/);
  42 |     await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  43 |   });
  44 | 
  45 |   test("login page snapshot", async ({ page }) => {
  46 |     await expect(loginPage.logo).toBeVisible();
  47 |     await expect(page).toHaveScreenshot("login-page.png", { maxDiffPixels: 500 });
  48 |   });
  49 | 
  50 |   test.fail("documents optional fail annotation for invalid API", async () => {
> 51 |     expect(true).toBe(false);
     |                  ^ Error: expect(received).toBe(expected) // Object.is equality
  52 |   });
  53 | });
  54 | 
  55 | test.describe("Auth with clock @auth @slow", () => {
  56 |   test.slow();
  57 | 
  58 |   test("sign-in loading state with fake clock", async ({ page }) => {
  59 |     await mockAllApis(page);
  60 |     await page.clock.install({ time: new Date("2026-06-01T12:00:00") });
  61 | 
  62 |     const loginPage = new LoginPage(page);
  63 |     await loginPage.goto();
  64 |     await loginPage.loginAs(CREDENTIALS.validDeveloper);
  65 | 
  66 |     await page.clock.fastForward(1100);
  67 |     await expect(page).toHaveURL(/\/dashboard/);
  68 |   });
  69 | });
  70 | 
```