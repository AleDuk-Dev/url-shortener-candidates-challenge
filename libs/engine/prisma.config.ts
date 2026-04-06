import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join(import.meta.dirname, "prisma", "schema.prisma"),
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrate: {
    adapter: async () => {
      const { PrismaLibSql } = await import("@prisma/adapter-libsql");
      return new PrismaLibSql({ url: env("DATABASE_URL") });
    },
  },
});

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}
