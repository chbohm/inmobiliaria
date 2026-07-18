import { Router } from 'express';

import { AppServices } from '../app/server';
import { createAuthRouter } from './v1/auth.routes';
import { createDashboardRouter } from './v1/dashboard.routes';
import { createGenericCrudRouter } from './v1/generic-crud.routes';
import { createPropertiesRouter } from './v1/properties.routes';
import { createSystemRouter } from './v1/system.routes';

export function createApiRouter(services: AppServices): Router {
    const router = Router();

    router.use('/auth', createAuthRouter(services));
    router.use('/users', createGenericCrudRouter('users'));
    router.use('/roles', createGenericCrudRouter('roles'));
    router.use('/properties', createPropertiesRouter(services));
    router.use('/contacts', createGenericCrudRouter('contacts'));
    router.use('/contracts', createGenericCrudRouter('contracts'));
    router.use('/payments', createGenericCrudRouter('payments'));
    router.use('/documents', createGenericCrudRouter('documents'));
    router.use('/tasks', createGenericCrudRouter('tasks'));
    router.use('/audit', createGenericCrudRouter('audit'));
    router.use('/dashboard', createDashboardRouter(services));
    router.use('/system', createSystemRouter(services));

    return router;
}
