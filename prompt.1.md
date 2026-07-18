# Prompt: Desarrollo de Plataforma SaaS Profesional de Gestión Inmobiliaria

## Rol

Actúa como un arquitecto de software senior especializado en:

- Node.js
- Express.js
- TypeScript
- Sistemas SaaS multi-tenant
- Arquitecturas empresariales escalables
- APIs REST
- Seguridad
- Diseño de aplicaciones inmobiliarias
- Modelado de dominios complejos

Tu objetivo es diseñar y desarrollar una plataforma profesional para la gestión integral de inmobiliarias.

La aplicación debe estar preparada para ser utilizada como un producto SaaS comercial, soportando múltiples inmobiliarias independientes con aislamiento completo de datos.

---

# Objetivo general

Crear una plataforma web donde cada inmobiliaria pueda administrar:

- Usuarios internos
- Contactos
- Propietarios
- Inquilinos
- Garantes
- Propiedades
- Unidades inmobiliarias
- Contratos
- Pagos
- Gastos
- Documentos
- Tareas
- Auditoría de cambios
- Usuarios de sistema que permitan crear nuevas inmobiliarias
- Cada inmobiliaria tiene una suscripcion para uso del sistema


---

# Arquitectura general

La aplicación debe seguir principios:

- Clean Architecture
- Separation of Concerns
- SOLID
- DAO Pattern
- Domain Driven Design básico
- Preparación para escalamiento

---

# Tecnologías

## Backend

Utilizar:

- Node.js
- Express.js
- TypeScript
- REST API
- JWT o sesiones seguras
- bcrypt
- Validación de datos (usar zod para definir request payloads y luego para validarlos)
- Middleware
- Logging
- Variables de entorno


## Frontend

Inicialmente:

- HTML5
- CSS
- JavaScript modular
- Fetch API
- Componentes reutilizables
- Diseño responsive


No utilizar frameworks frontend inicialmente.

La arquitectura debe permitir incorporar posteriormente:

- React
- Vue
- Angular

---

# Arquitectura Backend

Estructura:

```
src/

 ├── controllers/
 ├── services/
 ├── daos/
 ├── models/
 ├── repositories/
 ├── routes/
 ├── middlewares/
 ├── validators/
 ├── security/
 ├── notifications/
 ├── utils/
 ├── config/
 └── app/
```

---

# Capas

## Controllers

Responsabilidad:

- Manejar HTTP.
- Validar entrada. (via zod schemas)
- Invocar servicios.
- Devolver respuestas.

No pueden:

- Acceder a archivos.
- Contener reglas de negocio.
- Manipular datos directamente.


---

## Services

Contienen:

- Reglas de negocio.
- Validaciones.
- Relaciones entre entidades.
- Procesos complejos.


---

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

├── registry.json
│
├── inmobiliaria_<id>/
│   ├── configuracion.json
│   ├── usuarios.json
│   ├── personas.json
│   ├── contactos.json
│   ├── propiedades.json
│   ├── unidades.json
│   ├── contratos.json
│   ├── pagos.json
│   ├── gastos.json
│   ├── tareas.json
│   ├── documentos.json
│   ├── auditoria.json
│   ├── password_resets.json
│   └── uploads/
│       ├── propiedades/
│       ├── contratos/
│       ├── personas/
│       └── otros/
│
├── inmobiliaria_<id>/
│   └── ...
│
└── backups/
```


No debe contener información del negocio.

## Datos de cada inmobiliaria

Toda la información propia de una inmobiliaria debe almacenarse únicamente dentro de su carpeta.

Esto incluye:

- usuarios
- personas
- contactos
- inmuebles
- contratos
- pagos
- gastos
- tareas
- documentos
- auditoría
- recuperación de contraseñas
- archivos adjuntos

No debe existir ninguna entidad del negocio compartida entre inmobiliarias.

Una persona con el mismo documento puede existir en distintas inmobiliarias y serán registros completamente independientes.

## Aislamiento

Cada inmobiliaria constituye un tenant completamente aislado.

No debe existir ninguna relación entre entidades de distintas inmobiliarias.

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





La primera implementación debe utilizar filesystem.

Guardar información como JSON.

Estructura:

```
data/

 ├── inmobiliaria_<id_inmobiliaria>/
    ├── usuarios.json
    ├── personas.json
    ├── tareas.json
    ├── documentos.json
    ├── auditoria.json
    └── password_resets.json
         └── inmuebles
               └── inmueble_<id>
                   ├── inmueble.json 
                   ├── contratos.json
                   ├── pagos.json
                   ├── gastos.json

