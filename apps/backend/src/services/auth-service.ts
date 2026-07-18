import { compare, hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

import { AppConfig } from '../app/config';
import { FileSystemSystemDaoFactory } from '../daos/filesystem/FileSystemSystemDaoFactory';
import { FileSystemTenantDaoFactory } from '../daos/filesystem/FileSystemTenantDaoFactory';
import { RequestUser, Rol, Session, SuperUsuario, Usuario } from '../models';
import { JwtService } from '../security/jwt-service';

interface LoginInput {
    email: string;
    password: string;
    inmobiliariaId?: string;
}

interface AuthResult {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        role: string;
        scope: 'SYSTEM' | 'TENANT';
        inmobiliariaId?: string;
    };
}

export class AuthService {
    private readonly jwtService: JwtService;

    public constructor(
        private readonly config: AppConfig,
        private readonly systemDaoFactory: FileSystemSystemDaoFactory,
        private readonly tenantFactoryBuilder: (inmobiliariaId: string) => FileSystemTenantDaoFactory
    ) {
        this.jwtService = new JwtService(config);
    }

    public async login(input: LoginInput): Promise<AuthResult> {
        if (input.inmobiliariaId) {
            return this.loginTenant(input);
        }

        return this.loginSystem(input);
    }

    public async refresh(refreshToken: string): Promise<AuthResult> {
        const claims = this.jwtService.verifyRefreshToken(refreshToken);
        const sessionStore = claims.scope === 'SYSTEM'
            ? this.systemDaoFactory.getSesionesDao()
            : this.tenantFactoryBuilder(claims.inmobiliariaId!).getSesionesDao();

        const session = await sessionStore.findBy('id', claims.sessionId);
        if (!session || session.revokedAt) {
            throw new Error('Session not found or revoked');
        }

        const isValid = await compare(refreshToken, session.refreshTokenHash);
        if (!isValid) {
            throw new Error('Invalid refresh token');
        }

        const currentUser = await this.getCurrentUser({
            userId: claims.userId,
            sessionId: claims.sessionId,
            role: claims.role,
            scope: claims.scope,
            inmobiliariaId: claims.inmobiliariaId
        });

        await sessionStore.update('id', session.id, {
            revokedAt: new Date().toISOString()
        } as Partial<Session>);

        return this.createSessionResult({
            id: currentUser.id,
            email: currentUser.email,
            role: claims.role,
            scope: claims.scope,
            inmobiliariaId: claims.inmobiliariaId
        });
    }

    public async authenticateAccessToken(token: string): Promise<RequestUser> {
        const claims = this.jwtService.verifyAccessToken(token);

        return {
            userId: claims.userId,
            sessionId: claims.sessionId,
            role: claims.role,
            scope: claims.scope,
            inmobiliariaId: claims.inmobiliariaId
        };
    }

    public async logout(user: RequestUser): Promise<void> {
        const sessionsDao = user.scope === 'SYSTEM'
            ? this.systemDaoFactory.getSesionesDao()
            : this.tenantFactoryBuilder(user.inmobiliariaId!).getSesionesDao();

        await sessionsDao.update('id', user.sessionId, {
            revokedAt: new Date().toISOString()
        } as Partial<Session>);
    }

    public async logoutAll(user: RequestUser): Promise<void> {
        const sessionsDao = user.scope === 'SYSTEM'
            ? this.systemDaoFactory.getSesionesDao()
            : this.tenantFactoryBuilder(user.inmobiliariaId!).getSesionesDao();

        const sessions = await sessionsDao.findAll();
        const updated = sessions.map((session) => {
            if (session.userId !== user.userId || session.revokedAt) {
                return session;
            }

            return {
                ...session,
                revokedAt: new Date().toISOString()
            };
        });

        await sessionsDao.saveAll(updated);
    }

