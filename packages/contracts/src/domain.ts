import { z } from 'zod';

export const UUIDSchema = z.string().uuid();
export const DateSchema = z.string().datetime();
export const ScopeSchema = z.enum(['TENANT', 'SYSTEM']);

export const ConfiguracionInmobiliariaSchema = z.object({
    moneda: z.string(),
    diasAvisoVencimientoContrato: z.number().int().positive(),
    indiceActualizacionDefault: z.string(),
    logo: z.string().optional(),
    colores: z.object({
        primary: z.string(),
        secondary: z.string()
    })
});

export const InmobiliariaSchema = z.object({
    id: UUIDSchema,
    nombre: z.string(),
    razonSocial: z.string(),
    identificacionFiscal: z.string(),
    direccion: z.string(),
    telefono: z.string(),
    email: z.string().email(),
    activo: z.boolean(),
    configuracion: ConfiguracionInmobiliariaSchema,
    createdAt: DateSchema,
    updatedAt: DateSchema,
    deletedAt: DateSchema.optional()
});

export const PermisoSchema = z.string();

export const RolSchema = z.object({
    idRol: UUIDSchema,
    descripcion: z.string(),
    scope: ScopeSchema,
    permisos: z.array(PermisoSchema)
});

export const SuperUsuarioSchema = z.object({
    id: UUIDSchema,
    nombre: z.string(),
    apellido: z.string(),
    email: z.string().email(),
    passwordHash: z.string(),
    idRol: UUIDSchema,
    activo: z.boolean(),
    createdAt: DateSchema,
    lastLogin: DateSchema.optional(),
    deletedAt: DateSchema.optional()
});

export const TenantEstadoSchema = z.enum(['PENDIENTE', 'ACTIVO', 'SUSPENDIDO', 'CANCELADO']);

export const TenantSchema = z.object({
    idTenant: UUIDSchema,
    idInmobiliaria: UUIDSchema,
    nombre: z.string(),
    estado: TenantEstadoSchema,
    createdAt: DateSchema,
    updatedAt: DateSchema
});

export const PlanSuscripcionSchema = z.enum(['BASICO', 'PROFESIONAL', 'ENTERPRISE']);
export const EstadoSuscripcionSchema = z.enum(['TRIAL', 'ACTIVA', 'VENCIDA', 'SUSPENDIDA', 'CANCELADA']);

export const SuscripcionSchema = z.object({
    idSuscripcion: UUIDSchema,
    idTenant: UUIDSchema,
    plan: PlanSuscripcionSchema,
    estado: EstadoSuscripcionSchema,
    fechaInicio: DateSchema,
    fechaFin: DateSchema.optional(),
    limites: z.object({
        maxUsuarios: z.number().int().positive(),
        maxInmuebles: z.number().int().positive()
    }),
    createdAt: DateSchema,
    updatedAt: DateSchema
});

export const UsuarioSchema = z.object({
    id: UUIDSchema,
    idInmobiliaria: UUIDSchema,
    nombre: z.string(),
    apellido: z.string(),
    email: z.string().email(),
    passwordHash: z.string(),
    idRol: UUIDSchema,
    activo: z.boolean(),
    createdAt: DateSchema,
    lastLogin: DateSchema.optional(),
    deletedAt: DateSchema.optional()
});

export const SessionSchema = z.object({
    id: UUIDSchema,
    scope: ScopeSchema,
    userId: UUIDSchema,
    inmobiliariaId: UUIDSchema.optional(),
    refreshTokenHash: z.string(),
    createdAt: DateSchema,
    expiresAt: DateSchema,
    revokedAt: DateSchema.optional()
});

export const PasswordResetSchema = z.object({
    id: UUIDSchema,
    userId: UUIDSchema,
    inmobiliariaId: UUIDSchema,
    tokenHash: z.string(),
    expirationDate: DateSchema,
    used: z.boolean(),
    createdAt: DateSchema
});

export const AuditoriaSchema = z.object({
    id: UUIDSchema,
    scope: ScopeSchema,
    inmobiliariaId: UUIDSchema.optional(),
    userId: UUIDSchema,
    entity: z.string(),
    entityId: UUIDSchema,
    action: z.string(),
    oldValue: z.unknown().optional(),
    newValue: z.unknown().optional(),
    timestamp: DateSchema
});

export const ComentarioSchema = z.object({
    idComentario: UUIDSchema,
    timestamp: DateSchema,
    comentario: z.string(),
    idUsuario: UUIDSchema
});


export const PersonaSchema = z.object({
    idPersona: UUIDSchema,
    nombre: z.string(),
    apellido: z.string(),
    documento: z.string(),
    fechaNacimiento: DateSchema.optional(),
    deletedAt: DateSchema.optional()
});

export const ContactoSchema = z.object({
    idContacto: UUIDSchema,
    idPersona: UUIDSchema,
    emails: z.array(z.string().email()),
    telefonos: z.array(z.string()),
    direccion: z.string(),
    comentarios: z.array(ComentarioSchema),
    deletedAt: DateSchema.optional()
});

export const EstadoTareaSchema = z.enum(['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA']);

export const TareaSchema = z.object({
    idTarea: UUIDSchema,
    idInmobiliaria: UUIDSchema,
    titulo: z.string(),
    descripcion: z.string(),
    estado: EstadoTareaSchema,
    assignedTo: UUIDSchema.optional(),
    dueDate: DateSchema.optional(),
    relatedEntity: z.object({
        entity: z.string(),
        entityId: UUIDSchema
    }).optional(),
    createdAt: DateSchema,
    updatedAt: DateSchema,
    deletedAt: DateSchema.optional()
});

