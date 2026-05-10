import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";

let _sql: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function init(): void {
  if (_db) return;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  _sql = postgres(url, { max: 10 });
  _db = drizzle(_sql, { schema });
}

/**
 * 懒加载的 db 代理。第一次访问任意属性时才会真正连库。
 * 让上层代码可以在没有 DATABASE_URL 的环境（如 health check / 单元测试）下导入。
 */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    init();
    return Reflect.get(_db as object, prop, receiver);
  },
});

export function getSql(): ReturnType<typeof postgres> {
  init();
  return _sql as ReturnType<typeof postgres>;
}

export type DB = typeof db;
