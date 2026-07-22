# Properties API

## Purpose

Manage real estate properties belonging to a tenant.

Properties are the central business entity of the real estate platform.

A property can contain:

- General information.
- Owner information.
- Rental contracts.
- Payments.
- Documents.
- Comments.
- Attachments.
- Historical records.

Each tenant manages an independent property catalog.

---

# Authorization

All endpoints require:

```
scope = TENANT
```

Access depends on user permissions.

Typical allowed roles:

- Tenant administrator.
- Property managers.
- Users with property management permissions.

---

# Property Management

## GET /properties

Returns all properties belonging to the authenticated tenant.

Supports:

- Pagination.
- Search.
- Filtering.
- Sorting.

Possible filters:

- Address.
- City.
- Province.
- Property type.
- Status.
- Owner.
- Tenant.
- Availability.

**Allowed scopes**

- TENANT

**Notes**

- Results must only include properties from the authenticated tenant.
- Deleted properties are excluded by default.
- Must never execute unfiltered cross-tenant queries.

---

## GET /properties/:id

Returns complete information about a property.

Includes:

- Property details.
- Location.
- Surfaces.
- Owner.
- Current contract.
- Payments.
- Documents.
- Comments.
- Attachments.

**Allowed scopes**

- TENANT

**Notes**

- Property must belong to the authenticated tenant.
- Response may include related entities according to permissions.
- Historical information must remain available.

---

## POST /properties

Creates a new property.

Creates:

- Property record.
- Initial configuration.
- Tenant ownership relationship.

**Allowed scopes**

- TENANT

**Notes**

- Property automatically belongs to the authenticated tenant.
- Owner reference must belong to the same tenant.
- Required fields must be validated using schemas.

---

## PUT /properties/:id

Updates property information.

Possible updates:

- Description.
- Address.
- Location.
- Surfaces.
- Bathrooms.
- Status.
- Owner information.

**Allowed scopes**

- TENANT

**Notes**

- Property cannot be moved between tenants.
- Important changes must be audited.
- Business history must not be overwritten.

---

## DELETE /properties/:id

Soft deletes a property.

The property remains available for:

- Audit history.
- Historical contracts.
- Previous payments.
- Reports.

**Allowed scopes**

- TENANT

**Notes**

- Properties with active contracts should require validation before deletion.
- Hard delete is forbidden for business entities.

---

# Property Status

Supported statuses:

```
AVAILABLE
RENTED
RESERVED
```

Status changes must respect business rules.

Examples:

Allowed:

```
AVAILABLE → RESERVED
RESERVED → RENTED
RENTED → AVAILABLE
```

Forbidden:

```
DELETE property with active contract
```

without explicit handling.

---

# Property Relationships

A property may reference:

```
Property
 |
 +-- Owner
 |
 +-- Current Contract
 |       |
 |       +-- Tenant
 |       +-- Guarantors
 |       +-- Payments
 |
 +-- Documents
 |
 +-- Comments
 |
 +-- Attachments
```

---

# Property Detail Requirements

The property detail view should provide:

## Basic Information

- Address.
- City.
- Province.
- Type.
- Status.
- Internal description.
- Public description.

---

## Physical Information

- Covered surface.
- Uncovered surface.
- Total surface.
- Bathrooms.

---

## Owner Information

Display:

- Owner contact.
- Ownership relationship.
- Historical information.

---

## Current Contract

If available:

- Start date.
- End date.
- Current amount.
- Update date.
- Update index.
- Update period.

---

## Payments

Display:

Completed payments:

- Period.
- Amount paid.
- Payment date.
- Status.

Pending payments:

- Period.
- Due date.
- Outstanding amount.
- Delay amount.
- Responsible party.

---

## Documents

Manage:

- Contracts.
- Personal documentation.
- Property documentation.
- Photos.
- Plans.

---

# Filtering Rules

Property queries must always include:

```
inmobiliariaId = currentUser.inmobiliariaId
```

Forbidden:

```
propertyDAO.findAll()
```

Required:

```
propertyDAO.findAllByTenant(currentTenant)
```

---

# Audit Rules

Important operations must create audit records:

Examples:

- Property created.
- Property updated.
- Owner changed.
- Status changed.
- Property deleted.

---

# Security Rules

- Tenant isolation is mandatory.
- Owners must belong to the same tenant.
- Related contracts and payments must be validated.
- No property data may leak between tenants.

---

# Related Documentation

- `contacts.md`
- `contracts.md`
- `payments.md`
- `documents.md`
- `audit.md`
- `persistence.md`
- `api-guidelines.md`