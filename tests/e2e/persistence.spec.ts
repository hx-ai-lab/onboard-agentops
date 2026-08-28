import { expect, test } from "./diagnostics";
test("persists a write across refresh and resets idempotently", async ({
  page,
}) => {
  await page.goto("./#/data");
  const input = page.getByLabel("记录标题");
  await input.fill("刷新后仍然存在");
  await page.getByRole("button", { name: "保存记录" }).click();
  await expect(page.getByText("刷新后仍然存在")).toBeVisible();
  await page.reload();
  await expect(page.getByText("刷新后仍然存在")).toBeVisible();
  for (let index = 0; index < 2; index += 1) {
    await page.getByRole("button", { name: "重置数据" }).click();
    await page.getByRole("button", { name: "确认重置" }).click();
    await expect(page.getByTestId("demo-record")).toHaveCount(1);
    await expect(page.getByText("欢迎使用 OnboardOps")).toBeVisible();
  }
});
