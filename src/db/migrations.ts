/** Append-only Dexie schema history. Version 2 adds stores in place; v1 stores and rows remain untouched. */
export const schemaHistory=[
  {version:1,description:"基础设置、最小演示记录和初始化元数据"},
  {version:2,description:"原位新增员工、知识、Skill、快照、Tool 与工单目录"},
] as const;
