# 最终验收记录（2026-08-28）

状态严格区分真实执行与配置/代码审查；`NOT VERIFIED` 不写成通过。发布阻断规则：第 16 项核心流水线或关键浏览器项未通过时阻断 Pages。

| # | 质量门槛 | 状态 | 验证命令/操作与证据 | 未验证原因 | 阻断 |
|---|---|---|---|---|---|
|1|核心页面可打开|NOT VERIFIED|`tests/e2e/app-shell.spec.ts` 已覆盖路由代码|本环境浏览器结果见执行记录|是|
|2|演示模式无需 Key|PASS|`npm run test`；`src/lib/runtime-mode.ts`|—|否|
|3|Agent 主链路与 Trace|PASS|`npm run test`；`src/core/agent/runAgent.test.ts`|—|否|
|4|配置持久化|PASS|`npm run test`；Dexie 测试|—|否|
|5|单条/批量同主链路|PASS|`npm run test`；`src/features/eval/service.ts`|—|否|
|6|选择 N 条只运行 N 条|PASS|`npm run test`；Eval service 测试|—|否|
|7|四状态正确|PASS|`npm run test`；评分器测试|—|否|
|8|评分有证据/runId|PASS|`npm run test`；评分器及报告 schema|—|否|
|9|双批次可比性|PASS|`npm run test`；compareBatches 测试|—|否|
|10|HTML/PDF/JSON/CSV|PASS|`npm run test`；报告导出单测；PDF 为浏览器打印方案|—|否|
|11|中文与指标一致|PASS|`npm run test`；中文 HTML、BOM、共用 metrics 测试|—|否|
|12|智能模式不伪装|PASS|`npm run test`；Mode 页面测试|—|否|
|13|Skill 快照回滚|PASS|`npm run test`；catalog tests|—|否|
|14|重置幂等|PASS|`npm run test`；database tests|—|否|
|15|无密钥|PASS|`rg -n '(sk-[A-Za-z0-9]|API_KEY=)' . --glob '!node_modules/**'`|—|否|
|16|type/lint/unit/build/E2E|NOT VERIFIED|`npm run validate` PASS；`npm run test:e2e` 因本机缺 Playwright Chromium 未执行业务断言；Actions 安装 Chromium 后为部署硬门槛|浏览器 executable 不存在|是|
|17|Pages 子路径|PASS|`VITE_BASE_PATH=/onboard-agentops/ npm run build`|浏览器子路径断言留给 CI|否|
|18|三种视口关键操作|NOT VERIFIED|Playwright desktop/mobile；另需 1280×720/1440×900|待浏览器执行|是|
|19|虚构数据声明|PASS|`rg -n '虚构' README.md src docs/FINAL_VALIDATION.md`|—|否|
|20|README 从零指导|PASS|人工审阅 `README.md`：安装、演示、测试、E2E、构建、Pages、重置、报告、安全|—|否|

## 报告专项

报告只从 `EvalBatch.caseSnapshot/caseResults`、对应 `EvalScore.runId`、`RunRecord`（含完整 steps/evidence/risk）、版本快照与人工草稿读取。页面和报告共同调用 `features/eval/service.metrics`，ERROR 不进入质量通过率分母。不可比回归显示“不可直接比较”，不生成改善结论；Judge 关闭时明确显示“规则评测，Judge 未启用”。
