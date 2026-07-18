import * as fs from 'fs';
import { logger } from "../common/logger";
import { stringify } from '@liftcl/node-commons';

import { AppConfig, AppConfigSchema } from '../app/config';

let CONFIG_TS: string = undefined;

export const setConfigTs = (configTs: string) => {
    CONFIG_TS = configTs;
}


// Basically a Factory for the config
export class ConfigManager {

    // -------- Public methods --------
    public static getConfig(): AppConfig {
        return this.loadConfig();
    }


    // -------- Domain methods --------
    private static loadConfig(): AppConfig {
        let configFile = process.env["CONFIG_FILE_PATH"];
        let config;
        if (configFile) {
            config = ConfigManager.loadFromFile(configFile)
        } else {
            let configTs = process.env["CONFIG_TS"] || CONFIG_TS;
            if (configTs) {
                // This only works for local development since MODE is set in .devcontainer/Dockerfile
                config = ConfigManager.getConfigFromTs(configTs);
            } else {
                logger.error('It was not found MODE environment variable. Try rebuilding your vscode container . Check debug-qa script in package.json to see an example')
                throw 'Config not found';
            }
        }
        return this.parseConfig(config);
    }

    private static loadFromFile(configFile: string): string {
        logger.info(`Reading config file ${configFile}`);
        return fs.readFileSync(configFile).toString();
    }

    private static getConfigFromTs(config_ts: string): string {
        logger.info(`*********************************   LOADING CONFIG FROM ${config_ts} ***************************************`)
        const config = require(`../app/${config_ts}`).config;
        return stringify(config);
    }

    private static parseConfig(rawConfig: string): AppConfig {
        const parsed = AppConfigSchema.safeParse(JSON.parse(rawConfig));

        if (!parsed.success) {
            throw new Error(`Invalid app config: ${stringify(parsed.error.flatten())}`);
        }

        return parsed.data;
    }

}
