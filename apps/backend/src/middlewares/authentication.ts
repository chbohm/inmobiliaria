import { NextFunction, Request, Response } from 'express';

import { RequestScope } from '../models';
import { AuthService } from '../services/auth-service';

function extractBearerToken(req: Request): string | undefined {
    const header = req.header('authorization');
    if (!header) {
        return undefined;
    }

    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return undefined;
    }

    return token;
}

export function authenticationMiddleware(authService: AuthService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = extractBearerToken(req);
            if (!token) {
                res.status(401).json({ success: false, message: 'Missing bearer token', code: 'UNAUTHORIZED' });
                return;
            }

            req.context.user = await authService.authenticateAccessToken(token);
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unauthorized',
                code: 'UNAUTHORIZED'
            });
        }
    };
}

export function requireScopeMiddleware(scope: RequestScope) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.context.user || req.context.user.scope !== scope) {
            res.status(403).json({ success: false, message: 'Forbidden', code: 'FORBIDDEN' });
            return;
        }

        next();
    };
}
