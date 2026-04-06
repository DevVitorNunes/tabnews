import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrations = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  if (request.method === "GET") {
    const migrations = await migrationRunner(defaultMigrations);
    await dbClient.end();
    return response.status(200).json(migrations);
  }

  if (request.method === "POST") {
    const migrations = await migrationRunner({
      ...defaultMigrations,
      dryRun: false,
    });

    await dbClient.end();

    if (migrations.length > 0) {
      return response.status(201).json(migrations);
    }
    console.log(response.status(200).json(migrations));
    return response.status(200).json(migrations);
  }
  response.status(405);
}
