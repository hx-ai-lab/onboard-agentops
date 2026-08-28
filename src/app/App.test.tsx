import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { db } from "../db/database";

afterEach(async () => {
  cleanup();
  await act(async () => {
    await Promise.resolve();
  });
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
    await waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument(),
    );
    expect(
      screen.getByText(/全部企业、员工、制度和运行指标均为虚构数据/),
    ).toBeInTheDocument();
  });
  it("renders the phase three agent workspace", async () => {
    window.location.hash = "#/workspace";
    render(<App />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Agent 工作台" }),
      ).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument(),
    );
    expect(screen.getByText(/所有输入均通过同一条/)).toBeInTheDocument();
  });
});
