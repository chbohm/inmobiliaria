# System Architecture

## Overview

This project is a commercial multi-tenant SaaS platform for real estate management.

The system is designed to support multiple independent real estate agencies (tenants) while guaranteeing complete data isolation.

The architecture prioritizes:

- Scalability
- Maintainability
- Security
- Testability
- Clear separation of responsibilities

The application consists of two independent domains:

- SYSTEM
- TENANT

These domains share infrastructure but never share business responsibilities.

---

# High-Level Architecture

```
                   +----------------------+
                   |      Frontend        |
                   |       Angular        |
                   +----------+-----------+
                              |
                              |
                         REST API
                              |
                              v
                   +----------------------+
                   |  Express Application |
                   +----------+-----------+
                              |
        +---------------------+---------------------+
        |                     |                     |
        v                     v                     v
+---------------+    +----------------+    +----------------+
| Controllers   | -> |    Services    | -> | Repositories   |
+---------------+    +----------------+    +----------------+
                                              |
                                              v
                                      +----------------+
                                      | Persistence    |
                                      +----------------+
```

---

# Architectural Principles

The project follows:

- Clean Architecture
- SOLID
- Separation of Concerns
- Repository / DAO Pattern
- Dependency Injection
- Basic Domain Driven Design

Business logic must remain independent from persistence.

Infrastructure must remain replaceable.

---

# System Domains

## SYSTEM Domain

Responsible for SaaS administration.

Capabilities include:

- Platform bootstrap
- Tenant management
- Subscription management
- System administrators
- Global settings
- Platform monitoring
- Global audit

SYSTEM users never execute tenant business operations.

---

## TENANT Domain

Responsible for the daily operation of a single real estate agency.

Capabilities include:

- Properties
- Owners
- Tenants
- Guarantors
- Contracts
- Payments
- Documents
- Tasks
- Internal users
- Roles
- Audit

Tenant data is completely isolated.

---

# Multi-Tenant Architecture

Every tenant owns an independent logical data space.

No business entity is shared between tenants.

Examples:

- Users
- Contacts
- Properties
- Contracts
- Payments
- Documents

A person with the same government ID may exist in multiple tenants as completely independent records.

Cross-tenant access is never allowed.

---

# Authentication Model

The application supports two authentication scopes.

## SYSTEM

Platform administrators.

JWT contains:

- userId
- role
- scope = SYSTEM

---

## TENANT

Agency users.

JWT contains:

- userId
- tenantId
- realEstateAgencyId
- role
- scope = TENANT

Authorization decisions always consider both role and scope.

---

# Layered Architecture

```
HTTP Request
      |
      v
Controllers
      |
      v
Services
      |
      v
Repositories / DAOs
      |
      v
Persistence
```

Each layer has a single responsibility.

Dependencies always point downward.

Business logic never depends on storage implementation.

---

# Backend Modules

The backend is organized by technical layers.

Typical structure:

```
src/

controllers/
services/
repositories/
daos/
validators/
middlewares/
security/
notifications/
utils/
config/
routes/
```

Each module should remain cohesive and focused.

---

# Frontend Architecture

The frontend is implemented using modern Angular.

The application is organized by:

- Core
- Shared
- Features

The UI uses:

- Standalone Components
- Angular Router
- Reactive Forms
- Signals where appropriate

Presentation and business concerns remain separated.

---

# Shared Contracts

Frontend and backend share a common contracts package.

Shared contracts include:

- DTOs
- Zod Schemas
- Request models
- Response models
- Domain types

Contracts must never be duplicated.

---

# Persistence Strategy

Persistence is abstracted behind repositories and DAO factories.

Current implementation:

- File System

Future implementations may include:

- PostgreSQL
- MongoDB
- Other storage providers

No business code should require modification when persistence changes.

---

# Security Model

Security is enforced at every layer.

Key principles:

- JWT authentication
- Refresh token rotation
- Password hashing
- Tenant isolation
- Input validation
- Authorization by scope
- Authorization by role

Security is implemented by design, not added later.

---

# Auditing

Important business operations generate audit events.

Typical audited actions:

- Create
- Update
- Delete
- Login
- Logout
- Permission changes
- Subscription changes

Audit records are immutable.

---

# Scalability

The architecture is designed to evolve without major refactoring.

Expected future improvements include:

- PostgreSQL persistence
- Object storage
- Background workers
- Scheduled jobs
- Event-driven processing
- Message queues
- Horizontal scaling
- Multiple API instances

These improvements should not require changes to business rules.

---

# Design Philosophy

When implementing new features:

- Preserve layer boundaries.
- Keep responsibilities explicit.
- Prefer composition over inheritance.
- Keep modules cohesive.
- Avoid hidden dependencies.
- Keep business logic independent of infrastructure.
- Design for long-term maintainability rather than short-term convenience.