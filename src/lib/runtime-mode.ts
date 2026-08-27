export const agentApiBaseUrl =
  (import.meta.env.VITE_AGENT_API_BASE_URL as string | undefined)?.trim() ?? "";
export const smartModeConfigured = agentApiBaseUrl.length > 0;
export const runtimeModes = {
  demo: {
    label: "演示稳定模式",
    description: "默认使用确定性本地 Fixture；无需 API Key。",
    available: true,
  },
  smart: {
    label: "智能模式",
    description: smartModeConfigured
      ? "已配置安全后端代理。"
      : "未配置安全后端，当前不可运行。",
    available: smartModeConfigured,
  },
} as const;
