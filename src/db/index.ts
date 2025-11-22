import assert from "node:assert/strict";
import { AsyncLocalStorage } from "node:async_hooks";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { getLogger } from "../logger.js";
import { runMigrations, seedDatabase } from "./migrate.js";
import * as schema from "./schema.js";

const sqlite = createClient({
  url: "file:db.sqlite",
});
const logger = getLogger("db");

export type DatabaseInstance = ReturnType<typeof drizzle<typeof schema>>;

const testDatabaseContext = new AsyncLocalStorage<{
  db: DatabaseInstance;
}>();

let _defaultDatabase: DatabaseInstance | undefined;
let _testDatabase: DatabaseInstance | undefined;
let _testDatabaseInit: Promise<void> | undefined;

function createTestDatabase(): DatabaseInstance {
  const testSqlite = createClient({
    url: ":memory:",
  });
  return drizzle(testSqlite, {
    schema,
    logger: { logQuery: (query, params) => logger.debug(query.trim(), { params }) },
  });
}

export function getCurrentDatabase(): DatabaseInstance {
  if (process.env.NODE_ENV === "test") {
    const contextDb = testDatabaseContext.getStore()?.db;
    assert.ok(
      contextDb,
      "No database instance found in test mode. Ensure that you are using `withTestDatabase` to wrap your tests.",
    );
    return contextDb;
  }

  assert.ok(
    _defaultDatabase,
    "No database instance found. Ensure that you are using `setDatabase` to set the default database instance.",
  );
  return _defaultDatabase;
}

export function setDatabase(db: DatabaseInstance) {
  _defaultDatabase = db;
}

export const db = new Proxy(
  {},
  {
    get(_target, prop) {
      return getCurrentDatabase()[prop as keyof DatabaseInstance];
    },
  },
) as DatabaseInstance;

export async function withTestDatabase(
  fn: (db: DatabaseInstance) => Promise<void>,
  options?: { fresh?: boolean },
): Promise<void> {
  if (options?.fresh) {
    const testDatabase = createTestDatabase();
    await runMigrations(testDatabase);
    await seedDatabase(testDatabase);

    return testDatabaseContext.run({ db: testDatabase }, async () => {
      return fn(testDatabase);
    });
  }

  if (_testDatabaseInit) {
    await _testDatabaseInit;
  }

  assert.ok(_testDatabase, "Test database not initialized. This should not happen in test mode.");

  return _testDatabase.transaction(async (tx) => {
    const dbInstance = tx as unknown as DatabaseInstance;
    return testDatabaseContext.run({ db: dbInstance }, async () => {
      return fn(dbInstance);
    });
  });
}

if (process.env.NODE_ENV === "test") {
  _testDatabaseInit = (async () => {
    _testDatabase = createTestDatabase();
    await runMigrations(_testDatabase);
    await seedDatabase(_testDatabase);
  })();
} else {
  setDatabase(
    drizzle(sqlite, {
      schema,
      logger: { logQuery: (query, params) => logger.debug(query.trim(), { params }) },
    }),
  );
}
