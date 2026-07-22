# Contracts API

## Purpose

Manage rental contracts associated with properties.

Contracts represent the legal rental agreement between:

- Property owner.
- Tenant/renter.
- Guarantors.

A contract belongs to one property and one tenant organization.

---

# Authorization

All endpoints require:

```
scope = TENANT
```

Allowed roles:

- Tenant administrator.
- Property managers.
- Users with contract management permissions.

---

# Contract Management

## GET /contracts

Returns rental contracts belonging to the authenticated tenant.

Supports:

- Pagination.
- Search.
- Filtering.
- Sorting.

Possible filters:

- Property.
- Tenant/renter.
- Owner.
- Status.
- Expiration date.
- Contract period.

**Allowed scopes**

- TENANT

**Notes**

- Results must only include contracts from current tenant.
- Deleted contracts excluded by default.
- Must support expiration monitoring.

---

## GET /contracts/:id

Returns complete contract information.

Includes:

- Property.
- Owner.
- Renter.
- Guarantors.
- Current amount.
- Update rules.
- Payment history.
- Documents.
- Comments.

**Allowed scopes**

- TENANT

**Notes**

- Contract must belong to authenticated tenant.
- Related entities must be validated.
- Sensitive information requires permissions.

---

## POST /contracts

Creates a new rental contract.

Creates:

- Contract record.
- Relationship with property.
- Rental period.
- Initial payment configuration.

**Allowed scopes**

- TENANT

**Required validations**

- Property exists.
- Property belongs to tenant.
- Owner exists.
- Renter exists.
- Dates are valid.
- Amount is positive.

**Business rules**

- A property should not have multiple active contracts.
- Contract creation must be audited.

---

## PUT /contracts/:id

Updates contract information.

Possible updates:

- End date.
- Rental amount.
- Update index.
- Update period.
- Guarantors.
- Comments.

**Allowed scopes**

- TENANT

**Notes**

- Historical amounts must not be overwritten.
- Amount changes create history entries.
- Important modifications must generate audit records.

---

## DELETE /contracts/:id

Soft deletes a contract.

The contract remains available for:

- Audit.
- Historical payments.
- Reports.

**Allowed scopes**

- TENANT

**Notes**

- Active contracts require validation.
- Hard deletion forbidden.

---

# Contract Lifecycle

Possible states:

```
ACTIVE
EXPIRED
CANCELLED
FINISHED
```

State transitions:

```
ACTIVE
 |
 +--> FINISHED
 |
 +--> CANCELLED

ACTIVE
 |
 +--> EXPIRED
```

---

# Contract Data

Main fields:

```
idContrato
idInmueble
idInquilino
idDuenio

fechaInicioContrato
fechaFinContrato

montoActual

fechaProximaActualizacionMonto

indiceActualizacion

periodoActualizacion

historialMontos

garantes

comentarios

createdAt
updatedAt
deletedAt
```

---

# Rental Amount Updates

Amount changes must preserve history.

Example:

Before:

```
amount = 500000
```

After:

```
amount = 600000
```

Store:

```
HistorialMonto

date:
2026-01-01

old amount:
500000

new amount:
600000

comment:
"Annual adjustment"
```

Never overwrite previous values.

---

# Guarantors

Contracts may contain guarantors.

Guarantor information:

```
idContacto
comentario
porcentaje
fechaInicio
fechaFin
```

Rules:

- Guarantor must belong to same tenant.
- Changes must be audited.

---

# Payments Relationship

Contract owns payment lifecycle.

Relationship:

```
Contract
 |
 +-- Payments
```

Payments contain:

- Rental periods.
- Amounts.
- Due dates.
- Payment status.
- Delays.

---

# Contract Documents

Contracts may contain:

- Signed contract files.
- Attachments.
- Legal documentation.

Documents must be stored through document services.

---

# Filtering Rules

Every query must include:

```
inmobiliariaId = currentUser.inmobiliariaId
```

Forbidden:

```
contractDAO.findAll()
```

Required:

```
contractDAO.findAllByTenant(currentTenant)
```

---

# Audit Rules

Audit required for:

- Contract creation.
- Contract modification.
- Amount changes.
- Date changes.
- Guarantor changes.
- Contract deletion.

Example:

```
User:
Carlos

Action:
UPDATE_CONTRACT_AMOUNT

Before:
500000

After:
600000
```

---

# Security Rules

- Tenant isolation mandatory.
- Contract cannot reference another tenant property.
- Contract cannot reference external contacts.
- Financial information requires authorization.

---

# Related Documentation

- `properties.md`
- `payments.md`
- `contacts.md`
- `documents.md`
- `audit.md`
- `api-guidelines.md`