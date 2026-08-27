# OnboardOps 第 0 阶段检查与实施计划

> 检查日期：2026-08-27  
> 本文仅记录第 0 阶段的仓库检查与规划，不包含第 1～8 阶段的业务实现。

## 1. 当前仓库状态

- 当前分支为 `work`，检查开始时工作区干净。
- 仓库目前仅包含 `.gitkeep` 与 `docs/MASTER_PROMPT.md` 两个已跟踪文件。
- 当前没有 `package.json`、应用源码、测试、构建配置或 GitHub Actions 工作流。
- 仓库没有配置 Git remote，因此现阶段无法验证实际 GitHub Pages 地址或执行远端发布。
- 环境已提供 Node.js `v20.20.2` 与 npm `11.4.2`，可供下一阶段初始化工程时使用。
- 未发现任何 `AGENTS.md`，除任务提示与 `docs/MASTER_PROMPT.md` 外没有额外的仓库级说明。

## 2. 核心目标

构建一个以虚构企业“星云保险集团”的员工入职场景为首个深度模板、同时保持平台层与业务模板层解耦的 AgentOps 测评运营平台。平台的核心不是静态聊天界面，而是让使用者完整操作以下闭环：

1. 配置 Agent、Planner、Skill、Tool、知识与业务 Fixture；
2. 通过统一的 Agent → Planner → Validator → Executor → Risk Check 主链路产生可审计 Trace；
3. 从 Run 创建评测用例，并以同一主链路执行单条与批量 Eval；
4. 使用确定性规则评分，严格区分 PASS、FAIL、REVIEW 与 ERROR；
5. 定位根因、形成最小配置改动、创建版本并执行可比回归；
6. 导出包含设计单、运行报告、Bad Case 改进与回归决策单的完整中文测评包。

## 3. 不可妥协的硬约束

### 3.1 运行与发布

- 主项目必须是 React + TypeScript + Vite 静态前端，不依赖常驻 Node/Python 服务或服务端写盘。
- 必须兼容 GitHub Pages 仓库子路径，优先采用 `HashRouter`，所有资源路径需服从 Vite `base`。
- `npm run build` 必须生成可直接部署的静态产物，并提供执行完整验证后部署 Pages 的 GitHub Actions 工作流。
- 默认“演示稳定模式”不需要 API Key，且必须通过真实、确定性的本地 Agent 主链路运行；不得写死结果状态。
- “智能模式”只能通过可配置的安全后端适配器接入。未配置 `VITE_AGENT_API_BASE_URL` 时必须明确失败，不得在浏览器保存或调用长期密钥，也不得伪装成功。

### 3.2 数据、真实性与持久化

- 所有企业、人员、制度、地址、状态和指标均为虚构演示数据；固定免责声明必须在产品中显著展示。
- IndexedDB（Dexie）持久化所有可变配置、运行、评测、标注和报告数据；Fixture 仅用于首次导入和幂等重置。
- 必须实现初始化检测、Schema 迁移、全量导入导出、二次确认重置和刷新后持久化。
- 精确业务事实只能来自 Tool 或知识证据，模型或 Fixture Agent 不得编造。

### 3.3 架构与执行真实性

- 平台能力层与企业入职模板层解耦；数据库、业务规则、UI 和 Agent 执行逻辑不得堆在单一文件。
- Planner 仅能选择存在且启用的能力；Validator 必须在 Executor 前独立校验身份、权限、必需能力、知识检索和风险能力。
- Executor 按计划真实执行并记录版本、输入输出、时序、证据和结构化错误；失败不得伪装成功。
- 最终回复必须经过 `privacy-risk-check`；用户输入风险、Agent 回复风险与是否允许发送必须分开判断。
- 工作台、聊天、单条 Eval 和批量 Eval 必须共用同一执行主链路，不能读取旧 Run 冒充本次运行。
- 配置编辑必须持久化并影响后续执行；Skill 修改前需生成版本快照，支持 diff 和回滚。

### 3.4 Eval、指标与报告

