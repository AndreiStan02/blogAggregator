import { db } from "..";
import { users } from "../schema";
import { eq, lt, gte, ne } from 'drizzle-orm';

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  if (result.length === 0) {
    return;
  }
  return result[0];
}

export async function getAllUsers() {
    const result = await db.select({name: users.name}).from(users);
    return result;
}