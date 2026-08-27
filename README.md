# OnboardOps

企业入职 AI 助手 AgentOps 测评运营平台。当前仓库完成了第 1 阶段：静态前端工程骨架、响应式后台布局、本地持久化底座和 GitHub Pages 发布配置。Agent、Planner、Skill、Tool、知识、Eval 与报告业务尚未实现。

> 本平台用于产品设计与 AI 测评演示。全部企业、员工、制度和运行指标均为虚构数据，不代表任何真实公司生产信息。

## 环境要求

- Node.js 20.19 或更高版本
- npm 10 或更高版本
- Chromium（仅 Playwright E2E 需要）

## 本地启动

```bash
npm install
npm run dev
```

Vite 会输出本地访问地址。应用使用 `HashRouter`，因此业务路径位于 `/#/` 后，不依赖服务器 SPA 回退。

## 验证命令

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
npm run validate
```

`npm run validate` 顺序执行 typecheck、lint、单元测试和生产构建。首次执行 E2E 前可使用 `npx playwright install chromium` 安装浏览器。

## 演示数据与重置

应用首次启动会将固定最小 Fixture 导入 IndexedDB。打开“数据管理”可以：

1. 新增记录并刷新页面验证持久化；
2. 导出或导入完整演示数据 JSON；
3. 点击“重置数据”，在确认对话框中再次确认；
4. 重复重置会得到完全一致的固定 Fixture。

`npm run demo:reset` 会输出浏览器端重置操作指引。由于数据位于浏览器沙箱内，Node 脚本不会伪装成已清除浏览器 IndexedDB。

## 运行模式与安全

- **演示稳定模式**：默认模式，无需 API Key，当前提供确定性本地数据底座。
- **智能模式**：本阶段仅提供配置边界。没有安全后端时界面明确显示不可用。

未来安全后端可通过 `VITE_AGENT_API_BASE_URL` 配置。不得将 API Key 写入 `.env`、源代码或任何 `VITE_*` 变量；Vite 变量会公开到浏览器 bundle。

## GitHub Pages 子路径构建

本地模拟仓库名为 `onboard-agentops` 的 Pages 构建：

```bash
VITE_BASE_PATH=/onboard-agentops/ npm run build
npm run preview
```

访问 `http://localhost:4173/onboard-agentops/#/`。静态资源使用该 base，前端使用 HashRouter，刷新路由不会请求不存在的服务器文件。

## GitHub Pages 发布

`.github/workflows/pages.yml` 在 `main` 分支推送或手动触发时执行：安装依赖、typecheck、lint、unit test、build、上传 artifact 和部署 Pages。存在 `package-lock.json` 时工作流使用 `npm ci`；锁文件尚未生成时使用 `npm install` 完成一次可执行的验证构建并输出警告。仓库设置中选择 **Settings → Pages → Source → GitHub Actions**。

发布地址格式为：

```text
https://<github-user>.github.io/<repository-name>/
```

当前仓库未配置 Git remote，因此不能声称已完成实际远端发布。
