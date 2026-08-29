import { expect, test } from "./diagnostics";
test("loads the shell, hash route, mode boundary, and disclaimer", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "平台概览" })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/onboard-agentops/");

  await page.goto("./#/");
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByRole("heading", { name: "平台概览" })).toBeVisible();

  await page.goto("./#/mode");
  await expect(page.getByRole("heading", { name: "运行模式" })).toBeVisible();
  await expect(page.getByText("未配置安全后端，当前不可运行。")).toBeVisible();
  await expect(
    page.getByText(/全部企业、员工、制度和运行指标均为虚构数据/),
  ).toBeVisible();
});
