# Prompt: Desarrollo de Plataforma SaaS Profesional de Gestion Inmobiliaria

## Rol

Actua como un arquitecto de software senior especializado en:

- Node.js
- Express.js
- TypeScript
- Sistemas SaaS multi-tenant
- Arquitecturas empresariales escalables
- APIs REST
- Seguridad
- Diseno de aplicaciones inmobiliarias
- Modelado de dominios complejos

Tu objetivo es disenar y desarrollar una plataforma profesional para la gestion integral de inmobiliarias.

La aplicacion debe estar preparada para ser utilizada como un producto SaaS comercial, soportando multiples inmobiliarias independientes con aislamiento completo de datos.

---

# Objetivo general

Crear una plataforma web donde cada inmobiliaria pueda administrar:

- Usuarios internos
- Roles y permisos
- Contactos
- Propietarios
- Inquilinos
- Garantes
- Propiedades
- Contratos
- Pagos
- Documentos
- Tareas
- Auditoria de cambios

Ademas, la plataforma debe contar con un backoffice global de sistema para administrar:

- Tenants
- Suscripciones
- Usuarios de sistema
- Roles de super usuario
- Bootstrap del primer tenant

Cada inmobiliaria tiene una suscripcion para uso del sistema.

---

# Arquitectura general

La aplicacion debe seguir principios:

- Clean Architecture
- Separation of Concerns
- SOLID
- DAO Pattern
- Domain Driven Design basico
- Preparacion para escalamiento

---

# Tecnologias

## Backend

Utilizar:

- Node.js
- Express.js
- TypeScript
- REST API
- JWT con refresh tokens
- bcrypt
- Validacion de datos (usar zod para definir request payloads y luego para validarlos)
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

```text
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
- Validar entrada via zod schemas.
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

## Persistencia

Leer [prompt.2.persistencia.md](prompt.2.persistencia.md).

---

# Autenticacion

Implementar:

- Login email/password.
- bcrypt.
- JWT de acceso de corta duracion.
- Refresh tokens persistidos en forma hasheada.
- Rotacion e invalidacion de refresh tokens.

JWT tenant:

```json
{
	"userId": "",
	"inmobiliariaId": "",
	"role": "",
	"scope": "TENANT"
}
```

JWT sistema:

```json
{
	"userId": "",
	"role": "",
	"scope": "SYSTEM"
}
```

Los roles de super usuario solo aplican al scope SYSTEM.

---

# Sesiones

Entidad:

```text
Session
```

Campos:

```text
id
scope
userId
inmobiliariaId
refreshTokenHash
createdAt
expiresAt
revokedAt
```

Reglas:

- Si `scope = TENANT`, `inmobiliariaId` es obligatorio.
- Si `scope = SYSTEM`, `inmobiliariaId` debe ser `null` o no existir.
- Debe permitir cerrar sesion.
- Debe permitir invalidar sesiones activas.

---

# Recuperacion de contrasena

Flujo:

1. Usuario solicita recuperacion.
2. Generar token.
3. Guardar hash del token.
4. Enviar email.

Entidad:

```text
PasswordReset
```

Campos:

```text
id
userId
inmobiliariaId
tokenHash
expirationDate
used
createdAt
```

Reglas:

- Expira en 48 horas.
- Uso unico.
- Se invalida despues del cambio.

---

# Auditoria

Registrar todos los cambios importantes.

Entidad:

```text
AuditLog
```

Campos:

```text
id
scope
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

```text
Usuario Carlos modifico contrato:

Monto:
500000 -> 600000
```

---

# Soft Delete

No eliminar informacion critica.

Agregar:

```text
deletedAt
```

a entidades importantes.

---

# API REST

Versionar:

```text
/api/v1
```

La API debe cubrir tanto el dominio tenant como el dominio global de sistema.

---

## Auth

```text
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/logout-all
POST /api/v1/auth/request-password-reset
POST /api/v1/auth/reset-password
GET  /api/v1/auth/me
```

---

## Usuarios y roles tenant

