import { Router } from 'express';
import { z } from 'zod';

import { AppServices } from '../../app/server';
import { authenticationMiddleware, requireScopeMiddleware } from '../../middlewares/authentication';
import { BootstrapRequestSchema } from '../../models';
import { createGenericCrudRouter } from './generic-crud.routes';

const EmptyBodySchema = z.object({}).passthrough();

export function createSystemRouter(services: AppServices): Router {
    const router = Router();

    router.post('/bootstrap', async (req, res, next) => {
        try {
            const body = BootstrapRequestSchema.parse(req.body ?? EmptyBodySchema.parse({}));
            const result = await services.bootstrapService.bootstrapFirstTenant(body);
            res.status(result.bootstrapped ? 201 : 200).json({ success: true, result });
        } catch (error) {
            next(error);
        }
    });

    router.use(authenticationMiddleware(services.authService));
    router.use(requireScopeMiddleware('SYSTEM'));

    router.use('/tenants', createGenericCrudRouter('system-tenants'));
    router.use('/subscriptions', createGenericCrudRouter('system-subscriptions'));
    router.use('/users', createGenericCrudRouter('system-users'));

    router.get('/audit', (_req, res) => {
        res.json({ success: true, items: [] });
    });

    router.get('/dashboard', (_req, res) => {
        res.json({ success: true, metrics: {} });
    });

    return router;
}
