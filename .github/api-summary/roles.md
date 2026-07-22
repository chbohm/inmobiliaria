# Roles API

## Purpose

Manage authorization roles and permissions.

Roles define what actions users can perform inside the application.

The platform supports two role scopes:

- SYSTEM roles: platform administrators.
- TENANT roles: users inside a real estate agency.

This document describes tenant role management.

System roles are managed internally during platform administration.

---

# Authorization

All endpoints require:

```
scope = TENANT
```

Allowed users depend on permissions.

Typical allowed roles:

- Tenant administrator.
- Users with role management permissions.

Regular users should not create or modify roles unless explicitly authorized.

---

# Tenant Roles

## GET /roles

Returns all roles available inside the authenticated tenant.

Includes:

- Role identifier.
- Description.
- Permissions.

Supports:

- Pagination.
- Search.
- Filtering.

**Allowed scopes**

- TENANT

**Notes**

- Only roles belonging to the current tenant are returned.
- Must never return roles from another tenant.
- System roles must not be exposed.

---

## GET /roles/:id

Returns details of one tenant role.

Includes:

- Role information.
- Assigned permissions.
- Usage information if available.

**Allowed scopes**

- TENANT

**Notes**

- Role must belong to the authenticated tenant.
- Must validate tenant ownership before returning data.

---

## POST /roles

Creates a new tenant role.

Creates:

- Role definition.
- Permission list.

**Allowed scopes**

- TENANT

**Notes**

- Role belongs automatically to the authenticated tenant.
- Permissions must be valid application permissions.
- Creating system-level permissions is forbidden.

---

## PUT /roles/:id

Updates an existing tenant role.

Possible updates:

- Description.
- Assigned permissions.

**Allowed scopes**

- TENANT

**Notes**

- Role ownership cannot change.
- Existing users assigned to the role must remain valid.
- Changes should be audited.

---

## DELETE /roles/:id

Soft deletes a tenant role.

The role remains available for historical references.

**Allowed scopes**

- TENANT

**Notes**

- A role assigned to active users should not be deleted without validation.
- Deletion must not break audit records.
- Alternative approach: deactivate role.

---

# Permission Rules

Permissions are represented as strings.

Example:

```
properties.read
properties.create
properties.update
properties.delete

contracts.read
contracts.create
contracts.update

payments.read
payments.update

users.manage
roles.manage
```

---

# Authorization Flow

Request:

```
JWT
 |
 v
Current User
 |
 v
Assigned Role
 |
 v
Permissions
 |
 v
Endpoint Authorization
```

Controllers must not implement permission logic directly.

Permission checks should happen through:

- Middleware.
- Authorization services.
- Security layer.

---

# Tenant Isolation Rules

Tenant roles are isolated.

Every operation must enforce:

```
currentUser.inmobiliariaId
```

Forbidden:

```
find role by id only
```

Required:

```
find role by id
AND inmobiliariaId = currentTenant
```

---

# Security Rules

- Users cannot escalate their own permissions.
- System permissions cannot be created by tenants.
- Role modifications must be audited.
- Deleted roles must preserve historical information.

---

# Related Documentation

- `users.md`
- `auth.md`
- `security.md`
- `architecture.md`
- `api-guidelines.md`