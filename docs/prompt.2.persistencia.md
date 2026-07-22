## DAOs / Repositories

Toda persistencia debe pasar por esta capa.

Ejemplo:

```text
PropertyDAO

create()
findById()
findAll()
update()
softDelete()
```

Los servicios nunca deben conocer si la informacion viene de:

- JSON
- PostgreSQL
- MongoDB

---

# Persistencia inicial

La primera implementacion utilizara exclusivamente filesystem.

La arquitectura de persistencia debe diseniarse desde el inicio como una arquitectura multi-tenant, donde cada inmobiliaria posea un espacio fisico completamente independiente.

El objetivo es garantizar el aislamiento de datos y facilitar futuras migraciones, backups, exportaciones y restauraciones.

Ademas del espacio tenant, debe existir un espacio global de sistema para administrar tenants, suscripciones, usuarios de sistema, roles de super usuario y bootstrap de plataforma.

## Estructura de directorios

```text
data/
│
├── system/
│   │
│   ├── tenants.json                (TenantSchema[])
│   ├── suscripciones.json          (SuscripcionSchema[])
│   ├── usuarios_sistema.json       (SuperUsuarioSchema[])
│   ├── roles_sistema.json          (RolSchema[])
│   ├── sesiones_sistema.json       (SessionSchema[])
│   └── auditoria_sistema.json      (AuditoriaSchema[])
│
└── inmobiliaria_<id>/
    │
    ├── inmobiliaria.json           (InmobiliariaSchema)
    ├── roles.json                  (RolSchema[])
    ├── usuarios.json               (UsuarioSchema[])
    ├── sesiones.json               (SessionSchema[])
    ├── personas.json               (PersonaSchema[])
    ├── contactos.json              (ContactoSchema[])
    ├── tareas.json                 (TareaSchema[])
    ├── inmuebles/
    │   │
    │   ├── inmueble_<id>/
    │   │   │
    │   │   ├── inmueble.json       (InmuebleSchema)
    │   │   ├── contratos.json      (ContratoAlquilerSchema[])
    │   │   ├── pagos.json          (PagoSchema[])
    │   │   ├── comentarios.json    (ComentarioSchema[])
    │   │   └── documentos/
    │   │       │
    │   │       ├── attachment_<id>.json   (AttachmentSchema)
    │   │       └── ...
    │   │
    │   └── inmueble_<id>/
    │       └── ...
    │
    ├── auditoria.json              (AuditoriaSchema[])
    └── password_resets.json        (PasswordResetSchema[])
```

## Restricciones

Cada inmobiliaria constituye un tenant completamente aislado.

No debe existir ninguna entidad del negocio compartida entre inmobiliarias.

Una persona con el mismo documento puede existir en distintas inmobiliarias y seran registros completamente independientes.

Los DAOs tenant nunca deben acceder a informacion perteneciente a otra carpeta de inmobiliaria.

Los DAOs de sistema solo pueden acceder a `data/system/` y a carpetas tenant cuando la operacion forme parte de una capacidad de administracion global explicitamente definida.

## Bootstrap del primer tenant

La plataforma debe soportar un bootstrap inicial idempotente que:

1. Cree `data/system/` si aun no existe.
2. Cree los roles globales minimos de super usuario.
3. Cree el primer usuario de sistema con permisos para administrar tenants y suscripciones.
4. Registre el primer tenant en `tenants.json`.
5. Registre su suscripcion inicial en `suscripciones.json`.
6. Cree la carpeta `data/inmobiliaria_<id>/` correspondiente.
7. Cree la inmobiliaria base y el usuario administrador tenant inicial.

El bootstrap del primer tenant nunca debe requerir crear rutas manualmente desde servicios.

## DAOFactory

La aplicacion debe implementar dos factories:

- `TenantDAOFactory.forTenant(inmobiliariaId)` para datos aislados por tenant.
- `SystemDAOFactory.global()` para datos globales de sistema.

Ejemplo:

```typescript
const tenantFactory = TenantDAOFactory.forTenant(inmobiliariaId);

const inmuebleDAO = tenantFactory.getInmuebleDAO();
const contratoDAO = tenantFactory.getContratoDAO();
const personaDAO = tenantFactory.getPersonaDAO();

const systemFactory = SystemDAOFactory.global();

const tenantDAO = systemFactory.getTenantDAO();
const suscripcionDAO = systemFactory.getSuscripcionDAO();
const superUsuarioDAO = systemFactory.getSuperUsuarioDAO();
```

Los servicios nunca deben construir rutas manualmente.

Toda la resolucion de rutas debe quedar encapsulada dentro de las factories.

---

## Esquema de datos

```typescript
export const UUIDSchema = z.string().uuid();

export const DateSchema = z.string().datetime();

export const ScopeSchema = z.enum(["TENANT", "SYSTEM"]);

export const ComentarioSchema = z.object({
  idComentario: UUIDSchema,
  timestamp: DateSchema,
  comentario: z.string(),
  idUsuario: UUIDSchema
});

export const AttachmentTypeSchema = z.enum([
  "CONTRATO",
  "DOCUMENTACION_PERSONAL",
  "DOCUMENTACION_INMUEBLE",
  "FOTO",
  "PLANO"
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

export const TenantEstadoSchema = z.enum([
  "PENDIENTE",
  "ACTIVO",
  "SUSPENDIDO",
  "CANCELADO"
]);

export const TenantSchema = z.object({
  idTenant: UUIDSchema,
  idInmobiliaria: UUIDSchema,
  nombre: z.string(),
  estado: TenantEstadoSchema,
  createdAt: DateSchema,
  updatedAt: DateSchema
});

export const PlanSuscripcionSchema = z.enum([
  "BASICO",
  "PROFESIONAL",
  "ENTERPRISE"
]);

export const EstadoSuscripcionSchema = z.enum([
  "TRIAL",
  "ACTIVA",
  "VENCIDA",
  "SUSPENDIDA",
  "CANCELADA"
]);

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

export const EstadoTareaSchema = z.enum([
  "PENDIENTE",
  "EN_PROGRESO",
  "COMPLETADA",
  "CANCELADA"
]);

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

export const TipoInmuebleSchema = z.enum([
  "CASA",
  "DEPARTAMENTO",
  "GALPON",
  "TERRENO",
  "COCHERA"
]);

export const EstadoInmuebleSchema = z.enum([
  "DISPONIBLE",
  "ALQUILADO",
  "RESERVADO"
]);

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

export const PeriodoActualizacionSchema = z.enum([
  "MENSUAL",
  "TRIMESTRAL",
  "SEMESTRAL",
  "ANUAL"
]);

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

export const TipoPagoSchema = z.enum([
  "ALQUILER",
  "EXPENSA",
  "IMPUESTO",
  "GASTO_MANTENIMIENTO",
  "GASTO_EXCEPCIONAL"
]);

export const ResponsablePagoSchema = z.enum([
  "INQUILINO",
  "DUENIO"
]);

export const EstadoPagoSchema = z.enum([
  "PENDIENTE",
  "PAGADO",
  "ATRASADO",
  "CANCELADO"
]);

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
```

## Regla adicional de sesiones

Toda sesion tenant debe persistir `inmobiliariaId` y solo puede guardarse en `inmobiliaria_<id>/sesiones.json`.

Las sesiones de super usuario deben persistirse en `data/system/sesiones_sistema.json`.