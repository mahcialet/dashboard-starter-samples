import { createRequire } from "node:module";

const require = createRequire("/app/package.json");
const Database = require("better-sqlite3");

const database = new Database("/appdata/db/db.sqlite");
const sessionToken = process.env.HOMARR_SESSION_TOKEN;

if (!sessionToken) {
  throw new Error("HOMARR_SESSION_TOKEN is required");
}

const demoUser = database
  .prepare("SELECT id FROM user WHERE name = ? AND provider = 'credentials'")
  .get("demo");

if (!demoUser) {
  throw new Error("Homarr demo user was not created");
}

const expires = Date.now() + 10 * 365 * 24 * 60 * 60 * 1000;

database.transaction(() => {
  database
    .prepare(
      `INSERT INTO session (session_token, user_id, expires)
       VALUES (?, ?, ?)
       ON CONFLICT(session_token) DO UPDATE SET
         user_id = excluded.user_id,
         expires = excluded.expires`,
    )
    .run(sessionToken, demoUser.id, expires);

  database
    .prepare("UPDATE onboarding SET step = 'finish', previous_step = 'settings'")
    .run();
})();

database.close();
console.log("Homarr demo account and bypass session are ready");