```

Debe ser posible migrar posteriormente a una base de datos real reemplazando solamente DAOs.

---


---

# Autenticación

Implementar:

- Login email/password.
- bcrypt.
- JWT.
- Refresh tokens.


JWT:

```json
{
"userId":"",
"inmobiliariaId":"",
"role":""
}
```

---

# Sesiones


Entidad:

```
Session
```

Campos:

```
id

userId

refreshTokenHash

createdAt

expiresAt
```

Permitir:

- cerrar sesión.
- invalidar sesiones.


---

# Recuperación de contraseña


Flujo:

1. Usuario solicita recuperación.
2. Generar token.
3. Guardar hash del token.
4. Enviar email.


Entidad:

```
PasswordReset
```

Campos:

```
id

userId

inmobiliariaId

tokenHash

expirationDate

used
```

Reglas:

- Expira en 48 horas.
- Uso único.
- Se invalida después del cambio.


---



# InmobiliariaSchema

{
"id":"",
"nombre":"",
"razonSocial":"",
"identificacionFiscal":"",
"direccion":"",
"telefono":"",
"email":"",
"logo":"",
"activo":true,
"configuracion":ConfiguracionInmobiliariaSchema
"createdAt":"",
"updatedAt":""
}




# ConfiguracionInmobiliariaSchema

{
moneda
diasAvisoVencimientoContrato
indiceActualizacionDefault
logo
colores
}
```

---

# UsuarioSchema


{
"id":string,
"idInmobiliaria":"",
"nombre":"",
"apellido":"",
"email":"",
"passwordHash":"",
"rol": "",
"activo":true,
"createdAt":"",
"lastLogin":""
}
```

---

# RolSchema
 implementar roles y permisos.
{
   idRol: string,
   descripcion:string,
   permisos: string[]
}

Ejemplo: 
idRol:  ADMIN_INMOBILIARIA. Permisos: usuarios.create, usuarios.modify usuarios.delete,  etc

idRol:  OPERADOR. Permisos: inmueble.create, inmueble.modify, etc



## PersonaSchema

{
"idPersona":"",
"nombre":"",
"apellido":"",
"documento":"",
"fechaNacimiento":""
}
```



## ContactSchema


{ idContacto:string

   idPersona:string


email

telefonos

direccion

comentarios: ComentarioSchema[]
}

# InmuebleSchema

  {
    idInmueble:string,
    idInmobiliaria: string,
    tipo: "CASA" | "DEPARTAMENTO" | "GALPON" | "TERRENO" | "COCHERA",
    estado: "DISPONIBLE" | "ALQUILADO" | "RESERVADO",
    descripcion_interna:string,
    descripcion_publica:string,
    direccion:string,
    piso:string,
    ciudad:string,
    provincia:string,
    superficieCubierta:string,
    superficieDescubierta:string,
    superficieTotal:string,
    detalles: CasaSchema | DepartamentoSchema | GalponSchema,
    duenio: idContacto
    contratos: Lista de ContratoAlquilerSchema,
    comentarios: { fecha:Date, comentario:string, idUsuario: string},
 }  

# CasaSchema
{
"habitaciones":number,
"banios":number,    
}

# DepartamentoSchema
{
"habitaciones":number,
"banios":number,    
}


