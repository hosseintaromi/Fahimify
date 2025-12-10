import { execSync } from "child_process";
import { config } from "dotenv";
import { resolve } from "path";

const envPath = resolve(__dirname, "../.env.test");
config({ path: envPath });

const TEST_DB_NAME = "fahimify_test";
const POSTGRES_USER = process.env.USER || "hosseintaromi";
const POSTGRES_PASSWORD = "";
const POSTGRES_HOST = "localhost";

async function setupTestDatabase() {
  console.log("🔧 Setting up test database...");

  try {
    console.log(`📦 Dropping database ${TEST_DB_NAME} if exists...`);
    execSync(
      `psql -h ${POSTGRES_HOST} -U ${POSTGRES_USER} -d postgres -c "DROP DATABASE IF EXISTS ${TEST_DB_NAME};"`,
      { stdio: "inherit" }
    );

    console.log(`📦 Creating database ${TEST_DB_NAME}...`);
    execSync(
      `psql -h ${POSTGRES_HOST} -U ${POSTGRES_USER} -d postgres -c "CREATE DATABASE ${TEST_DB_NAME};"`,
      { stdio: "inherit" }
    );

    console.log("✅ Test database created successfully!");
    console.log(`📝 Database: ${TEST_DB_NAME}`);
    console.log(
      `🔗 Connection: postgresql://${POSTGRES_USER}:***@${POSTGRES_HOST}:5432/${TEST_DB_NAME}`
    );
  } catch (error) {
    console.error("❌ Failed to setup test database:", error);
    process.exit(1);
  }
}

async function resetDatabase() {
  console.log("🔄 Resetting test database...");

  try {
    console.log("🗑️  Truncating all tables...");
    execSync(
      `psql -h ${POSTGRES_HOST} -U ${POSTGRES_USER} -d ${TEST_DB_NAME} -c "DO $$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE'; END LOOP; END $$;"`,
      { stdio: "inherit" }
    );

    console.log("✅ Test database reset successfully!");
  } catch (error) {
    console.error("❌ Failed to reset test database:", error);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const isReset = args.includes("--reset");

if (isReset) {
  resetDatabase();
} else {
  setupTestDatabase();
}
