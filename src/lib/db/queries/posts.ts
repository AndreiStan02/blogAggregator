import { db } from "..";
import { posts, feeds, users, feedsFollows} from "../schema";
import { eq, lt, gte, ne , and ,sql} from 'drizzle-orm';

export async function createPost(title: string, url: string, feedId: string ,publishedAt: Date,description?: string) {
    if(await db.select().from(posts).where(eq(posts.title, title))){
        return;
    }
    const [result] = await db.insert(posts).values({title: title, url: url, published_at: publishedAt,description: description,feed_id: feedId}).returning();
    return result;
}

export async function getPostsForUser(userId: string, limit: number) {
    const result = await db
        .select({
            id: posts.id,
            title: posts.title,
            url: posts.url,
            publishedAt: posts.published_at,
            description: posts.description,
        })
        .from(posts)
        .innerJoin(feeds, eq(posts.feed_id, feeds.id))
        .where(eq(feeds.user_id, userId))
        .orderBy(posts.published_at)
        .limit(limit);
    return result;
}