- 至少提供 36 条覆盖正常、多轮、Tool/知识、隐私安全、转人工与质量问题的评测用例。
- 规则评分器应为可单测纯函数，并提供可复核证据；关键词要求支持 AND/OR。
- ERROR 不计为质量 FAIL，REVIEW 不得算作 PASS；分母为零时指标显示 `—`。
- 批次必须保存精确 caseIds、快照、hash 和各能力版本；选择 N 条只能运行 N 条，单条 ERROR 后继续。
- 回归比较前必须检查用例、评分器、Provider/模型、参数、Tool、知识和 Fixture 的一致性；不一致时明确标记不可直接比较。
- Judge 默认关闭且不得伪造分数；配置后仍需校验输出，失败转 REVIEW 或 ERROR。
- 报告必须能离线导出中文 HTML、打印/PDF、UTF-8 BOM CSV 与可校验/导入的 JSON；页面指标和报告指标必须来自同一计算逻辑。

### 3.5 体验、测试与阶段纪律

- 中文专业后台需适配 1440×900、1280×720 和 390×844；状态不能只用颜色表示，核心页面需覆盖 loading、empty、error、success。
- 每阶段只能在上一阶段验证通过后开始；每次报告实际变更、真实命令与退出码、浏览器验证、遗留事项和风险。
- 最终验证必须覆盖 typecheck、lint、unit test、build、核心 Playwright E2E、Pages 子路径、数据持久化/重置、报告导出与无密钥检查。
- 不覆盖或删除无关用户改动，不隐藏失败，不声称未实际执行的验证通过。

## 4. 分阶段实施计划

### 第 1 阶段：工程骨架、视觉基线与本地数据层

初始化锁定依赖的 Vite React TypeScript 工程；配置 HashRouter、Pages base、Tailwind、基础组件与响应式后台壳；设计 Dexie schema、迁移、Fixture 首次导入、导入导出和幂等重置；建立模式配置与免责声明；加入单元测试、Playwright 基础设施、校验脚本和 Pages 工作流。完成 MASTER_PROMPT 第 1.5 节全部验收后停止并汇报。

### 第 2 阶段：企业入职业务模板与能力注册中心

补齐至少 12 名员工及规定异常案例、12 份知识文档、14 个 Skill 和 11 个真实本地 Tool；实现确定性知识检索、权限/超时/结构错误注入以及 `/skills`、`/tools`、`/knowledge`、`/catalog` 管理页面，验证持久配置确实影响后续读取。

### 第 3 阶段：统一 Agent 主链路与可观测 Trace

实现 Planner、独立 Plan Validator、Executor、Provider Adapter、Risk Check 与完整 RunRecord；实现 `/workspace`、`/chat`、`/runs`、`/runs/:id`，验证正常、追问、拒绝、Tool 异常与人工接管链路均产生真实 Trace 和证据。

### 第 4 阶段：Agent/Planner/模型配置与运营闭环

实现 `/agents`、`/planner`、`/models`、`/ops`，并完成标注、根因分类、Bad Case、改进建议、最小 diff、版本快照、确认应用和回归入口。验证无安全后端的智能模式明确不可用。

### 第 5 阶段：评测集 CRUD、单条运行与规则评分

定义 EvalCase schema，初始化至少 36 条覆盖要求的用例；实现纯函数评分器和 `/eval/cases` 的 CRUD、筛选、导入导出、从 Run 创建及单条运行，确保评分基于本次统一主链路 Run 与证据。

### 第 6 阶段：批量评测与可比回归

实现 EvalBatch 快照与版本 hash、队列进度、取消、防重复、错误隔离、统计守恒；完成 `/eval/batches`、详情与 `/eval/compare`，对不一致实验条件阻止直接结论并突出新增失败。

### 第 7 阶段：三联测评报告与导出

实现 Eval 设计单、运行报告、Bad Case 改进与回归决策单的可编辑预览与合并测评包；共享指标计算，支持离线 HTML、打印/PDF、CSV 和 JSON；逐项验证中文、分页、溢出、重导入、ERROR 分母和不可比提示。

### 第 8 阶段：全链路质量收口与 Pages 发布准备

补齐 MASTER_PROMPT 第 8 节全部单测和浏览器路径，验证三种视口、GitHub Pages 子路径、持久化与重置、密钥扫描和完整 `validate`；完善 README 与部署工作流。仅在存在远端且获得发布条件时执行推送/Pages 配置，否则准确记录未发布状态。

## 5. 第 1 阶段预计创建或修改的文件

以下为预估清单，实际初始化时可因兼容的依赖版本或脚手架输出做小幅调整，但不会提前创建后续业务模块：

