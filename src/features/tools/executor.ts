import { db } from "../../db/database";
import { searchKnowledgeDocuments } from "../knowledge/search";
import type { City, EmployeeType } from "../../types/persistence";
export type ToolStatus =
  | "success"
  | "empty"
  | "permission_denied"
  | "timeout"
  | "malformed"
  | "disabled"
  | "error";
export interface ToolResult {
  status: ToolStatus;
  data?: unknown;
  durationMs: number;
  errorCode?: string;
  errorMessage?: string;
}
export async function executeLocalTool(
  toolId: string,
  input: Record<string, unknown>,
): Promise<ToolResult> {
  const started = performance.now(),
    tool = await db.tools.get(toolId);
  const done = (result: Omit<ToolResult, "durationMs">): ToolResult => ({
    ...result,
    durationMs: Math.round(performance.now() - started),
  });
  if (!tool || !tool.enabled)
    return done({
      status: "disabled",
      errorCode: "TOOL_DISABLED",
      errorMessage: "Tool 不存在或未启用",
    });
  const employeeId = String(input.employeeId ?? ""),
    requester = String(input.requesterEmployeeId ?? employeeId);
  if (employeeId && requester !== employeeId)
    return done({
      status: "permission_denied",
      errorCode: "PERMISSION_DENIED",
      errorMessage: "只能查询本人入职信息",
    });
  const employee = employeeId ? await db.employees.get(employeeId) : undefined;
  if (
    employee?.scenarioFlags.includes("tool-timeout") &&
    input.injectError === "timeout"
  )
    return done({
      status: "timeout",
      errorCode: "TOOL_TIMEOUT",
      errorMessage: `超过 ${tool.timeoutMs}ms`,
    });
  if (
    employee?.scenarioFlags.includes("tool-malformed") &&
    input.injectError === "malformed"
  )
    return done({
      status: "malformed",
      errorCode: "INVALID_TOOL_OUTPUT",
      errorMessage: "Tool 返回结构不符合 outputSchema",
    });
  if (toolId === "search_knowledge") {
    const docs = await db.knowledgeDocuments.toArray();
    return done({
      status: "success",
      data: searchKnowledgeDocuments(docs, {
        query: String(input.query ?? ""),
        city: input.city as City | undefined,
        employeeType: input.employeeType as EmployeeType | undefined,
        topK: Number(input.topK ?? 5),
      }),
    });
  }
  if (
    ["create_hr_reminder", "create_it_ticket", "transfer_to_human"].includes(
      toolId,
    )
  ) {
    if (!input.allowCreate)
      return done({
        status: "permission_denied",
        errorCode: "PERMISSION_DENIED",
        errorMessage: "缺少 case:create 权限",
      });
    const type =
      toolId === "create_hr_reminder"
        ? "hr_reminder"
        : toolId === "create_it_ticket"
          ? "it_ticket"
          : "human_handoff";
    const ticket = {
      id: crypto.randomUUID(),
      type,
      employeeId: employeeId || undefined,
      status: "created",
      summary: String(input.summary ?? tool.description),
      createdAt: new Date().toISOString(),
    } as const;
    await db.tickets.add(ticket);
    return done({ status: "success", data: ticket });
  }
  if (!employee)
    return done({
      status: "empty",
      data: null,
      errorCode: "EMPLOYEE_NOT_FOUND",
      errorMessage: "查无此人，建议转人工",
    });
  const data: Record<string, unknown> = {
    get_employee_profile: employee,
    get_onboarding_checklist: {
      submitted: employee.submittedDocuments,
      missing: employee.missingDocuments,
      employeeType: employee.employeeType,
    },
    get_submitted_documents: employee.submittedDocuments,
    get_document_review_status: employee.documentReviewStatus,
    get_account_status: employee.accountStatus,
    get_training_schedule: {
      status: employee.trainingStatus,
      date: employee.trainingDate,
    },
    get_office_arrangement: {
      device: employee.deviceStatus,
      arrangement: employee.officeArrangement,
    },
  };
  return done({ status: "success", data: data[toolId] });
}
