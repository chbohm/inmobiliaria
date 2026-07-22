# API Persons and Contacts

## Purpose

Defines REST API rules for managing persons and contacts inside a tenant.

The module separates:

- Person identity information.
- Contact communication information.

A person represents an individual.

A contact represents communication data linked to a person.

Examples:

- Property owner.
- Tenant.
- Guarantor.
- Employee.
- External contact.

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

- Users can only access data from their own inmobiliaria.
- Same person can exist in multiple tenants.
- Records between tenants are completely independent.

Forbidden:

```text
Global person search across tenants.
```

Allowed:

```text
Search person by document inside current tenant only.
```

---

# Domain Model

Relationship:

```text
Person
 |
 +---- Contact
```

Example:

```json
{
  "idPersona": "uuid",
  "nombre": "Juan",
  "apellido": "Perez",
  "documento": "12345678"
}
```

Contact example:

```json
{
  "idContacto": "uuid",
  "idPersona": "uuid",
  "emails": [
    "juan@email.com"
  ],
  "telefonos": [
    "+549111111111"
  ]
}
```

---

# Persons API

Base path:

```http
/api/v1/persons
```

---

# GET /api/v1/persons

## Purpose

Returns persons belonging to current tenant.

Used for:

- Selecting owners.
- Selecting tenants.
- Selecting guarantors.
- Contact management.

---

## Authentication

Required.

Header:

```http
Authorization: Bearer <access_token>
```

---

## Scope

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

Optional filters:

```text
?page=1
&limit=50
&name=Juan
&lastname=Perez
&document=12345678
```

Example:

```http
GET /api/v1/persons?document=12345678
```

---

## Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "idPersona": "uuid",
        "nombre": "Juan",
        "apellido": "Perez",
        "documento": "12345678"
      }
    ]
  }
}
```

---

# GET /api/v1/persons/:id

## Purpose

Returns person detail.

---

## Authentication

Required.

Header:

```http
Authorization: Bearer <access_token>
```

---

## Scope

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
    "idPersona": "uuid",
    "nombre": "Juan",
    "apellido": "Perez",
    "documento": "12345678",
    "fechaNacimiento": "1980-01-01T00:00:00Z"
  }
}
```

---

# POST /api/v1/persons

## Purpose

Creates a new person inside current tenant.

---

## Authentication

Required.

Header:

```http
Authorization: Bearer <access_token>
```

---

## Scope

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

## Request

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "documento": "12345678",
  "fechaNacimiento": "1980-01-01T00:00:00Z"
}
```

---

## Response

```json
{
  "success": true,
  "data": {
    "idPersona": "uuid"
  }
}
```

---

## Errors

Possible errors:

```text
VALIDATION_ERROR
DUPLICATE_RESOURCE
```

---