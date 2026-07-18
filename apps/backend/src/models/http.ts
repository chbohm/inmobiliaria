export type RequestScope = 'TENANT' | 'SYSTEM';

export interface RequestUser {
    userId: string;
    sessionId: string;
    role: string;
    scope: RequestScope;
    inmobiliariaId?: string;
}

export interface RequestContext {
    requestId: string;
    user?: RequestUser;
}
