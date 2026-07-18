import path from 'path';

import { DataPaths } from '../../common/paths';
import { AuditoriaSchema, RolSchema, SessionSchema, SuperUsuarioSchema, SuscripcionSchema, TenantSchema } from '../../models';
import { FileSystemCollectionDao } from './FileSystemCollectionDao';

export class FileSystemSystemDaoFactory {
    public constructor(private readonly dataPaths: DataPaths) {}

    public getTenantsDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.systemRoot(), 'tenants.json'), TenantSchema);
    }

    public getSuscripcionesDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.systemRoot(), 'suscripciones.json'), SuscripcionSchema);
    }

    public getSuperUsuariosDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.systemRoot(), 'usuarios_sistema.json'), SuperUsuarioSchema);
    }

    public getRolesDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.systemRoot(), 'roles_sistema.json'), RolSchema);
    }

    public getSesionesDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.systemRoot(), 'sesiones_sistema.json'), SessionSchema);
    }

    public getAuditoriaDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.systemRoot(), 'auditoria_sistema.json'), AuditoriaSchema);
    }
}
