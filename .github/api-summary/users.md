# Users API

## Purpose

Manage application users.

The platform has two types of users:

- System users: platform administrators.
- Tenant users: employees or operators belonging to a real estate agency.

This document describes tenant user management.

System users are managed through:

```
system.md
```

---

# Authorization

All endpoints require:

```
scope = TENANT
```

Allowed users depend on assigned permissions.

Typical allowed roles:

- Tenant administrator.
- Manager roles with user management permissions.

Regular tenant users should not manage other users unless explicitly authorized.

---

# Tenant Users

## GET /users

Returns all users belonging to the authenticated tenant.

Supports:

- Pagination.
- Search.
- Filtering.
- Sorting.

Possible filters:

- Name.
- Email.
- Role.
- Active status.

**Allowed scopes**

- TENANT

**Notes**

- Results must only contain users from the current tenant.
- Must never return users from another tenant.
- Password hashes must never be exposed.

---

## GET /users/:id

Returns detailed information about one tenant user.

Includes:

- User profile.
- Assigned role.
- Permissions.
- Account status.
- Last login information.

**Allowed scopes**

- TENANT

**Notes**

- The user must belong to the authenticated tenant.
- Sensitive authentication data must not be returned.

---

## POST /users

Creates a new tenant user.

Creates:

- User profile.
- Password hash.
- Role assignment.
- Tenant relationship.

**Allowed scopes**

- TENANT

**Notes**

- The new user automatically belongs to the authenticated tenant.
- Passwords must be hashed using bcrypt.
- Role must belong to the same tenant.
- Email uniqueness must be validated inside the tenant scope.

---

## PUT /users/:id

Updates an existing tenant user.

Possible updates:

- Name.
- Email.
- Role.
- Active status.
- Profile information.

**Allowed scopes**

- TENANT

**Notes**

- User cannot be moved between tenants.
- Role changes must respect permission rules.
- Password changes should use dedicated authentication flows.

---

## DELETE /users/:id

Soft deletes a tenant user.

The user record remains available for:

- Audit history.
- Historical references.
- Previous actions.

**Allowed scopes**

- TENANT

**Notes**

- Deleted users cannot authenticate.
- Historical audit records must remain valid.

---

# User Security Rules

- Passwords are always stored as hashes.
- Password hashes are never returned by APIs.
- Authentication state is controlled by sessions.
- User deletion is soft delete.
- User actions must be auditable.

---

# Tenant Isolation Rules

Every operation must enforce:

```
currentUser.inmobiliariaId
```

Examples:

Allowed:

```
find user where:
id = requestedId
AND inmobiliariaId = currentTenant
```

Forbidden:

```
find user by id only
```

A tenant user must never access another tenant's users.

---

# Related Documentation

- `roles.md`
- `auth.md`
- `security.md`
- `persistence.md`
- `api-guidelines.md`