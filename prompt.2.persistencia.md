## DAOs / Repositories

Toda persistencia debe pasar por esta capa.

Ejemplo:

```
PropertyDAO

create()
findById()
findAll()
update()
softDelete()
```

Los servicios nunca deben conocer si la información viene de:

- JSON
- PostgreSQL
- MongoDB

---

# Persistencia inicial

La primera implementación utilizará exclusivamente filesystem.

La arquitectura de persistencia debe diseñarse desde el inicio como una arquitectura **multi-tenant**, donde cada inmobiliaria posea un espacio físico completamente independiente.

El objetivo es garantizar el aislamiento de datos y facilitar futuras migraciones, backups, exportaciones y restauraciones.

## Estructura de directorios

```
data/
│
└── inmobiliaria_<id>/
    │
    ├── inmobiliaria.json          (InmobiliariaSchema)
    │
    ├── usuarios.json              (UsuarioSchema[])
    │
    ├── personas.json              (PersonaSchema[])
    │
    ├── contactos.json             (ContactoSchema[])
    │
    ├── inmuebles/
    │   │
    │   ├── inmueble_<id>/
    │   │   │
    │   │   ├── inmueble.json       (InmuebleSchema)
    │   │   │
    │   │   ├── contratos.json      (ContratoAlquilerSchema[])
    │   │   │
    │   │   ├── pagos.json          (PagoSchema[])
    │   │   │
    │   │   ├── gastos.json         (GastoSchema[])
    │   │   │
    │   │   ├── comentarios.json    (ComentarioSchema[])
    │   │   │
    │   │   └── documentos/
    │   │       │
    │   │       ├── attachment_<id>.json   (AttachmentSchema)
    │   │       └── ...
    │   │
    │   └── inmueble_<id>/
    │       └── ...
    │
    ├── auditoria.json              (AuditoriaSchema[])
    │
    └── password_resets.json        (PasswordResetSchema[])
```

## Restricciones
Cada inmobiliaria constituye un tenant completamente aislado.
No debe existir ninguna entidad del negocio compartida entre inmobiliarias.

Una persona con el mismo documento puede existir en distintas inmobiliarias y serán registros completamente independientes.

Los DAOs nunca deben acceder a información perteneciente a otra carpeta de inmobiliaria.

## DAOFactory

La aplicación debe implementar una `DAOFactory` encargada de resolver automáticamente la carpeta correspondiente al tenant autenticado.

Ejemplo:

```typescript
const daoFactory = DAOFactory.forTenant(inmobiliariaId);

const inmuebleDAO = daoFactory.getInmuebleDAO();
const contractoDAO = daoFactory.getContractoDAO();
const personaDAO = daoFactory.getPersonaDAO();
```

Los servicios nunca deben construir rutas manualmente.

Toda la resolución de rutas debe quedar encapsulada dentro de la `DAOFactory`.


## Esquema de datos
export const UUIDSchema = z.string().uuid();


export const DateSchema = z
  .string()
  .datetime();


export const ComentarioSchema = z.object({
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
  fileName: z.string(),
  dataUrl: z.string(),
  type: AttachmentTypeSchema
});


export const ConfiguracionInmobiliariaSchema = z.object({

  moneda: z.string(),

  diasAvisoVencimientoContrato:
    z.number().int().positive(),

  indiceActualizacionDefault:
    z.string(),

  logo:
    z.string().optional(),

  colores:
    z.object({
      primary: z.string(),
      secondary: z.string()
    })

});


export const InmobiliariaSchema = z.object({

  id: UUIDSchema,

  nombre:    z.string(),

  razonSocial:    z.string(),

  identificacionFiscal:    z.string(),

  direccion:    z.string(),

  telefono:    z.string(),

  email:    z.string().email(),

  activo:    z.boolean(),

  configuracion:    ConfiguracionInmobiliariaSchema,

  createdAt:    DateSchema,

  updatedAt:    DateSchema

});


export const PermisoSchema = z.string();


export const RolSchema = z.object({

  idRol:
    UUIDSchema,

  descripcion:
    z.string(),

  permisos:
    z.array(PermisoSchema)

});


