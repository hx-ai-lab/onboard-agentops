import { expect, test } from "./diagnostics";
test("built assets use the configured Pages base and hash routes avoid server fallback", async ({
  page,
}) => {
  const response = await page.goto("./");
  expect(response?.ok()).toBeTruthy();
  await page.goto("./#/not-a-real-page");
  await expect(page.getByRole("heading", { name: "页面不存在" })).toBeVisible();
  const scripts = await page
    .locator('script[type="module"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLScriptElement).src),
    );
  expect(
    scripts.every((src) =>
      new URL(src).pathname.startsWith("/onboard-agentops/"),
    ),
  ).toBeTruthy();
});
