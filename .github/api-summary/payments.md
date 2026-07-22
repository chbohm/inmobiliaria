# Payments API

## Purpose

Manage financial transactions related to rental contracts.

Payments represent:

- Rental payments.
- Expenses.
- Taxes.
- Maintenance costs.
- Exceptional charges.

Payments belong to a contract and property.

---

# Authorization

All endpoints require:

```
scope = TENANT
```

Allowed roles:

- Tenant administrator.
- Accounting users.
- Property managers.
- Users with payment management permissions.

---

# Payment Management

## GET /payments

Returns payments belonging to the authenticated tenant.

Supports:

- Pagination.
- Search.
- Filtering.
- Sorting.

Possible filters:

- Property.
- Contract.
- Payment type.
- Status.
- Period.
- Due date.
- Responsible party.

Examples:

```
status=PENDING
status=PAID
status=OVERDUE
```

**Allowed scopes**

- TENANT

**Notes**

- Only payments from current tenant are returned.
- Deleted payments excluded by default.
- Must support financial dashboards.

---

## GET /payments/:id

Returns complete payment information.

Includes:

- Contract.
- Property.
- Payment period.
- Original amount.
- Paid amount.
- Delay amount.
- Status.
- Responsible party.
- Comments.

**Allowed scopes**

- TENANT

**Notes**

- Payment must belong to authenticated tenant.
- Financial information must respect permissions.

---

## POST /payments

Creates a new payment record.

Creates:

- Payment entry.
- Relationship with contract.
- Payment period.
- Financial status.

**Allowed scopes**

- TENANT

**Required validations**

- Contract exists.
- Contract belongs to tenant.
- Property belongs to tenant.
- Amounts are valid.
- Payment type is valid.

---

## PUT /payments/:id

Updates payment information.

Possible updates:

- Paid amount.
- Payment date.
- Status.
- Comments.
- Delay amount.

**Allowed scopes**

- TENANT

**Notes**

- Changes must be audited.
- Original financial information should be preserved when required.
- Payment history must remain traceable.

---

## DELETE /payments/:id

Soft deletes a payment.

Payment remains available for:

- Audit.
- Historical reports.
- Financial analysis.

**Allowed scopes**

- TENANT

**Notes**

- Hard deletion forbidden.
- Deleted payments should not affect active dashboards.

---

# Payment Types

Supported values:

```
RENT
EXPENSE
TAX
MAINTENANCE_COST
EXCEPTIONAL_COST
```

Equivalent domain values:

```
ALQUILER
EXPENSA
IMPUESTO
GASTO_MANTENIMIENTO
GASTO_EXCEPCIONAL
```

---

# Payment Status

Supported values:

```
PENDING
PAID
OVERDUE
CANCELLED
```

Equivalent domain values:

```
PENDIENTE
PAGADO
ATRASADO
CANCELADO
```

---

# Responsible Party

Payment responsibility:

```
TENANT
OWNER
```

Equivalent domain values:

```
INQUILINO
DUENIO
```

---

# Payment Lifecycle

Typical flow:

```
PENDING
   |
   +--> PAID
   |
   +--> OVERDUE
             |
             +--> PAID
```

Cancelled payments:

```
PENDING
   |
   +--> CANCELLED
```

---

# Payment Data

Main fields:

```
idPago

idContrato

idInmueble

periodo

montoOriginal

montoRetraso

montoPagado

tipo

responsablePago

moneda

fechaVencimiento

fechaPago

estado

comentarios

createdAt
updatedAt
deletedAt
```

---

# Financial Rules

## Amount calculation

Example:

```
Original amount:
500000

Delay:
20000

Total due:
520000
```

Paid:

```
Paid amount:
520000

Status:
PAID
```

---

# Contract Relationship

Payment belongs to:

```
Contract
 |
 +-- Payment[]
```

Payments cannot exist without a contract.

---

# Property Relationship

Payment also references property:

```
Property
 |
 +-- Contract
       |
       +-- Payment
```

Validation:

```
payment.propertyId
must match
contract.propertyId
```

---

# Dashboard Usage

Payments feed:

Tenant dashboard:

- Pending payments.
- Late payments.
- Income summary.
- Collection status.

System dashboard:

- Global subscription/payment information only.
- No tenant financial data access unless explicitly authorized.

---

# Filtering Rules

Every payment query must include:

```
inmobiliariaId = currentUser.inmobiliariaId
```

Forbidden:

```
paymentDAO.findAll()
```

Required:

```
paymentDAO.findAllByTenant(currentTenant)
```

---

# Audit Rules

Audit required for:

- Payment creation.
- Amount modification.
- Status changes.
- Payment cancellation.
- Payment deletion.

Example:

```
Action:
UPDATE_PAYMENT_STATUS

Before:
PENDING

After:
PAID
```

---

# Security Rules

- Tenant isolation mandatory.
- No payment can reference another tenant contract.
- Financial data must not leak between tenants.
- All modifications must be traceable.

---

# Related Documentation

- `contracts.md`
- `properties.md`
- `audit.md`
- `documents.md`
- `api-guidelines.md`