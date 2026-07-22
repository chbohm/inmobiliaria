# System API

## Purpose

Manage global SaaS platform administration.

System endpoints operate outside tenant boundaries and are only available to platform administrators.

Main responsibilities:

- Initial platform bootstrap.
- Tenant lifecycle management.
- Subscription management.
- System user management.
- Global dashboard.
- Global audit access.

---

# Authorization

All endpoints in this document require:

```
scope = SYSTEM
```

The user must have a system administrator role.

Tenant users must never access these endpoints.

---

# Bootstrap

## POST /system/bootstrap

Initialize the platform for the first time.

Creates:

- Initial system roles.
- First system administrator.
- First tenant.
- Initial subscription.
- First real estate agency.
- Initial tenant administrator.
- Required filesystem structure.

**Allowed scopes**

- Public (only before platform initialization)

**Notes**

- Operation must be idempotent.
- Must fail if the platform was already initialized.
- Must never require manual folder creation.
- Creates both system and tenant storage areas.

---

# System Dashboard

## GET /system/dashboard

Returns global SaaS platform metrics.

Includes:

- Total tenants.
- Active tenants.
- Suspended tenants.
- Subscription summary.
- Recent platform activity.
- Recent registrations.

**Allowed scopes**

- SYSTEM

---

# Tenant Management

## GET /system/tenants

Returns all registered tenants.

Supports:

- Pagination.
- Search.
- Filtering by status.
- Sorting.

**Allowed scopes**

- SYSTEM

---

## GET /system/tenants/:id

Returns complete tenant information.

Includes:

- Tenant information.
- Real estate agency data.
- Subscription information.
- Current status.
- Creation dates.

**Allowed scopes**

- SYSTEM

---

## POST /system/tenants

Creates a new tenant.

Creates:

- Tenant record.
- Real estate agency.
- Tenant storage area.
- Initial configuration.

**Allowed scopes**

- SYSTEM

**Notes**

- Tenant data must be isolated.
- No business data is shared between tenants.

---

## PUT /system/tenants/:id

Updates tenant information.

Possible updates:

- Tenant metadata.
- Status.
- Configuration references.

**Allowed scopes**

- SYSTEM

---

## POST /system/tenants/:id/activate

Activates a suspended tenant.

After activation:

- Tenant users can authenticate.
- Tenant operations become available.

**Allowed scopes**

- SYSTEM

---

## POST /system/tenants/:id/suspend

Suspends a tenant.

After suspension:

- Tenant users cannot access the platform.
- Existing data remains preserved.

**Allowed scopes**

- SYSTEM

---

# Subscription Management

## GET /system/subscriptions

Returns all tenant subscriptions.

Supports:

- Filtering.
- Pagination.
- Status queries.

**Allowed scopes**

- SYSTEM

---

## GET /system/subscriptions/:id

Returns subscription details.

Includes:

- Tenant reference.
- Plan.
- Status.
- Limits.
- Dates.

**Allowed scopes**

- SYSTEM

---

## POST /system/subscriptions

Creates a subscription.

Used when assigning a plan to a tenant.

**Allowed scopes**

- SYSTEM

---

## PUT /system/subscriptions/:id

Updates subscription information.

Possible updates:

- Plan.
- Status.
- Limits.
- Expiration dates.

**Allowed scopes**

- SYSTEM

---

# System User Management

## GET /system/users

Returns all platform administrators.

**Allowed scopes**

- SYSTEM

---

## GET /system/users/:id

Returns one system administrator.

Includes:

- Profile.
- Role.
- Status.
- Last login.

**Allowed scopes**

- SYSTEM

---

## POST /system/users

Creates a new system administrator.

Creates:

- User.
- Assigned system role.
- Authentication credentials.

**Allowed scopes**

- SYSTEM

---

## PUT /system/users/:id

Updates a system administrator.

Possible updates:

- Profile information.
- Role.
- Active status.

**Allowed scopes**

- SYSTEM

---

## DELETE /system/users/:id

Soft deletes a system administrator.

The historical record remains available.

**Allowed scopes**

- SYSTEM

---

# System Audit

## GET /system/audit

Returns global platform audit records.

Tracks:

- Tenant changes.
- Subscription changes.
- System user actions.
- Administrative operations.

**Allowed scopes**

- SYSTEM

---

# Multi-Tenant Rules

System services are the only services allowed to operate across tenants.

Restrictions:

- System DAOs may access `data/system`.
- Tenant folders can only be accessed for explicit administrative operations.
- System operations must never expose tenant business data unnecessarily.
- Tenant isolation rules still apply.

---

# Related Documentation

- `../architecture.md`
- `../security.md`
- `../persistence.md`
- `../api-guidelines.md`