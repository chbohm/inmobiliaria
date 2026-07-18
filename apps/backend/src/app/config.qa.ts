import { AppConfig } from "./config";

export const config: AppConfig = {
    env: "development",
    debug: true,
    port: 8005,
    dataDir: "./data",
    jwt: {
        accessSecret: "dev-access-secret",
        refreshSecret: "dev-refresh-secret",
        accessTokenTtl: "15m",
        refreshTokenTtl: "30d"
    }
};
