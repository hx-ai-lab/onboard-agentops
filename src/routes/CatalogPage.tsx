import { useEffect, useState } from "react";
import { db } from "../db/database";
import type { City, Employee, ServiceTicket } from "../types/persistence";
type View = "员工" | "材料" | "账号" | "培训" | "办公安排" | "工单";
export function CatalogPage() {
  const [employees, setEmployees] = useState<Employee[]>([]),
    [tickets, setTickets] = useState<ServiceTicket[]>([]),
    [view, setView] = useState<View>("员工"),
    [city, setCity] = useState<City | "全部">("全部");
  useEffect(() => {
    void Promise.all([db.employees.toArray(), db.tickets.toArray()]).then(
      ([e, t]) => {
        setEmployees(e);
        setTickets(t);
      },
    );
  }, []);
  const filtered =
    city === "全部" ? employees : employees.filter((e) => e.city === city);
  return (
    <>
      <h1 className="page-title">虚构业务数据目录</h1>
      <p className="page-description">
        星云保险集团虚构演示数据。身份证、银行卡和手机号仅显示脱敏值。
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {(["员工", "材料", "账号", "培训", "办公安排", "工单"] as View[]).map(
          (x) => (
            <button
              className={view === x ? "button-primary" : "button-secondary"}
              onClick={() => setView(x)}
              key={x}
            >
              {x}
            </button>
          ),
        )}
        <select
          className="field max-w-32"
          value={city}
          onChange={(e) => setCity(e.target.value as City | "全部")}
        >
          <option>全部</option>
          {["上海", "北京", "广州", "深圳"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <section className="panel mt-5 overflow-x-auto">
        {view === "工单" ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th>编号</th>
                <th>类型</th>
                <th>状态</th>
                <th>摘要</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.type}</td>
                  <td>{t.status}</td>
                  <td>{t.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr>
                <th>员工</th>
                <th>城市/类型</th>
                <th>{view}</th>
                <th>案例标记</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr className="border-t" key={e.employeeId}>
                  <td className="py-3">
                    <b>{e.name}</b>
                    <small className="block">
                      {e.employeeId}
                      <br />
                      {e.maskedIdNumber} · {e.maskedPhone}
                    </small>
                  </td>
                  <td>
                    {e.city}
                    <br />
                    {e.employeeType}
                  </td>
                  <td>
                    {view === "员工"
                      ? `${e.onboardingStage} · ${e.onboardingDate}`
                      : view === "材料"
                        ? `已交：${e.submittedDocuments.join("、")}；缺失：${e.missingDocuments.join("、") || "无"}`
                        : view === "账号"
                          ? JSON.stringify(e.accountStatus)
                          : view === "培训"
                            ? `${e.trainingStatus} · ${e.trainingDate}`
                            : `${e.deviceStatus} · ${e.officeArrangement}`}
                  </td>
                  <td>{e.scenarioFlags.join("、")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
