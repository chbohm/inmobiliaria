# API Contracts

## Purpose

Defines REST API endpoints for managing rental contracts inside a tenant.

Contracts represent legal rental agreements between:

- Property owner.
- Tenant.
- Guarantors.
- Real estate agency.

A contract belongs to:

- One property.
- One tenant.
- One owner.

---

# Security

## Authentication

All endpoints require authentication.

Required header:

```http
Authorization: Bearer <access_token>
```

---

## Scope

Required scope:

```text
TENANT
```

---

## Tenant Isolation

All operations must use:

```typescript
currentUser.inmobiliariaId
```

Rules:

- Users can only access contracts from their own inmobiliaria.
- Contract IDs are not globally accessible.
- Property ownership validation is mandatory.
- Tenant and owner references must belong to current tenant.

Forbidden:

```text
Access contract by ID without tenant validation.
```

Allowed:

```text
Find contract by ID + inmobiliariaId.
```

---

# Domain Model

Relationship:

```text
Inmobiliaria
    |
    |
    +---- Property
              |
              |
              +---- Contract
                       |
                       +---- Tenant
                       |
                       +---- Owner
                       |
                       +---- Guarantors
                       |
                       +---- Payments
```

---

# Base Path

```http
/api/v1/contracts
```

---

# GET /api/v1/contracts

## Purpose

Returns rental contracts belonging to current tenant.

Used for:

- Contract management.
- Searching active rentals.
- Dashboard information.
- Expiration monitoring.

---

## Authentication

Required.

Header:

```http
Authorization: Bearer <access_token>
```

---

## Allowed Scope

```text
TENANT
```

---

## Allowed Roles

```text
ADMIN
MANAGER
USER
```

---

## Query Parameters

Supported filters:

```text
?page=1
&limit=50
&propertyId=uuid
&tenantId=uuid
&ownerId=uuid
&status=ACTIVE
&expirationBefore=2026-12-31
```

Example:

```http
GET /api/v1/contracts?status=ACTIVE
```

---

## Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "idContrato": "uuid",
        "idInmueble": "uuid",
        "idInquilino": "uuid",
        "fechaInicioContrato": "2026-01-01T00:00:00Z",
        "fechaFinContrato": "2027-01-01T00:00:00Z",
        "montoActual": 500000
      }
    ]
  }
}
```

---

# GET /api/v1/contracts/:id

## Purpose

Returns complete contract detail.

Includes:

- Contract information.
- Property.
- Tenant.
- Owner.
- Guarantors.
- Payment summary.
- Amount history.

---

## Authentication

Required.

Header:

```http
Authorization: Bearer <access_token>
```

---

## Allowed Scope

```text
TENANT
```

---

## Allowed Roles

```text
ADMIN
MANAGER
USER
```

---

## Response

```json
{
  "success": true,
  "data": {
    "idContrato": "uuid",
    "idInmueble": "uuid",
    "idInquilino": "uuid",
    "idDuenio": "uuid",
    "fechaInicioContrato": "2026-01-01T00:00:00Z",
    "fechaFinContrato": "2027-01-01T00:00:00Z",
    "montoActual": 500000,
    "indiceActualizacion": "IPC",
    "periodoActualizacion": "MENSUAL",
    "garantes": [],
    "historialMontos": []
  }
}
```

---

# POST /api/v1/contracts

## Purpose

Creates a new rental contract.

---

## Authentication

Required.

Header:

```http
Authorization: Bearer <access_token>
```

---

## Allowed Scope

```text
TENANT
```

---

## Allowed Roles

```text
ADMIN
MANAGER
```

---

## Business Rules

Before creating:

- Property must exist.
- Property must belong to current tenant.
- Tenant must exist.
- Owner must exist.
- Dates must be valid.
- Property cannot have another active contract.

---

## Request

```json
{
  "idInmueble": "uuid",
  "idInquilino": "uuid",
  "idDuenio": "uuid",
  "fechaInicioContrato": "2026-01-01T00:00:00Z",
  "fechaFinContrato": "2027-01-01T00:00:00Z",
  "montoActual": 500000,
  "indiceActualizacion": "IPC",
  "periodoActualizacion": "MENSUAL",
  "garantes": []
}
```

---

## Response

```json
{
  "success": true,
  "data": {
    "idContrato": "uuid"
  }
}
```

---

## Errors

Possible errors:

```text
VALIDATION_ERROR
RESOURCE_NOT_FOUND
PROPERTY_ALREADY_RENTED
TENANT_ACCESS_DENIED
```

---

# PUT /api/v1/contracts/:id

## Purpose

Updates an existing contract.

---

## Authentication

Required.

Header:

```http
Authorization: Bearer <access_token>
```

---

## Allowed Scope

```text
TENANT
```

---

## Allowed Roles

```text
ADMIN
MANAGER
```

---

## Editable Fields

Allowed:

```text
fechaFinContrato
montoActual
indiceActualizacion
periodoActualizacion
garantes
comentarios
```

---

## Audit

Required.

Example:

```text
Contract updated:

montoActual:
500000 -> 600000
```

---

## Request

```json
{
  "montoActual": 600000,
  "indiceActualizacion": "IPC",
  "periodoActualizacion": "TRIMESTRAL"
}
```

---

## Response

```json
{
  "success": true,
  "data": {
    "updated": true
  }
}
```

---

# DELETE /api/v1/contracts/:id

## Purpose

Soft deletes a contract.

---

## Authentication

Required.

Header:

```http
Authorization: Bearer <access_token>
```

---

## Allowed Scope

```text
TENANT
```

---

## Allowed Roles

```text
ADMIN
```

---

## Behavior

Never physically delete.

Update:

```json
{
  "deletedAt": "2026-01-01T10:00:00Z"
}
```

---

# Contract Guarantors

Guarantors are managed as part of contract data.

Structure:

```json
{
  "idContacto": "uuid",
  "comentario": "Guarantees full amount",
  "porcentaje": 100,
  "fechaInicio": "2026-01-01T00:00:00Z",
  "fechaFin": "2027-01-01T00:00:00Z"
}
```

Rules:

- Guarantor must exist as contact.
- Contact must belong to current tenant.
- Changes must be audited.

---

# Contract Amount History

Every amount change must preserve history.

Example:

```json
{
  "fecha": "2026-04-01T00:00:00Z",
  "monto": 600000,
  "comentario": "IPC update"
}
```

Rules:

- Never overwrite previous amounts.
- Add new history entry.

---

# Contract Status

Calculated from dates.

Possible states:

```text
ACTIVE
EXPIRED
CANCELLED
```

---

# DAO Requirements

Required DAO:

```typescript
ContractDAO

create()

findById()

findAll()

findActiveByPropertyId()

findByTenantId()

update()

softDelete()
```

---

# Service Requirements

Required service:

```typescript
ContractService

createContract()

getContract()

listContracts()

updateContract()

deleteContract()

calculateStatus()

updateAmount()
```

Services must:

- Validate business rules.
- Check tenant ownership.
- Create audit records.
- Never access filesystem directly.

---

# Validation Rules

Required fields:

```text
idInmueble
idInquilino
idDuenio
fechaInicioContrato
fechaFinContrato
montoActual
indiceActualizacion
periodoActualizacion
```

---

# Future Extensions

Possible future features:

```text
Electronic signatures.
Contract templates.
Automatic renewals.
Legal document generation.
Contract notifications.
Rent adjustments automation.
```