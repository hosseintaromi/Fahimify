import { defineConfig } from "cypress";
import { config } from "dotenv";
import { resolve } from "path";
import { execSync } from "child_process";

const envPath = resolve(__dirname, ".env.test");
config({ path: envPath });

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      on("task", {
        resetDB() {
          console.log("🔄 Resetting test database...");
          try {
            execSync("npm run test:db:reset", { stdio: "inherit" });
            return null;
          } catch (error) {
            console.error("Failed to reset database:", error);
            throw error;
          }
        },
        log(message) {
          console.log(message);
          return null;
        },
      });

      config.env.DATABASE_URL = process.env.DATABASE_URL;
      config.env.JWT_SECRET = process.env.JWT_SECRET;

      return config;
    },
  },
});
