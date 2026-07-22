# Backend Architecture

## Overview

The backend is implemented with:

- Node.js
- Express.js
- TypeScript

It exposes a REST API for both SYSTEM and TENANT domains.

The architecture is designed for long-term maintainability, strict separation of responsibilities, and future migration to different persistence technologies without affecting business logic.

---

# Design Principles

Always follow:

- Clean Architecture
- SOLID
- Separation of Concerns
- Repository / DAO Pattern
- Dependency Injection where appropriate
- Explicit over implicit
- Composition over inheritance

Business logic must never depend on infrastructure.

---

# Technology Stack

Core technologies:

- Node.js
- Express.js
- TypeScript
- Zod
- JWT
- bcrypt

Infrastructure:

- Environment variables
- Logging
- Middleware pipeline
- File-based persistence (initial implementation)

Future persistence:

- PostgreSQL
- Object Storage
- Message Queues
- Background Workers

---

# Project Structure

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
routes/
config/
utils/
app/
```

Each folder has a single responsibility.

---

# Request Lifecycle

```
HTTP Request
        │
        ▼
Routes
        │
        ▼
Middlewares
        │
        ▼
Controller
        │
        ▼
Request Validation (Zod)
        │
        ▼
Service
        │
        ▼
Repository / DAO
        │
        ▼
Persistence
        │
        ▼
Response
```

Business rules exist only inside Services.

---

# Layer Responsibilities

## Routes

Responsibilities:

- Register endpoints
- Configure middleware
- Delegate to controllers

Routes must never contain business logic.

---

## Controllers

Controllers are responsible only for HTTP concerns.

Responsibilities:

- Read request
- Validate input
- Invoke services
- Return HTTP responses

Controllers must never:

- Access persistence
- Implement business rules
- Perform authorization logic
- Read or write files

Controllers should remain thin.

---

## Services

Services contain business logic.

Typical responsibilities:

- Business validation
- Cross-entity operations
- Transactions
- Authorization decisions
- Domain orchestration

Services coordinate repositories but never know persistence details.

---

## Repositories

Repositories provide an abstraction over persistence.

Responsibilities:

- CRUD operations
- Query composition
- Persistence abstraction

Repositories never expose filesystem or database details.

---

## DAO Layer

DAOs contain storage-specific implementations.

Examples:

- FileSystemPropertyDAO
- PostgreSQLPropertyDAO

Only DAO implementations know how data is physically stored.

---

## Validators

All request validation uses Zod.

Validation occurs before entering business logic.

Never duplicate validation logic.

Schemas should be reusable.

---

## Middlewares

Examples:

- Authentication
- Authorization
- Logging
- Error handling
- Request ID
- CORS
- Rate limiting

Each middleware should have a single responsibility.

---

## Security

Contains:

- JWT
- Password hashing
- Token generation
- Refresh token rotation
- Authorization helpers

Security code should remain isolated from business logic.

---

## Notifications

Responsible for:

- Email
- Future SMS
- Future Push Notifications

Business logic requests notifications through services.

Notification providers remain replaceable.

---

## Utilities

Contains reusable helpers only.

Never place business rules inside utilities.

---

# Dependency Rules

Allowed dependencies:

```
Routes
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
DAOs
    ↓
Persistence
```

Forbidden dependencies:

Controllers → DAOs

Controllers → Filesystem

Controllers → Database

Services → Filesystem

Services → Database

Repositories → Controllers

DAOs → Services

Never bypass layers.

---

# Domain Separation

The backend supports two independent domains.

## SYSTEM

Responsible for:

- Platform bootstrap
- Tenant management
- Subscriptions
- System administrators
- Global configuration
- Global audit

---

## TENANT

Responsible for:

- Properties
- Contacts
- Owners
- Tenants
- Guarantors
- Contracts
- Payments
- Documents
- Tasks
- Audit

Business entities never cross tenant boundaries.

---

# Authentication

Authentication uses:

- Email / Password
- JWT Access Tokens
- Refresh Tokens
- bcrypt

Refresh tokens:

- Stored hashed
- Rotated after use
- Revocable
- Expirable

Never store refresh tokens in plain text.

---

# Authorization

Authorization depends on:

- Scope
- Role
- Tenant

Scopes:

- SYSTEM
- TENANT

Both scope and role must be validated.

Never authorize only by role.

---

# Validation

Every external request must be validated.

Validation order:

```
HTTP Request

↓

Zod Validation

↓

Business Validation

↓

Persistence
```

Never trust client input.

---

# Error Handling

Controllers should return standardized responses.

Example:

```json
{
  "success": false,
  "message": "Property not found.",
  "code": "PROPERTY_NOT_FOUND"
}
```

Never expose:

- Stack traces
- SQL errors
- Filesystem paths
- Internal implementation details

---

# Logging

Log important events.

Examples:

- Authentication
- Authorization failures
- Business operations
- Unexpected errors

Never log:

- Passwords
- JWTs
- Refresh tokens
- Secrets

Sensitive information must be masked.

---

# Configuration

Configuration must come from environment variables.

Never hardcode:

- Secrets
- API keys
- Passwords
- URLs
- Tokens

Configuration belongs inside the config module.

---

# API Versioning

REST endpoints are versioned.

Current prefix:

```
/api/v1
```

Future versions must coexist without breaking existing clients.

---

# Business Rules

Business rules belong only inside Services.

Repositories must not contain business logic.

Controllers must not contain business logic.

Utilities must not contain business logic.

---

# Persistence Independence

The backend is persistence-agnostic.

Business code must not know whether data comes from:

- File System
- PostgreSQL
- MongoDB
- Any future implementation

Changing persistence should require replacing DAOs only.

---

# Testing

The architecture should support:

- Unit tests
- Integration tests
- Repository tests
- API tests

Business logic should be testable without HTTP or persistence.

---

# Code Generation Guidelines

When generating backend code:

Prefer:

- Small services
- Thin controllers
- Focused repositories
- Explicit names
- Reusable validators
- Dependency inversion

Avoid:

- God services
- Large controllers
- Duplicate logic
- Static global state
- Hidden side effects
- Cross-layer dependencies

Every new feature should naturally fit into the existing architecture without requiring structural changes.