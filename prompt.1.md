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
## Persistencia: leer prompt.2.persistencia.md

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