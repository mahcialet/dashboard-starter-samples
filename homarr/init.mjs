import { existsSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire("/app/package.json");
const Database = require("better-sqlite3");

const database = new Database("/appdata/db/db.sqlite");
const sessionToken = process.env.HOMARR_SESSION_TOKEN;
const downloadsHiddenMarker = "/appdata/.dashboard-sample-downloads-hidden-v1";

if (!sessionToken) {
  throw new Error("HOMARR_SESSION_TOKEN is required");
}

const demoUser = database
  .prepare(
    "SELECT id, home_board_id AS homeBoardId FROM user WHERE name = ? AND provider = 'credentials'",
  )
  .get("demo");

if (!demoUser) {
  throw new Error("Homarr demo user was not created");
}

if (!demoUser.homeBoardId) {
  throw new Error("Homarr demo user has no home board");
}

const expires = Date.now() + 10 * 365 * 24 * 60 * 60 * 1000;
const shouldHideDownloads = !existsSync(downloadsHiddenMarker);

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

  if (shouldHideDownloads) {
    database
      .prepare(
        `DELETE FROM item
         WHERE board_id = ?
           AND kind = 'downloads'
           AND EXISTS (
             SELECT 1
             FROM integration_item
             INNER JOIN integration
               ON integration.id = integration_item.integration_id
             WHERE integration_item.item_id = item.id
               AND integration.kind = 'mock'
           )`,
      )
      .run(demoUser.homeBoardId);
  }
})();

database.close();

if (shouldHideDownloads) {
  writeFileSync(
    downloadsHiddenMarker,
    "Homarr built-in mock Downloads widget hidden by dashboard-starter-samples\n",
  );
}

console.log("Homarr demo account and bypass session are ready");