```text
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id

GET    /api/v1/roles
GET    /api/v1/roles/:id
POST   /api/v1/roles
PUT    /api/v1/roles/:id
DELETE /api/v1/roles/:id
```

---

## Propiedades

```text
GET    /api/v1/properties
GET    /api/v1/properties/:id
POST   /api/v1/properties
PUT    /api/v1/properties/:id
DELETE /api/v1/properties/:id
```

Filtros:

- direccion
- ciudad
- estado
- dueno
- inquilino

---

## Contactos

```text
GET    /api/v1/contacts
GET    /api/v1/contacts/:id
POST   /api/v1/contacts
PUT    /api/v1/contacts/:id
DELETE /api/v1/contacts/:id
```

---

## Contratos

```text
GET    /api/v1/contracts
GET    /api/v1/contracts/:id
POST   /api/v1/contracts
PUT    /api/v1/contracts/:id
DELETE /api/v1/contracts/:id
```

---

## Pagos

```text
GET    /api/v1/payments
GET    /api/v1/payments/:id
POST   /api/v1/payments
PUT    /api/v1/payments/:id
DELETE /api/v1/payments/:id
```

---

## Documentos

```text
GET    /api/v1/documents
GET    /api/v1/documents/:id
POST   /api/v1/documents
DELETE /api/v1/documents/:id
```

---

## Tareas

```text
GET    /api/v1/tasks
GET    /api/v1/tasks/:id
POST   /api/v1/tasks
PUT    /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
```

---

## Auditoria tenant

```text
GET /api/v1/audit
GET /api/v1/audit/:id
```

---

## Dashboard tenant

```text
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/upcoming-expirations
GET /api/v1/dashboard/late-payments
```

---

## Backoffice de sistema

Solo disponible para usuarios con `scope = SYSTEM` y rol de super usuario.

```text
POST   /api/v1/system/bootstrap

GET    /api/v1/system/tenants
GET    /api/v1/system/tenants/:id
POST   /api/v1/system/tenants
PUT    /api/v1/system/tenants/:id
POST   /api/v1/system/tenants/:id/suspend
POST   /api/v1/system/tenants/:id/activate

GET    /api/v1/system/subscriptions
GET    /api/v1/system/subscriptions/:id
POST   /api/v1/system/subscriptions
PUT    /api/v1/system/subscriptions/:id

GET    /api/v1/system/users
GET    /api/v1/system/users/:id
POST   /api/v1/system/users
PUT    /api/v1/system/users/:id
DELETE /api/v1/system/users/:id

GET    /api/v1/system/audit
GET    /api/v1/system/dashboard
```

---

# Seguridad Multi Tenant

Toda consulta tenant debe usar:

```text
currentUser.inmobiliariaId
```

Nunca permitir:

```text
findAll()
```

sin filtro tenant dentro de DAOs tenant.

Los endpoints de sistema no deben leer informacion de carpetas tenant salvo a traves de servicios y DAOs explicitamente autorizados para operaciones de administracion global.

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
- vencimientos proximos
- ingresos
- pagos atrasados
- tareas pendientes

---

# Listado propiedades

Mostrar:

- direccion
- estado
- dueno
- inquilino
- contrato

Permitir:

- busqueda
- filtros
- ordenamiento

---

# Detalle propiedad

Mostrar:

- datos fisicos
- duenos
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
- propiedades como dueno
- alquileres actuales
- historial
- garantias otorgadas

---

# Calidad del codigo

Debe incluir:

- README profesional
- instalacion
- configuracion
- variables de entorno
- ejemplos API
- datos iniciales
- tests basicos

Formato de errores:

```json
{
	"success": false,
	"message": "",
	"code": ""
}
```

---

# Principios obligatorios

- Codigo limpio.
- Arquitectura profesional.
- Separacion estricta de responsabilidades.
- Preparado para crecimiento SaaS.
- Aislamiento total entre inmobiliarias.
- Persistencia desacoplada.
- Migracion futura simple a PostgreSQL.
- Seguridad desde el diseno.
- Auditoria completa.
- Modelo preparado para operaciones reales de una inmobiliaria.