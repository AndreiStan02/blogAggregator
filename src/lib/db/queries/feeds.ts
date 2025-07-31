import { readConfig } from "src/config";
import { db } from "..";
import { feeds, feedsFollows, users } from "../schema";
import { eq, lt, gte, ne , and } from 'drizzle-orm';
import { getUser, getUserById } from "./users";

export async function addFeed(name: string, url: string, userId: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: userId}).returning();
    const aux = await createFeedFollow(result.user_id, result.id);
    if(!aux){
        throw new Error("Error: Couldnt register new feed to user.");
    }
    return result;
}

export async function getFeedByUrl(url: string){
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function getAllFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function createFeedFollow(userId: string, feedId: string){
    const [newFeedFollow] = await db.insert(feedsFollows).values({user_id: userId, feed_id: feedId});

    const result = await db.select({
        id: feedsFollows.id,
        createdAt: feedsFollows.createdAt,
        updatedAt: feedsFollows.updatedAt,
        feedName: feeds.name,
        userName: users.name
    }).from(feedsFollows)
        .innerJoin(users, eq(users.id, feedsFollows.user_id))
        .innerJoin(feeds, eq(feeds.id, feedsFollows.feed_id));
    
    if (result.length === 0) {
        return;
    }
    return result[0];
}

export async function deleteFeedFollow(userId: string, feedId: string){
    await db.delete(feedsFollows).where(
        and(
            eq(feedsFollows.user_id, userId),
            eq(feedsFollows.feed_id, feedId),
        )
    );
}

export async function getFeedFollowsForUser(userId: string){
    const result = await db.select({
        id: feedsFollows.id,
        createdAt: feedsFollows.createdAt,
        updatedAt: feedsFollows.updatedAt,
        feedName: feeds.name,
        userName: users.name
    }).from(feedsFollows)
        .innerJoin(users, eq(users.id, feedsFollows.user_id))
        .innerJoin(feeds, eq(feeds.id, feedsFollows.feed_id))
        .where(eq(feedsFollows.user_id, userId));
    
    return result;
}