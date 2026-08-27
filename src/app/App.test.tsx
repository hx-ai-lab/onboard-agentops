import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { db } from "../db/database";

afterEach(async () => {
  db.close();
  await db.delete();
  window.location.hash = "";
});
describe("application shell", () => {
  it("shows the phase-one overview and disclaimer after initialization", async () => {
    render(<App />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "平台概览" }),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/全部企业、员工、制度和运行指标均为虚构数据/),
    ).toBeInTheDocument();
  });
  it("renders a safe placeholder instead of future business features", async () => {
    window.location.hash = "#/workspace";
    render(<App />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Agent 工作台" }),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText("尚未实现")).toBeInTheDocument();
  });
});
