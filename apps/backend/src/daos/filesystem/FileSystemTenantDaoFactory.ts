import path from 'path';

import { DataPaths } from '../../common/paths';
import {
    AuditoriaSchema,
    ComentarioSchema,
    ContactoSchema,
    InmobiliariaSchema,
    InmuebleSchema,
    PasswordResetSchema,
    PersonaSchema,
    RolSchema,
    SessionSchema,
    TareaSchema,
    UsuarioSchema,
    ContratoAlquilerSchema,
    PagoSchema
} from '../../models';
import { FileSystemCollectionDao } from './FileSystemCollectionDao';
import { FileSystemJsonRepository } from './FileSystemJsonRepository';

export class FileSystemTenantDaoFactory {
    public constructor(
        private readonly dataPaths: DataPaths,
        private readonly inmobiliariaId: string
    ) {}

    public getInmobiliariaRepository() {
        return new FileSystemJsonRepository(
            path.join(this.dataPaths.tenantRoot(this.inmobiliariaId), 'inmobiliaria.json'),
            InmobiliariaSchema,
            {
                id: this.inmobiliariaId,
                nombre: '',
                razonSocial: '',
                identificacionFiscal: '',
                direccion: '',
                telefono: '',
                email: 'placeholder@example.com',
                activo: true,
                configuracion: {
                    moneda: 'ARS',
                    diasAvisoVencimientoContrato: 30,
                    indiceActualizacionDefault: 'IPC',
                    colores: {
                        primary: '#000000',
                        secondary: '#ffffff'
                    }
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );
    }

    public getRolesDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantRoot(this.inmobiliariaId), 'roles.json'), RolSchema);
    }

    public getUsuariosDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantRoot(this.inmobiliariaId), 'usuarios.json'), UsuarioSchema);
    }

    public getSesionesDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantRoot(this.inmobiliariaId), 'sesiones.json'), SessionSchema);
    }

    public getPersonasDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantRoot(this.inmobiliariaId), 'personas.json'), PersonaSchema);
    }

    public getContactosDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantRoot(this.inmobiliariaId), 'contactos.json'), ContactoSchema);
    }

    public getTareasDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantRoot(this.inmobiliariaId), 'tareas.json'), TareaSchema);
    }

    public getAuditoriaDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantRoot(this.inmobiliariaId), 'auditoria.json'), AuditoriaSchema);
    }

    public getPasswordResetsDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantRoot(this.inmobiliariaId), 'password_resets.json'), PasswordResetSchema);
    }

    public getInmueblesDao() {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantRoot(this.inmobiliariaId), 'inmuebles-index.json'), InmuebleSchema);
    }

    public getInmuebleRepository(inmuebleId: string) {
        return new FileSystemJsonRepository(
            path.join(this.dataPaths.tenantInmuebleRoot(this.inmobiliariaId, inmuebleId), 'inmueble.json'),
            InmuebleSchema,
            {
                idInmueble: inmuebleId,
                idInmobiliaria: this.inmobiliariaId,
                tipo: 'CASA',
                estado: 'DISPONIBLE',
                descripcionInterna: '',
                descripcionPublica: '',
                direccion: '',
                ciudad: '',
                provincia: '',
                superficies: {
                    cubierta: 0,
                    descubierta: 0,
                    total: 0
                },
                banios: 0,
                idDuenio: '00000000-0000-0000-0000-000000000000',
                contratos: [],
                pagos: [],
                comentarios: [],
                attachments: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );
    }

    public getContratosDao(inmuebleId: string) {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantInmuebleRoot(this.inmobiliariaId, inmuebleId), 'contratos.json'), ContratoAlquilerSchema);
    }

    public getPagosDao(inmuebleId: string) {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantInmuebleRoot(this.inmobiliariaId, inmuebleId), 'pagos.json'), PagoSchema);
    }

    public getComentariosDao(inmuebleId: string) {
        return new FileSystemCollectionDao(path.join(this.dataPaths.tenantInmuebleRoot(this.inmobiliariaId, inmuebleId), 'comentarios.json'), ComentarioSchema);
    }
}
