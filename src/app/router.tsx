import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { HomePage } from "../routes/HomePage";
import { DataPage } from "../routes/DataPage";
import { ModePage } from "../routes/ModePage";
import { NotFoundPage } from "../routes/NotFoundPage";
import { SkillsPage } from "../routes/SkillsPage";
import { ToolsPage } from "../routes/ToolsPage";
import { KnowledgePage } from "../routes/KnowledgePage";
import { CatalogPage } from "../routes/CatalogPage";
import { WorkspacePage } from "../routes/WorkspacePage";
import { RunDetailPage, RunsPage } from "../routes/RunsPage";
import { EvalBatchDetailPage, EvalBatchesPage, EvalCasesPage, EvalComparePage } from "../routes/EvalPage";
import { AgentsPage } from "../routes/AgentsPage"; import { PlannerPage } from "../routes/PlannerPage"; import { ModelsPage } from "../routes/ModelsPage"; import { OpsPage } from "../routes/OpsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="data" element={<DataPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="tools" element={<ToolsPage />} />
        <Route path="knowledge" element={<KnowledgePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="mode" element={<ModePage />} />
        <Route
          path="workspace"
          element={<WorkspacePage />}
        />
        <Route path="chat" element={<WorkspacePage chat />} />
        <Route path="runs" element={<RunsPage />} />
        <Route path="runs/:id" element={<RunDetailPage />} />
        <Route path="agents" element={<AgentsPage />} /><Route path="planner" element={<PlannerPage />} /><Route path="models" element={<ModelsPage />} /><Route path="ops" element={<OpsPage />} />
        <Route path="eval" element={<Navigate to="/eval/cases" replace />} /><Route path="eval/cases" element={<EvalCasesPage />} /><Route path="eval/batches" element={<EvalBatchesPage />} /><Route path="eval/batches/:id" element={<EvalBatchDetailPage />} /><Route path="eval/compare" element={<EvalComparePage />} />
        <Route path="settings" element={<Navigate to="/mode" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
