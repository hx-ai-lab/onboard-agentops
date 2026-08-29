import { expect, test as base } from "@playwright/test";

/** Shared diagnostics for the existing E2E suite; fails retain actionable browser/resource errors in CI logs. */
export const test = base.extend<{ browserDiagnostics: void }>({
  browserDiagnostics: [
    async ({ page }, use) => {
      page.on("console", (message) => {
        if (message.type() === "error") {
          console.error(`[browser console.error] ${message.text()}`);
        }
      });
      page.on("pageerror", (error) => {
        console.error(`[browser pageerror] ${error.message}`);
      });
      page.on("requestfailed", (request) => {
        console.error(
          `[browser requestfailed] ${request.method()} ${request.url()} ${request.failure()?.errorText ?? "unknown"}`,
        );
      });
      page.on("response", (response) => {
        if (response.status() === 404) {
          console.error(`[browser 404] ${response.url()}`);
        }
      });
      await use();
    },
    { auto: true },
  ],
});
export { expect };
