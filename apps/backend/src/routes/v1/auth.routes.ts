import { Router } from 'express';

import { AppServices } from '../../app/server';
import { authenticationMiddleware } from '../../middlewares/authentication';
import { LoginRequest, LoginRequestSchema, RefreshRequestSchema } from '../../models';

export function createAuthRouter(services: AppServices): Router {
    const router = Router();

    router.post('/login', async (req, res, next) => {
        try {
            const payload: LoginRequest = LoginRequestSchema.parse(req.body);
            const result = await services.authService.login({
                email: payload.email,
                password: payload.password,
                inmobiliariaId: payload.inmobiliariaId
            });
            res.json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    });

    router.post('/refresh', async (req, res, next) => {
        try {
            const payload = RefreshRequestSchema.parse(req.body);
            const result = await services.authService.refresh(payload.refreshToken);
            res.json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    });

    router.post('/logout', authenticationMiddleware(services.authService), async (req, res, next) => {
        try {
            await services.authService.logout(req.context.user!);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    });

    router.post('/logout-all', authenticationMiddleware(services.authService), async (req, res, next) => {
        try {
            await services.authService.logoutAll(req.context.user!);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    });

    router.post('/request-password-reset', (_req, res) => {
        res.json({ success: true, message: 'Password reset request skeleton' });
    });

    router.post('/reset-password', (_req, res) => {
        res.json({ success: true, message: 'Password reset skeleton' });
    });

    router.get('/me', authenticationMiddleware(services.authService), async (req, res, next) => {
        try {
            const user = await services.authService.getCurrentUser(req.context.user!);
            res.json({ success: true, user });
        } catch (error) {
            next(error);
        }
    });

    return router;
}
