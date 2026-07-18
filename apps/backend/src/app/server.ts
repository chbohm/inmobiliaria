import cors from 'cors';
import express, { Express } from 'express';

import { errorHandler } from '../middlewares/error-handler';
import { requestContextMiddleware } from '../middlewares/request-context';
import { createApiRouter } from '../routes';
import { AuthService } from '../services/auth-service';
import { BootstrapService } from '../services/bootstrap-service';
import { HealthService } from '../services/health-service';
import { PropiedadService } from '../services/property-service';

export interface AppServices {
    authService: AuthService;
    bootstrapService: BootstrapService;
    healthService: HealthService;
    propertyService: PropiedadService;
}

export function createServer(services: AppServices): Express {
    const app = express();

    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json({ limit: '2mb' }));
    app.use(requestContextMiddleware);
    app.use('/api/v1', createApiRouter(services));
    app.use(errorHandler);

    return app;
}
