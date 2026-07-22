import { randomUUID } from 'crypto';

import { FileSystemTenantDaoFactory } from '../daos/filesystem/FileSystemTenantDaoFactory';
import { CreatePropertyInput, CreatePropertySchema, Inmueble, UpdatePropertyInput, UpdatePropertySchema } from '../models';

export class PropiedadService {
    public constructor(
        private readonly tenantFactoryBuilder: (inmobiliariaId: string) => FileSystemTenantDaoFactory
    ) {}

    public async list(inmobiliariaId: string): Promise<Inmueble[]> {
        const factory = this.tenantFactoryBuilder(inmobiliariaId);
        const ids = factory.listInmuebleIds();
        const items = await Promise.all(ids.map((id) => factory.getInmuebleRepository(id).read()));
        return items.filter((item) => !item.deletedAt);
    }

    public async findById(inmobiliariaId: string, idInmueble: string): Promise<Inmueble | undefined> {
        const factory = this.tenantFactoryBuilder(inmobiliariaId);
        const item = await this.readInmueble(factory, idInmueble);
        if (!item || item.deletedAt) {
            return undefined;
        }

        return item;
    }

    public async create(inmobiliariaId: string, payload: CreatePropertyInput): Promise<Inmueble> {
        const input = CreatePropertySchema.parse(payload);
        const now = new Date().toISOString();
        const inmueble: Inmueble = {
            idInmueble: randomUUID(),
            idInmobiliaria: inmobiliariaId,
            contratos: [],
            pagos: [],
            comentarios: [],
            attachments: [],
            createdAt: now,
            updatedAt: now,
            ...input
        };

        const factory = this.tenantFactoryBuilder(inmobiliariaId);
        await factory.getInmuebleRepository(inmueble.idInmueble).write(inmueble);

        return inmueble;
    }

    public async update(inmobiliariaId: string, idInmueble: string, payload: UpdatePropertyInput): Promise<Inmueble | undefined> {
        const factory = this.tenantFactoryBuilder(inmobiliariaId);
        const current = await this.readInmueble(factory, idInmueble);
        if (!current || current.deletedAt) {
            return undefined;
        }

        const partial = UpdatePropertySchema.parse(payload);
        const updated: Inmueble = {
            ...current,
            ...partial,
            updatedAt: new Date().toISOString()
        };

        await factory.getInmuebleRepository(idInmueble).write(updated);

        return updated;
    }

    public async softDelete(inmobiliariaId: string, idInmueble: string): Promise<boolean> {
        const factory = this.tenantFactoryBuilder(inmobiliariaId);
        const current = await this.readInmueble(factory, idInmueble);
        if (!current || current.deletedAt) {
            return false;
        }

        const deleted = {
            ...current,
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await factory.getInmuebleRepository(idInmueble).write(deleted);
        return true;
    }

    private async readInmueble(factory: FileSystemTenantDaoFactory, inmuebleId: string): Promise<Inmueble | undefined> {
        if (!factory.inmuebleExists(inmuebleId)) {
            return undefined;
        }

        return factory.getInmuebleRepository(inmuebleId).read();
    }
}
