import { setUser } from "./config.js";

type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record< string, CommandHandler >;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    try{
        registry[cmdName](cmdName, ...args);
    } catch (err) {
        throw new Error(`Error running the command ${cmdName}`);
    }
}

export function handlerLogin(cmdName: string, ...args: string[]){
    if(args[0] === undefined){
        throw new Error("Name is needed to login!");
    }
    setUser(args[0]);
    console.log(`The user has been set to: ${args[0]}`);
}