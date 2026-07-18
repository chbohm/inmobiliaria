import { z, ZodSchema } from 'zod';

import { FileSystemJsonRepository } from './FileSystemJsonRepository';

export class FileSystemCollectionDao<T extends Record<string, unknown>> {
    private readonly repository: FileSystemJsonRepository<T[]>;

    public constructor(filePath: string, itemSchema: ZodSchema<T>) {
        this.repository = new FileSystemJsonRepository(filePath, z.array(itemSchema), []);
    }

    public async findAll(): Promise<T[]> {
        return this.repository.read();
    }

    public async findBy<K extends keyof T>(field: K, value: T[K]): Promise<T | undefined> {
        const items = await this.repository.read();
        return items.find((item) => item[field] === value);
    }

    public async saveAll(items: T[]): Promise<void> {
        await this.repository.write(items);
    }

    public async create(item: T): Promise<T> {
        const items = await this.repository.read();
        items.push(item);
        await this.repository.write(items);
        return item;
    }

    public async update<K extends keyof T>(field: K, value: T[K], partial: Partial<T>): Promise<T | undefined> {
        const items = await this.repository.read();
        const index = items.findIndex((item) => item[field] === value);
        if (index < 0) {
            return undefined;
        }

        items[index] = {
            ...items[index],
            ...partial
        };

        await this.repository.write(items);
        return items[index];
    }
}
