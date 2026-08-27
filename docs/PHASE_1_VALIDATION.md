# 第 1 阶段验证与补救记录

> 检查日期：2026-08-27  
> 范围：仅检查第 1 阶段工程、配置、数据底座与测试；未进入第 2 阶段。

## 1. 依赖安装状态

再次执行 `npm install --ignore-scripts`，npm 通过环境配置的代理访问官方 `https://registry.npmjs.org/` 时，对 `@eslint/js` 返回 HTTP 403。因此：

- 本环境没有生成 `node_modules`；
- 本环境没有生成 `package-lock.json`；
- 无法在本环境通过 npm 元数据证明所有指定版本真实存在，也无法读取各包实际安装后的 peer dependency 结果；
- 不把 TypeScript 语法解析或静态检查描述为 typecheck、lint、unit test、build 或 E2E 通过。

当前版本组合的静态兼容性设计如下：

| 组合                                                         | 静态检查结论                                                                                                            |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Node 20.20.2 / Vite 7.1.3                                    | `engines.node` 设置为 `>=20.19.0`，与本地 Node 主版本和 Vite 7 所需的 Node 20.19+ 边界一致。                            |
| React 19.1.1 / React DOM 19.1.1 / `@types/react*` 19.x       | 主版本一致；入口使用 React 19 支持的 `createRoot`。                                                                     |
| React Router DOM 7.8.2                                       | 使用仍属公开组件 API 的 `HashRouter`、`Routes`、`Route`、`NavLink`、`Navigate` 与 `Outlet`，没有混用 data router 配置。 |
| Vite 7.1.3 / `@vitejs/plugin-react` 5.0.2 / TypeScript 5.9.2 | 配置使用 ESM、bundler module resolution 和 project references；应用与 Node 配置分离。                                   |
| Tailwind 3.4.17 / PostCSS 8.5.6 / Autoprefixer 10.4.21       | 使用 Tailwind 3 的 `@tailwind` 指令及 PostCSS plugin 配置，没有混入 Tailwind 4 的 Vite plugin 写法。                    |
| ESLint 9.34 / typescript-eslint 8.41                         | 使用 ESLint 9 flat config，不使用已弃用的 `.eslintrc`。                                                                 |
| Vitest 3.2.4 / jsdom 26.1.0 / Testing Library 16.3.0         | Vitest 配置位于 Vite 配置的 `test` 字段，setup 引入 jest-dom 与 fake IndexedDB。                                        |
| Playwright 1.55.0                                            | E2E 配置使用生产 build + preview，不依赖开发服务器或后端服务。                                                          |
| Dexie 4.2.0 / fake-indexeddb 6.2.2                           | 数据测试调用真实 IndexedDB API 模拟，而不是用 React state 或数组替代数据库。                                            |

这些结论属于源码和配置交叉检查；只有成功安装后执行完整命令，才能最终确认实际包版本及 peer dependency 兼容性。

## 2. 静态交叉检查结果

- 所有 `src` 与 `tests` 中的相对 import 均能解析到现有 `.ts`、`.tsx`、`.js`、`.json` 或目录入口。
- `package.json` 包含 MASTER_PROMPT 要求的全部脚本；脚本引用的命令均在 dependencies/devDependencies 中声明。
- React 入口、Provider 包裹顺序、HashRouter 路由和页面导出互相匹配。
- 后续业务入口只渲染明确的“尚未实现”占位页，没有静态 PASS/FAIL、伪造 Run、Trace、Judge 或业务结果。
- 数据新增、运行模式保存和重置都写入 Dexie；不以临时 React state 冒充持久化。运行模式保存后由共享数据库 Context 更新导航标识。
- `demo:reset` 只输出浏览器端操作指引，不读取、修改或覆盖源码 Fixture。真正的重置由页面二次确认后，在 IndexedDB 事务中清空并重新写入固定 Fixture。
- IndexedDB 持久化测试关闭第一个 Dexie 实例，以同一数据库名创建新实例再读取；幂等测试在两次独立重置后比较 settings、records 和 meta 的完整内容。
- Playwright 使用 `/onboard-agentops/` 作为 baseURL，构建时设置相同的 `VITE_BASE_PATH`，业务路由只出现在 `#` 后；测试明确断言 module script 资源路径以仓库子路径开头，避免 base 重复或遗漏。

## 3. Pages 工作流策略

当前没有 lockfile，因此工作流不能无条件使用 `npm ci`。安装步骤采用可执行的条件策略：

1. 存在 `package-lock.json` 时使用 `npm ci`；
2. 不存在时输出 GitHub Actions warning 并使用 `npm install`；
3. 安装成功后依次执行 typecheck、lint、unit test 和 build；
4. 任一步骤非零退出都会阻止 artifact 上传和 deploy job。

生成并提交 lockfile 后，工作流会自动切换到可复现的 `npm ci`，无需再次修改 YAML。

## 4. 第 1 阶段人工验收步骤

在能够访问官方 npm registry 且提供 Chromium 的干净环境中执行：

1. 运行 `npm install`，确认生成并提交 `package-lock.json`，且 `npm ls` 无 invalid/peer dependency error；
2. 依次运行 `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` 和 `npm run validate`，记录真实退出码 0；
3. 运行 `npx playwright install chromium` 后执行 `npm run test:e2e`；
4. 运行 `npm run dev`，打开首页，确认初始化 loading 后进入概览且固定虚构数据声明可见；
5. 在数据管理页新增唯一记录，刷新页面，确认记录仍存在；
6. 关闭标签页并重新打开，确认记录仍存在；
7. 连续执行两次“重置数据”及二次确认，每次均确认只剩同一个初始记录；
8. 导出数据、添加记录、重新导入，确认导入恢复导出时快照；
9. 打开运行模式页，确认演示模式默认启用、无安全后端时智能模式显示不可用且不能切换；
10. 执行 `VITE_BASE_PATH=/onboard-agentops/ npm run build` 和 `npm run preview`，访问 `/onboard-agentops/#/` 与 `/onboard-agentops/#/data`，刷新后无 404，静态资源无失败请求；
11. 分别在 1440×900、1280×720、390×844 检查导航、对话框、长文本、Toast 和数据操作；
12. 在 GitHub Actions 中确认 install、typecheck、lint、test、build、artifact upload、deploy 依次成功后，再验收实际 Pages URL。

## 5. 当前结论

源码补救和静态交叉检查已完成，但依赖安装、完整类型检查、lint、unit test、生产构建、Playwright 和浏览器验证仍受 npm registry 403 限制。第 1 阶段保持“待验收”，不得进入第 2 阶段。
