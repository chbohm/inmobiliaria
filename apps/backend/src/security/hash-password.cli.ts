import { createPasswordHash } from './password-hash';

async function main(): Promise<void> {
    const password = process.argv[2];

    if (!password) {
        console.error('Usage: npm run hash:password -- <plain-password>');
        process.exitCode = 1;
        return;
    }

    const passwordHash = await createPasswordHash(password);
    console.log(passwordHash);
}

void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Unable to create password hash');
    process.exitCode = 1;
});