export const UsuarioSchema = z.object({

  id:
    UUIDSchema,

  idInmobiliaria:
    UUIDSchema,

  nombre:
    z.string(),

  apellido:
    z.string(),

  email:
    z.string().email(),

  passwordHash:
    z.string(),

  idRol:
    UUIDSchema,

  activo:
    z.boolean(),

  createdAt:
    DateSchema,

  lastLogin:
    DateSchema.optional()

});


const permisos = [

"usuarios.create",
"usuarios.modify",
"usuarios.delete",

"inmuebles.create",
"inmuebles.modify",
"inmuebles.delete",

"contratos.create",
"contratos.modify",

"pagos.create",
"pagos.modify"

];


export const PersonaSchema = z.object({

 idPersona:
    UUIDSchema,

 nombre:
    z.string(),

 apellido:
    z.string(),

 documento:
    z.string(),

 fechaNacimiento:
    DateSchema.optional()

});


export const ContactoSchema = z.object({

 idContacto:
    UUIDSchema,

 idPersona:
    UUIDSchema,


 emails:
    z.array(
      z.string().email()
    ),


 telefonos:
    z.array(
      z.string()
    ),


 direccion:
    z.string(),


 comentarios:
    z.array(
      ComentarioSchema
    )

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

 idInmueble:
    UUIDSchema,


 idInmobiliaria:
    UUIDSchema,


 tipo:
    TipoInmuebleSchema,


 estado:
    EstadoInmuebleSchema,


 descripcionInterna:
    z.string(),


 descripcionPublica:
    z.string(),


 direccion:
    z.string(),


 piso:
    z.string().optional(),


 ciudad:
    z.string(),


 provincia:
    z.string(),


 superficieCubierta:
    z.number(),


 superficieDescubierta:
    z.number(),


 superficieTotal:
    z.number(),


 detalles:
    DetalleInmuebleSchema,


 idDuenio:
    UUIDSchema,


 comentarios:
    z.array(
      ComentarioSchema
    )

});


export const PeriodoActualizacionSchema =
z.enum([
 "MENSUAL",
 "TRIMESTRAL",
 "SEMESTRAL",
 "ANUAL"
]);


export const HistorialMontoSchema = z.object({

 fecha:
    DateSchema,

 monto:
    z.number(),

 comentario:
    z.string()

});


export const ContratoAlquilerSchema = z.object({

 idContrato:
    UUIDSchema,


 idInmueble:
    UUIDSchema,


 idInquilino:
    UUIDSchema,


 idDuenio:
    UUIDSchema,


 fechaInicioContrato:
    DateSchema,


 fechaFinContrato:
    DateSchema,


 fechaFinReal:
    DateSchema.optional(),


 montoActual:
    z.number(),


 fechaProximaActualizacionMonto:
    DateSchema,


 indiceActualizacion:
    z.string(),


 periodoActualizacion:
    PeriodoActualizacionSchema,


 historialMontos:
    z.array(
      HistorialMontoSchema
    ),


 comentarios:
    z.array(
      ComentarioSchema
    ),


 garantes:
    z.array(
      GaranteSchema
    ),


 contratoFileName:
    z.string().optional()

});



export const GaranteSchema = z.object({

 idContacto:
    UUIDSchema,


 comentario:
    z.string(),


 porcentaje:
    z.number()
      .min(0)
      .max(100),


 fechaInicio:
    DateSchema,


 fechaFin:
    DateSchema.optional()

});



export const TipoPagoSchema =
z.enum([
 "ALQUILER",
 "EXPENSA",
 "IMPUESTO",
 "GASTO_MANTENIMIENTO",
 "GASTO_EXCEPCIONAL"
]);


export const ResponsablePagoSchema =
z.enum([
 "INQUILINO",
 "DUENIO"
]);


export const EstadoPagoSchema =
z.enum([
 "PENDIENTE",
 "PAGADO",
 "ATRASADO",
 "CANCELADO"
]);



export const PagoSchema = z.object({

 idPago:
    UUIDSchema,


 idContrato:
    UUIDSchema,


 periodo:
    z.string(),


 montoOriginal:
    z.number(),


 montoRetraso:
    z.number(),


 montoPagado:
    z.number(),


 tipo:
    TipoPagoSchema,


 responsablePago:
    ResponsablePagoSchema,


 moneda:
    z.string(),


 fechaVencimiento:
    DateSchema,


 fechaPago:
    DateSchema.optional(),


 estado:
    EstadoPagoSchema,


 comentarios:
    z.array(
      ComentarioSchema
    )

});