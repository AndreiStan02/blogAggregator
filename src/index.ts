import { setUser, readConfig } from "./config.js";

import { CommandsRegistry, registerCommand, runCommand, 
    handlerLogin } from "./commands.js";

const commandsRegistry: CommandsRegistry = {};
registerCommand(commandsRegistry, "login",handlerLogin);

function main(){
    console.log(readConfig());
    runCommand(commandsRegistry, process.argv[2], process.argv[3]);
    console.log(readConfig());
}

main();