    public async getCurrentUser(user: RequestUser): Promise<{ id: string; email: string; role: string; scope: 'SYSTEM' | 'TENANT'; inmobiliariaId?: string; }> {
        if (user.scope === 'SYSTEM') {
            const systemUser = await this.systemDaoFactory.getSuperUsuariosDao().findBy('id', user.userId);
            if (!systemUser) {
                throw new Error('System user not found');
            }

            return {
                id: systemUser.id,
                email: systemUser.email,
                role: user.role,
                scope: 'SYSTEM'
            };
        }

        const tenantUser = await this.tenantFactoryBuilder(user.inmobiliariaId!).getUsuariosDao().findBy('id', user.userId);
        if (!tenantUser) {
            throw new Error('Tenant user not found');
        }

        return {
            id: tenantUser.id,
            email: tenantUser.email,
            role: user.role,
            scope: 'TENANT',
            inmobiliariaId: user.inmobiliariaId
        };
    }

    private async loginSystem(input: LoginInput): Promise<AuthResult> {
        const user = await this.systemDaoFactory.getSuperUsuariosDao().findBy('email', input.email);
        if (!user || !user.activo) {
            throw new Error('Invalid credentials');
        }

        const validPassword = await compare(input.password, user.passwordHash);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }

        const role = await this.systemDaoFactory.getRolesDao().findBy('idRol', user.idRol) as Rol | undefined;
        if (!role) {
            throw new Error('Role not found');
        }

        return this.createSessionResult({
            id: user.id,
            email: user.email,
            role: role.descripcion,
            scope: 'SYSTEM'
        });
    }

    private async loginTenant(input: LoginInput): Promise<AuthResult> {
        const tenantFactory = this.tenantFactoryBuilder(input.inmobiliariaId!);
        const user = await tenantFactory.getUsuariosDao().findBy('email', input.email);
        if (!user || !user.activo) {
            throw new Error('Invalid credentials');
        }

        const validPassword = await compare(input.password, user.passwordHash);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }

        const role = await tenantFactory.getRolesDao().findBy('idRol', user.idRol) as Rol | undefined;
        if (!role) {
            throw new Error('Role not found');
        }

        return this.createSessionResult({
            id: user.id,
            email: user.email,
            role: role.descripcion,
            scope: 'TENANT',
            inmobiliariaId: input.inmobiliariaId
        });
    }

    private async createSessionResult(user: { id: string; email: string; role: string; scope: 'SYSTEM' | 'TENANT'; inmobiliariaId?: string; }): Promise<AuthResult> {
        const sessionId = randomUUID();
        const refreshToken = this.jwtService.signRefreshToken({
            userId: user.id,
            sessionId,
            role: user.role,
            scope: user.scope,
            inmobiliariaId: user.inmobiliariaId
        });
        const refreshTokenHash = await hash(refreshToken, 10);
        const accessToken = this.jwtService.signAccessToken({
            userId: user.id,
            sessionId,
            role: user.role,
            scope: user.scope,
            inmobiliariaId: user.inmobiliariaId
        });

        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.parseRefreshTtl(this.config.jwt.refreshTokenTtl));
        const session: Session = {
            id: sessionId,
            scope: user.scope,
            userId: user.id,
            inmobiliariaId: user.inmobiliariaId,
            refreshTokenHash,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString()
        };

        const sessionsDao = user.scope === 'SYSTEM'
            ? this.systemDaoFactory.getSesionesDao()
            : this.tenantFactoryBuilder(user.inmobiliariaId!).getSesionesDao();

        await sessionsDao.create(session);

        return {
            accessToken,
            refreshToken,
            user
        };
    }

    private parseRefreshTtl(ttl: string): number {
        if (ttl.endsWith('d')) {
            return Number(ttl.slice(0, -1)) * 24 * 60 * 60 * 1000;
        }

        if (ttl.endsWith('h')) {
            return Number(ttl.slice(0, -1)) * 60 * 60 * 1000;
        }

        if (ttl.endsWith('m')) {
            return Number(ttl.slice(0, -1)) * 60 * 1000;
        }

        return 30 * 24 * 60 * 60 * 1000;
    }
}
