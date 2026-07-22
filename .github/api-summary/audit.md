# Audit API

## Purpose

Track important changes performed inside the platform.

Audit logs provide:

- Traceability.
- Security monitoring.
- Business history.
- Accountability.

Every important business modification must be traceable.

---

# Authorization

## Tenant Audit

Requires:

```
scope = TENANT
```

Allowed roles:

- Tenant administrator.
- Users with audit permissions.

Access:

Only audit records belonging to current tenant.

---

## System Audit

Requires:

```
scope = SYSTEM
```

Allowed roles:

- Super users.

Access:

System administrators can review:

- Tenant creation.
- Subscription changes.
- System user actions.
- Global platform events.

---

# Tenant Audit Endpoints

---

## GET /audit

Returns audit records for current tenant.

Supports:

- Pagination.
- Filtering.
- Sorting.

Possible filters:

- User.
- Entity.
- Action.
- Date range.

Examples:

```
entity=PROPERTY

action=UPDATE

userId=uuid
```

**Allowed scopes**

- TENANT

**Notes**

- Must always filter by authenticated tenant.
- Audit history cannot be modified.

---

## GET /audit/:id

Returns detailed audit information.

Includes:

- User.
- Entity.
- Entity id.
- Action.
- Previous value.
- New value.
- Timestamp.

**Allowed scopes**

- TENANT

**Notes**

- Only audit records from current tenant.
- Read-only endpoint.

---

# System Audit Endpoints

---

## GET /system/audit

Returns global system audit records.

**Allowed scopes**

```
SYSTEM
```

Allowed roles:

- Super users.

Tracks:

- Tenant creation.
- Tenant activation.
- Tenant suspension.
- Subscription changes.
- System user actions.
- Bootstrap operations.

---

## GET /system/audit/:id

Returns detailed system audit entry.

**Allowed scopes**

```
SYSTEM
```

---

# Audit Data

Main fields:

```
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

---

# Audited Entities

Examples:

```
PROPERTY

CONTRACT

PAYMENT

CONTACT

DOCUMENT

TASK

USER

ROLE

TENANT

SUBSCRIPTION
```

---

# Audit Actions

Examples:

Creation:

```
CREATE_PROPERTY
CREATE_CONTRACT
CREATE_PAYMENT
```

Modification:

```
UPDATE_PROPERTY
UPDATE_CONTRACT
UPDATE_PAYMENT
```

Deletion:

```
DELETE_PROPERTY
DELETE_CONTACT
```

Security:

```
LOGIN_SUCCESS

LOGIN_FAILED

LOGOUT

PASSWORD_RESET

SESSION_REVOKED
```

---

# Audit Examples

## Property Update

Before:

```json
{
 "status": "AVAILABLE",
 "owner": "Juan"
}
```

After:

```json
{
 "status": "RENTED",
 "owner": "Juan"
}
```

Action:

```
UPDATE_PROPERTY
```

---

## Payment Status Change

Before:

```
PENDING
```

After:

```
PAID
```

Action:

```
UPDATE_PAYMENT_STATUS
```

---

# Audit Rules

Mandatory audit:

## Authentication

- Login success.
- Login failure.
- Logout.
- Session invalidation.
- Password reset.

## Users

- User creation.
- Role changes.
- User deletion.
- Permission changes.

## Business Data

- Property changes.
- Contract changes.
- Payment changes.
- Document changes.
- Contact changes.

---

# Immutability

Audit records are immutable.

Forbidden:

```
PUT /audit/:id

DELETE /audit/:id
```

Audit data can only be created.

---

# Persistence Rules

Tenant audit storage:

```
data/inmobiliaria_<id>/auditoria.json
```

System audit storage:

```
data/system/auditoria_sistema.json
```

---

# Multi Tenant Rules

Tenant audit:

Must always contain:

```
inmobiliariaId
```

Example:

```json
{
 "scope":"TENANT",
 "inmobiliariaId":"tenant-uuid"
}
```

System audit:

May not contain:

```
inmobiliariaId
```

unless action targets a tenant.

---

# Service Architecture

Audit should be centralized.

Recommended service:

```
AuditService
```

Example:

```typescript
auditService.record({
 entity:"PROPERTY",
 action:"UPDATE_PROPERTY",
 oldValue,
 newValue
})
```

Business services should not write files directly.

---

# Security Rules

- Audit access requires permission.
- Audit records cannot leak tenant information.
- Sensitive values may require masking.

Example:

Password:

Before:

```
abc123
```

After:

```
********
```

Never store:

- Passwords.
- Refresh tokens.
- Secrets.

---

# Dashboard Usage

Audit feeds:

Tenant dashboard:

- Recent activity.
- Security events.

System dashboard:

- Platform activity.
- Tenant operations.
- Administrative actions.

---

# Related Documentation

- `users.md`
- `roles.md`
- `security.md`
- `persistence.md`
- `api-guidelines.md`