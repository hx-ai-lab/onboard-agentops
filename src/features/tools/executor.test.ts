import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { OnboardOpsDatabase, db } from "../../db/database";
import { initializeDatabase } from "../../db/seed";
import { executeLocalTool } from "./executor";
beforeAll(async () => {
  await db.delete();
  await initializeDatabase(db);
});
afterAll(async () => {
  db.close();
  await new OnboardOpsDatabase("onboardops").delete();
});
describe("local tools", () => {
  it("reads actual IndexedDB employee state", async () => {
    const result = await executeLocalTool("get_account_status", {
      employeeId: "EMP-2026-0819",
      requesterEmployeeId: "EMP-2026-0819",
    });
    expect(result.status).toBe("success");
    expect(result.data).toMatchObject({ email: "超过 SLA 未开通" });
  });
  it.each([
    ["empty", { employeeId: "missing", requesterEmployeeId: "missing" }],
    [
      "permission_denied",
      { employeeId: "EMP-2026-0817", requesterEmployeeId: "EMP-2026-0818" },
    ],
    [
      "timeout",
      {
        employeeId: "EMP-2026-0828",
        requesterEmployeeId: "EMP-2026-0828",
        injectError: "timeout",
      },
    ],
    [
      "malformed",
      {
        employeeId: "EMP-2026-0828",
        requesterEmployeeId: "EMP-2026-0828",
        injectError: "malformed",
      },
    ],
  ])("distinguishes %s", async (status, input) =>
    expect((await executeLocalTool("get_employee_profile", input)).status).toBe(
      status,
    ),
  );
  it("removes disabled tools from execution", async () => {
    const tool = await db.tools.get("get_account_status");
    await db.tools.put({ ...tool!, enabled: false });
    expect(
      (
        await executeLocalTool("get_account_status", {
          employeeId: "EMP-2026-0819",
        })
      ).status,
    ).toBe("disabled");
  });
});
