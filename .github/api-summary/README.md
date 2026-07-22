# API Summary

## Purpose

This directory provides a high-level reference for every REST API endpoint exposed by the application.

The goal is to help developers and AI coding assistants quickly understand the available resources without reading the entire backend implementation.

Each document focuses on a single business domain and contains:

- The purpose of the resource.
- Available endpoints.
- A short description of each endpoint.
- Required authorization scope.
- Important notes specific to that resource.

Detailed implementation rules, request/response formats, validation, pagination, filtering, authentication flow, and error handling are intentionally **not** documented here.

Those topics are covered in:

- `../api-guidelines.md`

---

# Documents

| Document | Purpose |
|----------|---------|
| auth.md | Authentication, sessions and password recovery |
| system.md | Global SaaS administration |
| dashboard.md | System and tenant dashboards |
| users.md | Tenant user management |
| roles.md | Tenant role management |
| contacts.md | Contacts, owners, tenants and guarantors |
| properties.md | Property management |
| contracts.md | Rental contract management |
| payments.md | Payment management |
| tasks.md | Task management |
| documents.md | Document and attachment management |
| audit.md | Audit logs |

---

# Authentication Scopes

## Public

Endpoint can be called without authentication.

---

## SYSTEM

Accessible only by authenticated system administrators.

These endpoints manage the SaaS platform itself, including tenants, subscriptions and global configuration.

---

## TENANT

Accessible only by authenticated users belonging to a tenant (real estate agency).

Every request is automatically restricted to the authenticated tenant.

---

# Conventions

Unless otherwise documented, business resources follow the standard REST pattern.

```
GET    /resource
GET    /resource/:id
POST   /resource
PUT    /resource/:id
DELETE /resource/:id
```

Business entities use **soft delete** unless explicitly documented otherwise.

---

# Multi-Tenant Rules

All tenant endpoints automatically operate within the authenticated tenant.

Services must never receive a tenant identifier from the client to determine data ownership.

The tenant context is always resolved from the authenticated session.

---

# Related Documentation

For implementation details, read:

- `../architecture.md`
- `../backend.md`
- `../security.md`
- `../persistence.md`
- `../api-guidelines.md`