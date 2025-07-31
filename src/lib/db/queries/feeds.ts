import { readConfig } from "src/config";
import { db } from "..";
import { feeds } from "../schema";
import { eq, lt, gte, ne } from 'drizzle-orm';
import { getUser } from "./users";

export async function addFeed(name: string, url: string, userId: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: userId}).returning();
    return result;
}

export async function getAllFeeds() {
    const result = await db.select().from(feeds);
    return result;
}
