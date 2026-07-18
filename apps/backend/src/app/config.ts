import { z } from 'zod';

export const AppConfigSchema = z.object({
    env: z.enum(['development', 'test', 'production']).default('development'),
    port: z.number().int().positive().default(3000),
    debug: z.boolean().default(false),
    dataDir: z.string().default('./data'),
    jwt: z.object({
        accessSecret: z.string().min(1),
        refreshSecret: z.string().min(1),
        accessTokenTtl: z.string().default('15m'),
        refreshTokenTtl: z.string().default('30d')
    })
});

export type AppConfig = z.infer<typeof AppConfigSchema>;