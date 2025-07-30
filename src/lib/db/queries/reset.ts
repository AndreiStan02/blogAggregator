import { db } from "..";
import { users } from "../schema";

export async function resetDB() {
  const [result] = await db.delete(users).returning();
  return result;
}