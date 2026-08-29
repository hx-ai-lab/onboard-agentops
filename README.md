# OnboardOps

企业入职 AI 助手 AgentOps 测评运营平台。它以确定性演示 Agent 展示 Planner、Validator、Skill、Tool、知识、Risk Check、Trace、Eval、批次回归和可导出三联报告。

> 本平台用于产品设计与 AI 测评演示。全部企业、员工、制度和运行指标均为虚构数据，不代表任何真实公司生产信息。

## 从零安装与启动

需要 Node.js 20.19+、npm 10+；E2E 需要 Chromium。

```bash
npm install
npm run dev
```

访问 Vite 输出地址。应用使用 `HashRouter`；业务路由位于 `/#/` 后。

## 演示操作

1. 在“Agent 工作台”选择员工并输入“我下周一上海入职，还缺什么材料”；查看 Planner、Validator、Tool、知识证据、回复、Risk 与 Trace。
2. 在 Run 详情加入 Eval；到“Eval 测评案例”编辑/单测并选择用例创建批次。
3. 查看批次 PASS、FAIL、REVIEW、ERROR；修改 Skill Prompt（保存会创建版本快照），用相同 caseIds 回归并在“回归对比”检查可比性。
4. 从批次或对比页进入三联报告。分别预览/导出设计单、运行报告、Bad Case 决策单，或导出完整测评包。

报告 HTML 是内联样式的离线文件；“打印 / PDF”打开 A4 专用视图并由浏览器另存 PDF；CSV 带 UTF-8 BOM；JSON 先经 zod schema 校验并包含完整 Run/Trace。打印报告仅展示 Trace 摘要。人工结论、根因、评审与最终发布决定存入 IndexedDB，不会由系统编造。

## 测试与构建

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run validate
npx playwright install chromium
npm run test:e2e
```

Vitest 只收集 `src/**/*.test.*`，E2E 独立位于 `tests/e2e`。Playwright 会以 `/onboard-agentops/` base 构建并验证桌面、移动端和持久化流程。

## 数据备份与重置

“数据管理”支持全部 IndexedDB 数据 JSON 导入/导出和二次确认重置；v7 非破坏性增加报告草稿和导出记录表，迁移、导入、重置均使用事务。重置幂等且会清除用户生成数据，恢复固定 Fixture。`npm run demo:reset` 输出浏览器重置指引。

## GitHub Pages

本地模拟仓库子路径：

```bash
VITE_BASE_PATH=/onboard-agentops/ npm run build
npm run preview
```

访问 `http://localhost:4173/onboard-agentops/#/`。`.github/workflows/pages.yml` 对 PR 只验证；对 `main` 依次安装依赖、typecheck、lint、unit、安装 Chromium、核心 E2E、production build。全部成功后才上传并部署 Pages artifact。在 Settings → Pages 选择 **GitHub Actions**，发布地址为 `https://<github-user>.github.io/<repository-name>/`。

## 安全限制

演示稳定模式无需 API Key。前端不保存长期密钥、不上传报告数据。智能模式只有配置了 `VITE_AGENT_API_BASE_URL` 安全后端才可用；否则明确显示“未配置安全后端”，不会伪装成功或静默降级。不要把 API Key 放入源代码、`.env` 或任何会进入客户端 bundle 的 `VITE_*` 变量。
