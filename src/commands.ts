import { readConfig, setUser } from "./config.js";
import { db } from "./lib/db/index.js";
import { resetDB } from "./lib/db/queries/reset.js";
import { createUser, getAllUsers, getUser } from "./lib/db/queries/users.js";

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