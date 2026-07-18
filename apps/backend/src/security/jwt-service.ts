import jwt, { SignOptions } from 'jsonwebtoken';

import { AppConfig } from '../app/config';
import { RequestScope } from '../models';

export interface TokenClaims {
    userId: string;
    sessionId: string;
    role: string;
    scope: RequestScope;
    inmobiliariaId?: string;
    tokenType: 'access' | 'refresh';
}

export class JwtService {
    public constructor(private readonly config: AppConfig) {}

    public signAccessToken(claims: Omit<TokenClaims, 'tokenType'>): string {
        const options: SignOptions = {
            expiresIn: this.config.jwt.accessTokenTtl as SignOptions['expiresIn']
        };

        return jwt.sign(
            {
                ...claims,
                tokenType: 'access'
            },
            this.config.jwt.accessSecret,
            options
        );
    }

    public signRefreshToken(claims: Omit<TokenClaims, 'tokenType'>): string {
        const options: SignOptions = {
            expiresIn: this.config.jwt.refreshTokenTtl as SignOptions['expiresIn']
        };

        return jwt.sign(
            {
                ...claims,
                tokenType: 'refresh'
            },
            this.config.jwt.refreshSecret,
            options
        );
    }

    public verifyAccessToken(token: string): TokenClaims {
        return this.verifyToken(token, this.config.jwt.accessSecret, 'access');
    }

    public verifyRefreshToken(token: string): TokenClaims {
        return this.verifyToken(token, this.config.jwt.refreshSecret, 'refresh');
    }

    private verifyToken(token: string, secret: string, expectedType: 'access' | 'refresh'): TokenClaims {
        const decoded = jwt.verify(token, secret);
        if (typeof decoded !== 'object' || decoded === null) {
            throw new Error('Invalid token payload');
        }

        const claims = decoded as Partial<TokenClaims>;
        if (
            !claims.userId ||
            !claims.sessionId ||
            !claims.role ||
            !claims.scope ||
            claims.tokenType !== expectedType
        ) {
            throw new Error('Invalid token claims');
        }

        return claims as TokenClaims;
    }
}