```text
package.json
package-lock.json
index.html
vite.config.ts
tsconfig.json
tsconfig.app.json
tsconfig.node.json
eslint.config.js
postcss.config.js
tailwind.config.ts
.gitignore
README.md
.github/workflows/pages.yml
public/fixtures/manifest.json
scripts/demo-reset.mjs
src/main.tsx
src/vite-env.d.ts
src/app/App.tsx
src/app/router.tsx
src/app/AppShell.tsx
src/components/ui/*
src/routes/HomePage.tsx
src/routes/NotFoundPage.tsx
src/styles/index.css
src/types/persistence.ts
src/data/fixtures/index.ts
src/db/database.ts
src/db/schema.ts
src/db/migrations.ts
src/db/seed.ts
src/db/backup.ts
src/db/reset.ts
src/lib/runtime-mode.ts
src/lib/github-pages.ts
src/test/setup.ts
src/db/*.test.ts
tests/e2e/app-shell.spec.ts
tests/e2e/persistence.spec.ts
tests/e2e/pages-base.spec.ts
playwright.config.ts
```

第 1 阶段不会创建完整的员工目录、Skill/Tool 注册中心、Agent 执行器、Eval 批次或报告实现；这些严格留在各自阶段增量完成。

## 6. 主要技术风险与验证方式

| 风险 | 影响 | 预防与验证 |
| --- | --- | --- |
| GitHub Pages 子路径或路由刷新失效 | 部署后白屏、资源 404 | 使用 HashRouter 与可配置 Vite base；在非根路径提供构建产物，使用 Playwright 检查页面和资源请求均成功。 |
| IndexedDB 迁移/重置非幂等 | 用户数据丢失或演示状态漂移 | 为版本迁移、首次 seed、写入后重载、导入导出和连续两次重置编写 Vitest/浏览器测试。 |
| 前端无安全后端却暴露密钥 | 严重安全违规 | 仅保存后端 URL 和非秘密配置；构建产物与 Git 历史执行密钥模式扫描；智能模式无代理时测试明确错误状态。 |
| Planner 或回复编造精确业务事实 | 评测不可信 | Validator 强制精确状态匹配 Tool；Run 保存证据引用；以单测和 E2E 检查回复事实能回溯至 Tool/知识。 |
| UI、单条 Eval 与批次走不同逻辑 | 结果不可复现 | 暴露唯一 application service 执行入口；对不同入口断言生成同构 RunRecord，并禁止评分器接收无 runId 的旧结果。 |
| 异步 Tool 超时/坏结构破坏整批 | 批次卡死或错误误判 | 使用超时控制和 zod 边界校验；注入空结果、权限、超时和坏结构；断言 ERROR 后下一用例继续。 |
| PASS/FAIL/REVIEW/ERROR 指标混算 | 运营结论错误 | 集中实现纯函数指标；覆盖零分母、ERROR、REVIEW 和 `total = pass + fail + review + error` 测试。 |
| 版本快照/hash 不完整 | 回归结论不可比 | 对用例、评分器、能力、Provider 参数和 Fixture 使用稳定序列化 hash；篡改单项逐一验证“不可直接比较”原因。 |
| 中文 PDF 字体、分页或大 Trace 溢出 | 报告不可交付 | 优先验证浏览器打印方案；对固定中文报告做离线 HTML、PDF 视觉检查和各视口/打印截图，完整 Trace 仅保留在 JSON。 |
| 大量 Fixture 与配置导致 bundle 过大 | Pages 加载慢 | 分离模板数据、按路由懒加载；检查构建 chunk 报告和浏览器加载时延，必要时拆包。 |
| 依赖版本互相冲突 | 工程初始化或 CI 不稳定 | 使用 Node 20 环境下兼容的稳定版本并提交 lockfile；依次运行安装、typecheck、lint、test、build 与 Playwright。 |
| 当前无 Git remote | 无法确认真实 Pages URL | 第 8 阶段前检查 remote/仓库名；无授权时只交付工作流与步骤，不声称已发布。 |

## 7. 每阶段统一验收记录格式

后续每个阶段的汇报固定包含：实际修改文件、真实功能、每条验证命令及退出码、实际浏览器操作与观察结果、未完成事项、已知风险。任何必需验证失败时先留在当前阶段修复，不进入下一阶段。
