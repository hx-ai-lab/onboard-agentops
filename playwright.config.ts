import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:4173/onboard-agentops/",
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "VITE_BASE_PATH=/onboard-agentops/ npm run build && npm run preview -- --host 127.0.0.1",
    url: "http://127.0.0.1:4173/onboard-agentops/",
    reuseExistingServer: false,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});
