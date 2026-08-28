import { defineConfig, devices } from "@playwright/test";

const pagesBase = "/onboard-agentops/";
const previewOrigin = "http://127.0.0.1:4173";
const previewURL = `${previewOrigin}${pagesBase}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: previewURL,
    trace: "retain-on-failure",
  },
  webServer: {
    // Export once so both Vite build and preview resolve exactly the same Pages base.
    command:
      `export VITE_BASE_PATH=${pagesBase} && npm run build && npm run preview -- --host 127.0.0.1`,
    url: previewURL,
    reuseExistingServer: false,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
