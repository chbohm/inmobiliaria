import { Router } from 'express';

import { AppServices } from '../../app/server';

export function createDashboardRouter(services: AppServices): Router {
    const router = Router();

    router.get('/summary', (_req, res) => {
        res.json({
            success: true,
            summary: {
                health: services.healthService.getStatus(),
                properties: 0,
                activeContracts: 0,
                upcomingExpirations: 0,
                income: 0,
                latePayments: 0,
                pendingTasks: 0
            }
        });
    });

    router.get('/upcoming-expirations', (_req, res) => {
        res.json({ success: true, items: [] });
    });

    router.get('/late-payments', (_req, res) => {
        res.json({ success: true, items: [] });
    });

    return router;
}
