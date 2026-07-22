# Contacts API

## Purpose

Manage people and contact information inside a tenant.

Contacts represent business-related people:

- Owners.
- Tenants/renters.
- Guarantors.
- Other related contacts.

Each tenant manages its own independent contact database.

---

# Authorization

All endpoints require:

```
scope = TENANT
```

Allowed roles:

- Tenant administrator.
- Property managers.
- Users with contact management permissions.

---

# Contact Management

## GET /contacts

Returns contacts belonging to the authenticated tenant.

Supports:

- Pagination.
- Search.
- Filtering.
- Sorting.

Possible filters:

- Name.
- Last name.
- Document number.
- Email.
- Phone.
- Contact role.

Examples:

```
search=Juan

document=12345678
```

**Allowed scopes**

- TENANT

**Notes**

- Only contacts from current tenant are returned.
- Deleted contacts excluded by default.
- Duplicate persons may exist across different tenants.

---

## GET /contacts/:id

Returns complete contact information.

Includes:

- Personal information.
- Emails.
- Phones.
- Address.
- Comments.
- Related properties.
- Active contracts.
- Guarantees.

**Allowed scopes**

- TENANT

**Notes**

- Contact must belong to authenticated tenant.
- Related entities must also belong to same tenant.

---

## POST /contacts

Creates a new contact.

Creates:

- Person record.
- Contact information.
- Tenant relationship.

**Allowed scopes**

- TENANT

**Required validations**

- Name required.
- Last name required.
- Contact data valid.
- Email format valid when provided.

**Notes**

The same person can exist in different tenants.

Example:

```
Tenant A:
Juan Perez
Document: 12345678


Tenant B:
Juan Perez
Document: 12345678
```

These are independent records.

---

## PUT /contacts/:id

Updates contact information.

Possible updates:

- Name.
- Last name.
- Document.
- Emails.
- Phones.
- Address.
- Comments.

**Allowed scopes**

- TENANT

**Notes**

- Changes must be audited.
- Contact identity history must be preserved when needed.

---

## DELETE /contacts/:id

Soft deletes a contact.

The contact remains available for:

- Historical contracts.
- Audit.
- Payment records.
- Reports.

**Allowed scopes**

- TENANT

**Notes**

- Hard deletion forbidden.
- Contacts referenced by contracts cannot be physically removed.

---

# Contact Data

Main fields:

```
idContacto

idPersona

emails[]

telefonos[]

direccion

comentarios[]

deletedAt
```

Related person:

```
idPersona

nombre

apellido

documento

fechaNacimiento

deletedAt
```

---

# Contact Roles

A contact may act as:

```
OWNER

TENANT

GUARANTOR

OTHER
```

A contact can have multiple relationships.

Example:

```
Juan Perez

Owner:
Apartment A

Guarantor:
Apartment B
```

---

# Owner Relationship

Contacts may own properties.

Relationship:

```
Contact
 |
 +-- Properties[]
```

Rules:

- Property owner must belong to same tenant.
- Ownership changes must be audited.

---

# Tenant/Renter Relationship

Contacts may rent properties.

Relationship:

```
Contact
 |
 +-- Contracts[]
```

Rules:

- Contract references must use tenant-owned contacts.
- Rental history must remain available.

---

# Guarantor Relationship

Contacts may guarantee contracts.

Relationship:

```
Contact
 |
 +-- Contract Guarantees[]
```

Rules:

- Guarantor must belong to same tenant.
- Guarantee changes must be audited.

---

# Search Rules

Search should support:

- Name.
- Last name.
- Document.
- Email.
- Phone.

Example:

```
GET /contacts?search=martin
```

Possible matches:

```
Martin Gomez

martin@email.com

Document 12345678
```

---

# Duplicate Rules

Do not automatically merge contacts.

Reason:

Different tenants may have independent records.

Future implementation may support:

- Duplicate detection.
- Manual merge.
- Identity verification.

---

# Audit Rules

Audit required for:

- Contact creation.
- Contact modification.
- Contact deletion.
- Relationship changes.

Examples:

```
Action:
UPDATE_CONTACT

Field:
phone

Before:
111111111

After:
222222222
```

---

# Security Rules

Mandatory:

- Tenant isolation.
- Validate contact ownership.
- Validate related entities.
- Protect personal information.

Forbidden:

```
findAllContacts()
```

without tenant filtering.

Required:

```
findAllByTenant(currentTenant)
```

---

# Dashboard Usage

Contacts are used by:

Tenant dashboard:

- Recent contacts.
- Pending documentation.

Property detail:

- Owner.
- Current renter.
- Guarantors.

Contract detail:

- Parties involved.

---

# Related Documentation

- `properties.md`
- `contracts.md`
- `documents.md`
- `audit.md`
- `api-guidelines.md`