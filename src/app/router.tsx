import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { HomePage } from "../routes/HomePage";
import { DataPage } from "../routes/DataPage";
import { ModePage } from "../routes/ModePage";
import { PlaceholderPage } from "../routes/PlaceholderPage";
import { NotFoundPage } from "../routes/NotFoundPage";
import { SkillsPage } from "../routes/SkillsPage";
import { ToolsPage } from "../routes/ToolsPage";
import { KnowledgePage } from "../routes/KnowledgePage";
import { CatalogPage } from "../routes/CatalogPage";

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
          element={<PlaceholderPage title="Agent 工作台" />}
        />
        <Route path="runs" element={<PlaceholderPage title="运行记录" />} />
        <Route path="eval" element={<PlaceholderPage title="Eval 测评" />} />
        <Route path="settings" element={<Navigate to="/mode" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
