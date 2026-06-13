# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-suite.spec.ts >> Auth with clock @auth @slow >> sign-in loading state with fake clock
- Location: e2e/tests/auth-suite.spec.ts:58:7

# Error details

```
Error: browserType.launch: Executable doesn't exist at /var/folders/f_/ln5shzss3jj4wk95xlqb28180000gn/T/cursor-sandbox-cache/751a3231436091afc7e5bfac1a10339c/playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell
╔════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.       ║
║ Please run the following command to download new browsers: ║
║                                                            ║
║     npx playwright install                                 ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝
```