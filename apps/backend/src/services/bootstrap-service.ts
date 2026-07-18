import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

import { FileSystemSystemDaoFactory } from '../daos/filesystem/FileSystemSystemDaoFactory';
import { FileSystemTenantDaoFactory } from '../daos/filesystem/FileSystemTenantDaoFactory';
import { BootstrapRequest, BootstrapRequestSchema } from '../models';

export class BootstrapService {
    public constructor(
        private readonly systemDaoFactory: FileSystemSystemDaoFactory,
        private readonly tenantFactoryBuilder: (inmobiliariaId: string) => FileSystemTenantDaoFactory
    ) {}

    public async bootstrapFirstTenant(rawInput: BootstrapRequest) {
        const input = BootstrapRequestSchema.parse(rawInput);
        const tenantsDao = this.systemDaoFactory.getTenantsDao();
        const superUsersDao = this.systemDaoFactory.getSuperUsuariosDao();
        const rolesDao = this.systemDaoFactory.getRolesDao();
        const suscripcionesDao = this.systemDaoFactory.getSuscripcionesDao();

        const existingTenants = await tenantsDao.findAll();
        if (existingTenants.length > 0) {
            return { bootstrapped: false, reason: 'system-already-initialized' };
        }

        const now = new Date().toISOString();
        const idInmobiliaria = randomUUID();
        const idTenant = randomUUID();
        const idSystemRol = randomUUID();
        const idTenantRol = randomUUID();
        const idSuperUsuario = randomUUID();
        const idTenantAdmin = randomUUID();

        const systemPasswordHash = await hash(input.systemAdmin.password, 10);
        const tenantPasswordHash = await hash(input.tenantAdmin.password, 10);

        await rolesDao.create({
            idRol: idSystemRol,
            descripcion: 'SUPER_ADMIN',
            scope: 'SYSTEM',
            permisos: ['system.*']
        });

        await superUsersDao.create({
            id: idSuperUsuario,
            nombre: input.systemAdmin.nombre,
            apellido: input.systemAdmin.apellido,
            email: input.systemAdmin.email,
            passwordHash: systemPasswordHash,
            idRol: idSystemRol,
            activo: true,
            createdAt: now
        });

        await tenantsDao.create({
            idTenant,
            idInmobiliaria,
            nombre: input.tenant.nombre,
            estado: 'ACTIVO',
            createdAt: now,
            updatedAt: now
        });

        await suscripcionesDao.create({
            idSuscripcion: randomUUID(),
            idTenant,
            plan: input.subscription.plan,
            estado: 'TRIAL',
            fechaInicio: now,
            limites: {
                maxUsuarios: input.subscription.maxUsuarios,
                maxInmuebles: input.subscription.maxInmuebles
            },
            createdAt: now,
            updatedAt: now
        });

        const tenantFactory = this.tenantFactoryBuilder(idInmobiliaria);
        await tenantFactory.getInmobiliariaRepository().write({
            id: idInmobiliaria,
            nombre: input.inmobiliaria.nombre,
            razonSocial: input.inmobiliaria.razonSocial,
            identificacionFiscal: input.inmobiliaria.identificacionFiscal,
            direccion: input.inmobiliaria.direccion,
            telefono: input.inmobiliaria.telefono,
            email: input.inmobiliaria.email,
            activo: true,
            configuracion: {
                moneda: input.inmobiliaria.moneda,
                diasAvisoVencimientoContrato: 30,
                indiceActualizacionDefault: 'IPC',
                colores: {
                    primary: '#0f172a',
                    secondary: '#e2e8f0'
                }
            },
            createdAt: now,
            updatedAt: now
        });
        await tenantFactory.getRolesDao().create({
            idRol: idTenantRol,
            descripcion: 'ADMIN',
            scope: 'TENANT',
            permisos: ['tenant.*']
        });
        await tenantFactory.getUsuariosDao().create({
            id: idTenantAdmin,
            idInmobiliaria,
            nombre: input.tenantAdmin.nombre,
            apellido: input.tenantAdmin.apellido,
            email: input.tenantAdmin.email,
            passwordHash: tenantPasswordHash,
            idRol: idTenantRol,
            activo: true,
            createdAt: now
        });

        return {
            bootstrapped: true,
            idTenant,
            idInmobiliaria,
            idSuperUsuario,
            idTenantAdmin
        };
    }
}
