import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string,
    currentUserName: string,
};

function getConfigFilePath(): string {
    return path.join(os.homedir() ,".gatorconfig.json");
}

function validateConfig(rawConfig: any): Config {
    if (rawConfig.db_url){
        return {dbUrl: rawConfig.db_url, currentUserName: rawConfig.current_user_name};
    } else {
        throw new Error("Error validating the config json.");
    }
}

function writeConfig(config: Config){
    const path = getConfigFilePath();
    let configString = {"db_url": config.dbUrl, "current_user_name": config.currentUserName};
    fs.writeFileSync(path, JSON.stringify(configString));
}

export function setUser(userName: string){
    let config = readConfig();
    config.currentUserName = userName;
    writeConfig(config);
}

export function readConfig(): Config {
    const path = getConfigFilePath();
    const data = fs.readFileSync(path,'utf-8');
    return validateConfig(JSON.parse(data));
}