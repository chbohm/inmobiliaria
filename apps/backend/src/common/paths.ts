import path from 'path';

export class DataPaths {
    public constructor(private readonly dataDir: string) {}

    public systemRoot(): string {
        return path.join(this.dataDir, 'system');
    }

    public tenantRoot(inmobiliariaId: string): string {
        return path.join(this.dataDir, `inmobiliaria_${inmobiliariaId}`);
    }

    public tenantInmueblesRoot(inmobiliariaId: string): string {
        return path.join(this.tenantRoot(inmobiliariaId), 'inmuebles');
    }

    public tenantInmuebleRoot(inmobiliariaId: string, inmuebleId: string): string {
        return path.join(this.tenantInmueblesRoot(inmobiliariaId), `inmueble_${inmuebleId}`);
    }
}