export const TipoInmuebleSchema = z.enum(['CASA', 'DEPARTAMENTO', 'GALPON', 'TERRENO', 'COCHERA']);
export const EstadoInmuebleSchema = z.enum(['DISPONIBLE', 'ALQUILADO', 'RESERVADO']);

export const InmuebleSchema = z.object({
    idInmueble: UUIDSchema,
    idInmobiliaria: UUIDSchema,
    tipo: TipoInmuebleSchema,
    estado: EstadoInmuebleSchema,
    descripcionInterna: z.string(),
    descripcionPublica: z.string(),
    direccion: z.string(),
    ciudad: z.string(),
    provincia: z.string(),
    superficies: z.object({
        cubierta: z.number(),
        descubierta: z.number(),
        total: z.number()
    }),
    banios: z.number().int().nonnegative(),
    idDuenio: UUIDSchema,
    contratos: z.array(UUIDSchema),
    pagos: z.array(UUIDSchema),
    comentarios: z.array(UUIDSchema),
    attachments: z.array(UUIDSchema),
    createdAt: DateSchema,
    updatedAt: DateSchema,
    deletedAt: DateSchema.optional()
});

export const PeriodoActualizacionSchema = z.enum(['MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL']);

export const HistorialMontoSchema = z.object({
    fecha: DateSchema,
    monto: z.number(),
    comentario: z.string()
});

export const GaranteSchema = z.object({
    idContacto: UUIDSchema,
    comentario: z.string(),
    porcentaje: z.number().min(0).max(100),
    fechaInicio: DateSchema,
    fechaFin: DateSchema.optional()
});

export const ContratoAlquilerSchema = z.object({
    idContrato: UUIDSchema,
    idInmueble: UUIDSchema,
    idInquilino: UUIDSchema,
    idDuenio: UUIDSchema,
    fechaInicioContrato: DateSchema,
    fechaFinContrato: DateSchema,
    fechaFinReal: DateSchema.optional(),
    montoActual: z.number(),
    fechaProximaActualizacionMonto: DateSchema,
    indiceActualizacion: z.string(),
    periodoActualizacion: PeriodoActualizacionSchema,
    historialMontos: z.array(HistorialMontoSchema),
    comentarios: z.array(ComentarioSchema),
    garantes: z.array(GaranteSchema),
    contratoFileName: z.string().optional(),
    createdAt: DateSchema,
    updatedAt: DateSchema,
    deletedAt: DateSchema.optional()
});

export const AttachmentTypeSchema = z.enum([
    'CONTRATO',
    'DOCUMENTACION_PERSONAL',
    'DOCUMENTACION_INMUEBLE',
    'FOTO',
    'PLANO'
]);

export const AttachmentSchema = z.object({
    idAttachment: UUIDSchema,
    idInmobiliaria: UUIDSchema,
    idInmueble: UUIDSchema,
    fileName: z.string(),
    type: AttachmentTypeSchema,
    mimeType: z.string(),
    dataUrl: z.string(),
    createdAt: DateSchema
});

export const TipoPagoSchema = z.enum([
    'ALQUILER',
    'EXPENSA',
    'IMPUESTO',
    'GASTO_MANTENIMIENTO',
    'GASTO_EXCEPCIONAL'
]);

export const ResponsablePagoSchema = z.enum(['INQUILINO', 'DUENIO']);
export const EstadoPagoSchema = z.enum(['PENDIENTE', 'PAGADO', 'ATRASADO', 'CANCELADO']);

export const PagoSchema = z.object({
    idPago: UUIDSchema,
    idContrato: UUIDSchema,
    idInmueble: UUIDSchema,
    periodo: z.string(),
    montoOriginal: z.number(),
    montoRetraso: z.number(),
    montoPagado: z.number(),
    tipo: TipoPagoSchema,
    responsablePago: ResponsablePagoSchema,
    moneda: z.string(),
    fechaVencimiento: DateSchema,
    fechaPago: DateSchema.optional(),
    estado: EstadoPagoSchema,
    comentarios: z.array(ComentarioSchema),
    createdAt: DateSchema,
    updatedAt: DateSchema,
    deletedAt: DateSchema.optional()
});

export type Inmobiliaria = z.infer<typeof InmobiliariaSchema>;
export type Tenant = z.infer<typeof TenantSchema>;
export type Suscripcion = z.infer<typeof SuscripcionSchema>;
export type SuperUsuario = z.infer<typeof SuperUsuarioSchema>;
export type Usuario = z.infer<typeof UsuarioSchema>;
export type Rol = z.infer<typeof RolSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type PasswordReset = z.infer<typeof PasswordResetSchema>;
export type Auditoria = z.infer<typeof AuditoriaSchema>;
export type Persona = z.infer<typeof PersonaSchema>;
export type Contacto = z.infer<typeof ContactoSchema>;
export type Tarea = z.infer<typeof TareaSchema>;
export type Inmueble = z.infer<typeof InmuebleSchema>;
export type ContratoAlquiler = z.infer<typeof ContratoAlquilerSchema>;
export type Pago = z.infer<typeof PagoSchema>;
export type Attachment = z.infer<typeof AttachmentSchema>;
