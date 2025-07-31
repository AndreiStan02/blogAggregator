import { readConfig, setUser } from "./config.js";
import { fetchFeed } from "./fetchFeed.js";
import { db } from "./lib/db/index.js";
import { addFeed, getAllFeeds } from "./lib/db/queries/feeds.js";
import { resetDB } from "./lib/db/queries/reset.js";
import { createUser, getAllUsers, getUser, getUserById } from "./lib/db/queries/users.js";
import { Feed, User } from "src/lib/db/schema";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record< string, CommandHandler >;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void>{
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Unknown command: ${cmdName}`);
    }

    await handler(cmdName, ...args);
}

export async function handlerLogin(cmdName: string, ...args: string[]){
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    const existingUser = await getUser(userName);
    if (!existingUser) {
        throw new Error(`User ${userName} not found`);
    }

    setUser(existingUser.name);
    console.log("User switched successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]){
    if (args.length != 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    const user = await createUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`);
    }

    setUser(user.name);
    console.log("User created successfully!");
}

export async function handlerReset(cmdName: string, ...args: string[]){
    const result = await resetDB();
    console.log("DB reseted successfully!");
}

export async function handlerUsers(cmdName: string, ...args: string[]){
    const users = await getAllUsers();
    const config = readConfig();
    
    if (!users){
         throw new Error(`Couldn't get all users.`);
    }
    for(let user of users){
        const concat = user.name === config.currentUserName ? " (current)" : "";
        console.log(`* ${user.name}${concat}`);
    }
}

export async function handlerAgg(cmdName: string, ...args: string[]){
    const rssFeed = await fetchFeed("https://www.wagslane.dev/index.xml");
    const rssFeedStr = await JSON.stringify(rssFeed);
    console.log(rssFeedStr);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]){
    if (args.length != 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if(!user){
        throw new Error("Error getting current user id");
    }

    const name = args[0];
    const url = args[1];

    const result = await addFeed(name, url, user.id);
    if(!result){
        throw new Error("Error adding the feed.")
    }
    console.log("Feed created successfully:");
    printFeed(result, user);
}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getAllFeeds();
    const config = readConfig();
    
    if (!feeds){
         throw new Error(`Couldn't get all feeds.`);
    }

    for(let feed of feeds){
        const user = await getUserById(feed.user_id);
        if (!user){
            throw new Error("Couldnt find the user that created the feed.");
        }
        console.log(`Feed Name: ${feed.name}`);
        console.log(`- URL: ${feed.url}`);
        console.log(`- User Name: ${user.name}`);
    }
}