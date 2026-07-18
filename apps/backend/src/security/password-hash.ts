import { hash } from 'bcryptjs';

const DEFAULT_SALT_ROUNDS = 10;

export async function createPasswordHash(password: string, saltRounds: number = DEFAULT_SALT_ROUNDS): Promise<string> {
    const normalizedPassword = password.trim();

    if (!normalizedPassword) {
        throw new Error('Password is required');
    }

    return hash(normalizedPassword, saltRounds);
}