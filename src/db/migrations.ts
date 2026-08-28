/** Append-only Dexie schema history. Version 2 adds stores in place; v1 stores and rows remain untouched. */
export const schemaHistory=[
  {version:1,description:"基础设置、最小演示记录和初始化元数据"},
  {version:2,description:"原位新增员工、知识、Skill、快照、Tool 与工单目录"},
  {version:3,description:"新增统一执行链路 RunRecord"},
  {version:4,description:"非破坏性新增 Agent、Planner、配置快照与运营闭环数据"},
] as const;
// v5/v6 add Eval cases/scores and batches/regressions; v7 adds report drafts and export audit records without rewriting existing rows.
