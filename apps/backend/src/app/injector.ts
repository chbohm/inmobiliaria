import { stringify } from '@liftcl/node-commons';
import { Server } from 'http';

import { DataPaths } from '../common/paths';
import { logger } from '../common/logger';
import { FileSystemSystemDaoFactory } from '../daos/filesystem/FileSystemSystemDaoFactory';
import { FileSystemTenantDaoFactory } from '../daos/filesystem/FileSystemTenantDaoFactory';
import { AuthService } from '../services/auth-service';
import { BootstrapService } from '../services/bootstrap-service';
import { HealthService } from '../services/health-service';
import { PropiedadService } from '../services/property-service';
import { createServer } from './server';
import { ConfigManager } from '../config/ConfigManager';
import { AppConfig } from './config';

export class Injector {
    public static INSTANCE: Injector;

    private config!: AppConfig;
    private server?: Server;
    private isStartingUp = true;

    private constructor() {
        process.on('uncaughtException', (err) => {
            logger.error(`There was an uncaught error: ${err.message}`);
            if (this.isStartingUp) {
                process.exit(1);
            }
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error(`Unhandled Rejection at: ${stringify(promise)} : ${stringify(reason)}`);
            if (this.isStartingUp) {
                process.exit(1);
            }
        });
    }

    public static getInstance(): Injector {
        if (!Injector.INSTANCE) {
            Injector.INSTANCE = new Injector();
        }

        return Injector.INSTANCE;
    }

    public async init() {
        this.isStartingUp = true;
        this.config = ConfigManager.getConfig();

        const dataPaths = new DataPaths(this.config.dataDir);
        const systemDaoFactory = new FileSystemSystemDaoFactory(dataPaths);
        const authService = new AuthService(
            this.config,
            systemDaoFactory,
            (inmobiliariaId: string) => new FileSystemTenantDaoFactory(dataPaths, inmobiliariaId)
        );
        const bootstrapService = new BootstrapService(
            systemDaoFactory,
            (inmobiliariaId: string) => new FileSystemTenantDaoFactory(dataPaths, inmobiliariaId)
        );
        const healthService = new HealthService();
        const propertyService = new PropiedadService(
            (inmobiliariaId: string) => new FileSystemTenantDaoFactory(dataPaths, inmobiliariaId)
        );
        const app = createServer({
            authService,
            bootstrapService,
            healthService,
            propertyService
        });

        logger.info('');
        logger.info('___________________________________________________________________________');
        logger.info('              Starting Inmobiliaria SaaS Skeleton Application             ');
        logger.info('___________________________________________________________________________');
        logger.info('');
        logger.info(`Configuration loaded for env=${this.config.env} port=${this.config.port}`);

        await new Promise<void>((resolve) => {
            this.server = app.listen(this.config.port, () => {
                logger.info(`HTTP server listening on port ${this.config.port}`);
                resolve();
            });
        });

        this.isStartingUp = false;
    }

    public getConfig(): AppConfig {
        return this.config;
    }

    public async close(): Promise<void> {
        if (!this.server) {
            return;
        }

        await new Promise<void>((resolve, reject) => {
            this.server?.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }
}