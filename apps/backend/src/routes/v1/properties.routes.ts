import { Router } from 'express';

import { AppServices } from '../../app/server';
import { authenticationMiddleware, requireScopeMiddleware } from '../../middlewares/authentication';
import { CreatePropertySchema, UpdatePropertySchema } from '../../models';

export function createPropertiesRouter(services: AppServices): Router {
    const router = Router();

    router.use(authenticationMiddleware(services.authService));
    router.use(requireScopeMiddleware('TENANT'));

    router.get('/', async (req, res, next) => {
        try {
            const items = await services.propertyService.list(req.context.user!.inmobiliariaId!);
            res.json({ success: true, items });
        } catch (error) {
            next(error);
        }
    });

    router.get('/:id', async (req, res, next) => {
        try {
            const item = await services.propertyService.findById(req.context.user!.inmobiliariaId!, req.params.id);
            if (!item) {
                res.status(404).json({ success: false, message: 'Property not found', code: 'NOT_FOUND' });
                return;
            }

            res.json({ success: true, item });
        } catch (error) {
            next(error);
        }
    });

    router.post('/', async (req, res, next) => {
        try {
            const payload = CreatePropertySchema.parse(req.body);
            const item = await services.propertyService.create(req.context.user!.inmobiliariaId!, payload);
            res.status(201).json({ success: true, item });
        } catch (error) {
            next(error);
        }
    });

    router.put('/:id', async (req, res, next) => {
        try {
            const payload = UpdatePropertySchema.parse(req.body);
            const item = await services.propertyService.update(req.context.user!.inmobiliariaId!, req.params.id, payload);
            if (!item) {
                res.status(404).json({ success: false, message: 'Property not found', code: 'NOT_FOUND' });
                return;
            }

            res.json({ success: true, item });
        } catch (error) {
            next(error);
        }
    });

    router.delete('/:id', async (req, res, next) => {
        try {
            const deleted = await services.propertyService.softDelete(req.context.user!.inmobiliariaId!, req.params.id);
            if (!deleted) {
                res.status(404).json({ success: false, message: 'Property not found', code: 'NOT_FOUND' });
                return;
            }

            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    });

    return router;
}