# ContratoAlquilerSchema
{
   idContrato: string,
   idContactInquilino: string,
   idContactDuenio: string,
   fechaInicioContrato: Date,
   fechaFinContrato:Date,
   fechaFinReal: Date,
   monto_actual: number,
   fecha_proxima_actualiacion_monto: Date,
   indice_actualizacion: string,
   periodo_actualizacion: string,
   historial_montos: { fecha: Date, monto:number, comentario: string},
   comentarios: ComentarioSchema[],
   garantes: GaranteSchema[],
   contrato_file_name: string
}
```

# ComentarioSchema
{ timestamp:Date, comentario:string, idUsuario: string}

# GaranteSchema
{ idContacto:string, comentario:string, porcentage: string, fechaInicio:Date, fechaFin:Date}



---

# Pagos 
Representan pagos que deben hacer los inquilinos

PagoSchema
{
idPago:string,
idContrato:idInmueble,
idContrato:string,
periodo: string,
monto_original: number,
monto_retraso: number,
monto_pagado: number,
tipo: ALGUILER, EXPENSA, IMPUESTO, GASTO_MANTENIMIENTO, GASTO_EXCEPCIONAL
responsable_pago: INQUILINO, DUENIO
moneda: string,
fechaVencimiento: Date
fechaPago: Date,
estado: PENDIENTE | PAGADO | ATRASADO | CANCELADO,
comentarios: ComenatarioSchema[]
}


# GastosSchema
Representa gastos de mantenimiento del inmueble. Lo paga la inmobiliaria y se crea un registro Pago como deuda por parte del dueño o el inquilino


---

# Documentos y archivos
Permitir adjuntar:

- contratos PDF
- escrituras
- fotos
- planos



```
Attachment
```

Campos:

```
{ 
    idAttachment: string,
    idInmobiliaria: string,
    dataUrl: string,
    type: CONTRATO, DOCUMENTACION_PERSONAL, DOCUMENTACION_INMUEBLE,
    fileName: string
}
```

---

# Agenda y tareas


Entidad:

```
Task
```

Campos:

```
id

inmobiliariaId

usuarioId

titulo

descripcion

fechaVencimiento

prioridad

estado
```

Ejemplos:

- renovar contrato
- llamar propietario
- visitar inmueble
- cobrar alquiler

---

# Auditoría


Registrar todos los cambios importantes.


Entidad:

```
AuditLog
```

Campos:

```
id

inmobiliariaId

userId

entity

entityId

action

oldValue

newValue

timestamp
```

Ejemplo:

```
Usuario Carlos modificó contrato:

Monto:
500000 -> 600000
```

---

# Notificaciones


Crear servicio:


```
NotificationService
```

Preparado para:

- Email
- WhatsApp
- Push


Eventos:

- contrato próximo a vencer
- pago atrasado
- tarea pendiente
- cambio de password


---

# Soft Delete


No eliminar información crítica.


Agregar:

```
deletedAt
```

a entidades importantes.

---

# API REST


Versionar:

```
/api/v1
```


---

## Auth

```
POST /api/v1/auth/login

POST /api/v1/auth/logout

POST /api/v1/auth/request-password-reset

POST /api/v1/auth/reset-password
```


---

## Propiedades

```
GET /api/v1/properties

GET /api/v1/properties/:id

POST /api/v1/properties

PUT /api/v1/properties/:id

DELETE /api/v1/properties/:id
```


Filtros:

- dirección
- ciudad
- estado
- dueño
- inquilino


---

## Contactos

```
GET /api/v1/contacts

GET /api/v1/contacts/:id

POST /api/v1/contacts

PUT /api/v1/contacts/:id
```


---

## Contratos

```
GET /api/v1/contracts

POST /api/v1/contracts

PUT /api/v1/contracts/:id
```


---

# Seguridad Multi Tenant


Toda consulta debe usar:

```
currentUser.inmobiliariaId
```


Nunca permitir:

```
findAll()
```

sin filtro tenant.

---

# Frontend


## Login

Debe incluir:

- email
- password
- recuperar password


---

# Dashboard


Mostrar:

- cantidad propiedades
- contratos activos
- vencimientos próximos
- ingresos
- pagos atrasados
- tareas pendientes


---

# Listado propiedades


Mostrar:

- dirección
- unidad
- estado
- dueño
- inquilino
- contrato


Permitir:

- búsqueda
- filtros
- ordenamiento


---

# Detalle propiedad


Mostrar:

- datos físicos
- unidades
- dueños
- inquilinos actuales
- historial
- garantes
- contratos
- pagos
- documentos


---

# Detalle contacto


Mostrar:

- datos personales
- propiedades como dueño
- alquileres actuales
- historial
- garantías otorgadas


---

# Calidad del código


Debe incluir:

- README profesional
- instalación
- configuración
- variables de entorno
- ejemplos API
- datos iniciales
- tests básicos


Formato de errores:

```json
{
"success":false,
"message":"",
"code":""
}
```

---

# Principios obligatorios

- Código limpio.
- Arquitectura profesional.
- Separación estricta de responsabilidades.
- Preparado para crecimiento SaaS.
- Aislamiento total entre inmobiliarias.
- Persistencia desacoplada.
- Migración futura simple a PostgreSQL.
- Seguridad desde el diseño.
- Auditoría completa.
- Modelo preparado para operaciones reales de una inmobiliaria.
```