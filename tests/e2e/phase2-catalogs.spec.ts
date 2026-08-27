import { expect, test } from "@playwright/test";
test("phase 2 catalogs persist and execute local capabilities", async ({
  page,
}) => {
  await page.goto("./#/catalog");
  await expect(page.getByText("EMP-2026-0817")).toBeVisible();
  await page.goto("./#/knowledge");
  await page.getByRole("button", { name: "测试本地检索" }).click();
  await expect(page.getByText("上海新员工入职指南")).toBeVisible();
  await page.goto("./#/skills");
  await page.getByRole("button", { name: /document-check/ }).click();
  const prompt = page.locator("textarea").first();
  await prompt.fill("E2E 持久化 Skill Prompt");
  await page.getByRole("button", { name: "保存版本" }).click();
  await page.reload();
  await page.getByRole("button", { name: /document-check/ }).click();
  await expect(page.locator("textarea").first()).toHaveValue(
    "E2E 持久化 Skill Prompt",
  );
  await page.goto("./#/tools");
  await page.getByRole("button", { name: /get_employee_profile/ }).click();
  await page.getByRole("button", { name: "运行单项测试" }).click();
  await expect(page.getByText(/"status": "success"/)).toBeVisible();
});
