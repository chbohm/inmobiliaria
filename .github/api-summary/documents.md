# Documents API

## Purpose

Manage files and documents associated with business entities.

Documents can belong to:

- Properties.
- Contracts.
- Contacts.
- Personal documentation.
- Legal files.
- Images.
- Plans.

Documents provide centralized file management while maintaining tenant isolation.

---

# Authorization

All endpoints require:

```
scope = TENANT
```

Allowed roles:

- Tenant administrator.
- Property managers.
- Users with document management permissions.

---

# Document Management

## GET /documents

Returns documents belonging to the authenticated tenant.

Supports:

- Pagination.
- Search.
- Filtering.
- Sorting.

Possible filters:

- Entity type.
- Entity id.
- File type.
- Creation date.

Examples:

```
entity=PROPERTY

entity=CONTRACT

type=PHOTO
```

**Allowed scopes**

- TENANT

**Notes**

- Only documents from current tenant are returned.
- Deleted documents excluded by default.
- Metadata returned before file content when possible.

---

## GET /documents/:id

Returns document metadata and content reference.

Includes:

- File name.
- MIME type.
- Entity relationship.
- Creation date.
- Owner tenant.
- File data or storage reference.

**Allowed scopes**

- TENANT

**Notes**

- Document must belong to authenticated tenant.
- Access must validate related entity ownership.

---

## POST /documents

Creates a new document.

Possible associations:

```
PROPERTY

CONTRACT

CONTACT

PERSON
```

Creates:

- Document metadata.
- File storage entry.
- Entity relationship.

**Allowed scopes**

- TENANT

**Required validations**

- Related entity exists.
- Related entity belongs to tenant.
- MIME type allowed.
- File size allowed.

---

## DELETE /documents/:id

Soft deletes a document.

Document metadata remains available for:

- Audit.
- Historical references.
- Recovery processes.

**Allowed scopes**

- TENANT

**Notes**

- Physical deletion depends on storage strategy.
- Hard delete forbidden by default.

---

# Document Types

Supported values:

```
CONTRACT

PERSONAL_DOCUMENTATION

PROPERTY_DOCUMENTATION

PHOTO

PLAN
```

Equivalent domain values:

```
CONTRATO

DOCUMENTACION_PERSONAL

DOCUMENTACION_INMUEBLE

FOTO

PLANO
```

---

# Document Entity Relationship

Documents can be attached to:

```
Property
 |
 +-- Documents


Contract
 |
 +-- Documents


Contact
 |
 +-- Documents
```

---

# Property Documents

Examples:

- Property photos.
- Property plans.
- Ownership documentation.
- Technical documentation.

---

# Contract Documents

Examples:

- Signed rental contract.
- Addendums.
- Legal agreements.
- Renewal documents.

---

# Contact Documents

Examples:

- Identity documents.
- Guarantees.
- Legal paperwork.

---

# Storage Rules

Initial implementation:

```
Filesystem
```

Future implementations:

```
S3

Azure Blob Storage

Google Cloud Storage
```

Services must not know storage implementation.

Required abstraction:

```
DocumentStorageService
```

Example:

```
upload()

download()

delete()
```

---

# Attachment Schema

Main fields:

```
idAttachment

idInmobiliaria

idInmueble

fileName

type

mimeType

dataUrl

createdAt
```

---

# Security Rules

Mandatory:

- Tenant isolation.
- Validate entity ownership.
- Validate permissions before download.
- Prevent access by guessing document IDs.
- Avoid exposing filesystem paths.

Forbidden:

```
GET /documents/:id
```

without tenant validation.

---

# File Validation

Validate:

- MIME type.
- File extension.
- Maximum size.
- Allowed document category.

Examples:

Allowed:

```
application/pdf

image/jpeg

image/png
```

Rejected:

```
executable files

unknown binaries
```

---

# Audit Rules

Audit required for:

- Upload.
- Delete.
- Replace.
- Access-sensitive documents.

Example:

```
Action:
UPLOAD_DOCUMENT

Entity:
CONTRACT

Document:
contract_2026.pdf
```

---

# Dashboard Usage

Documents are used by:

Tenant dashboard:

- Recent documents.
- Pending documentation.

Property detail:

- Property files.
- Contract files.
- Images.

---

# Filtering Rules

Every document query must include:

```
inmobiliariaId = currentUser.inmobiliariaId
```

Forbidden:

```
documentDAO.findAll()
```

Required:

```
documentDAO.findAllByTenant(currentTenant)
```

---

# Related Documentation

- `properties.md`
- `contracts.md`
- `contacts.md`
- `audit.md`
- `persistence.md`
- `api-guidelines.md`