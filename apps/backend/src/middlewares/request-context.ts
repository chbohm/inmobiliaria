import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

import { RequestContext } from '../models';

declare module 'express-serve-static-core' {
    interface Request {
        context: RequestContext;
    }
}

export function requestContextMiddleware(req: Request, _res: Response, next: NextFunction) {
    req.context = {
        requestId: randomUUID()
    };

    next();
}
