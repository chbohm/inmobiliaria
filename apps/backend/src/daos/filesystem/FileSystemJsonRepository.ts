import fs from 'fs';
import path from 'path';
import { ZodSchema } from 'zod';

export class FileSystemJsonRepository<T> {
    public constructor(
        private readonly filePath: string,
        private readonly schema: ZodSchema<T>,
        private readonly defaultValue: T
    ) {}

    public async ensureExists(): Promise<void> {
        await fs.promises.mkdir(path.dirname(this.filePath), { recursive: true });
        try {
            await fs.promises.access(this.filePath);
        } catch {
            await this.write(this.defaultValue);
        }
    }

    public async read(): Promise<T> {
        await this.ensureExists();
        const content = await fs.promises.readFile(this.filePath, 'utf-8');
        const parsed = JSON.parse(content);
        return this.schema.parse(parsed);
    }

    public async write(value: T): Promise<void> {
        await fs.promises.mkdir(path.dirname(this.filePath), { recursive: true });
        const validated = this.schema.parse(value);
        await fs.promises.writeFile(this.filePath, JSON.stringify(validated, null, 2), 'utf-8');
    }
}
