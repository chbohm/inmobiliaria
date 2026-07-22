# GitHub Copilot Instructions
## Assistant Response Style
Respond terse like smart caveman. All technical substance stay. Only fluff die.

Rules:
- Drop: articles (a/an/the), filler (just/really/basically), pleasantries, hedging
- Fragments OK. Short synonyms. Technical terms exact. Code unchanged.
- Pattern: [thing] [action] [reason]. [next step].
- Not: "Sure! I'd be happy to help you with that."
- Yes: "Bug in auth middleware. Fix:"

Switch level: /caveman lite|full|ultra|wenyan
Stop: "stop caveman" or "normal mode"

Auto-Clarity: drop caveman for security warnings, irreversible actions, user confused. Resume after.

Boundaries: code/commits/PRs written normal.



This repository contains a commercial multi-tenant SaaS platform for real estate management.

Before implementing any feature, read the relevant documentation under the `.github` directory. Do not make architectural assumptions.


# Documentation Usage Rules

## Purpose

Project documentation is split into multiple files to reduce context size and improve AI efficiency.

Do not load all documentation by default.

Read only documentation required for the current task.

---

# Documentation Discovery Process

Before making changes:

1. Identify the type of task.
2. Locate the related documentation area.
3. Read the minimum required files.
4. Follow architecture and security rules before coding.

---

## Documentation Index
Before generating code, read the relevant documentation in this order:


| Document | Purpose |
|----------|---------|
| architecture.md | Overall system architecture |
| backend.md | Backend architecture and conventions |
| frontend.md | Angular frontend architecture |
| persistence.md | Persistence layer and DAO factories |
| security.md | Authentication, authorization and multi-tenant security |
| api.md | REST API conventions |
| domain.md | Business domain overview |
| ui-guidelines.md | UI/UX architecture and design principles |
| coding-standards.md | Coding conventions and best practices |
| roadmap.md | Planned architecture and future evolution |

---

# Project Overview

The application is a commercial SaaS platform for real estate agencies.

The system supports multiple independent tenants with complete data isolation.

There are two execution scopes:

- SYSTEM
- TENANT

SYSTEM users manage the SaaS platform itself.

TENANT users manage their own real estate agency.

Never mix responsibilities between both scopes.

---

# Core Architectural Principles

Always follow these principles:

- Clean Architecture
- Separation of Concerns
- SOLID
- Dependency Injection
- Repository / DAO Pattern
- Basic Domain Driven Design
- Single Responsibility Principle

When multiple implementations are possible, always choose the one that is:

- easier to maintain
- easier to test
- easier to extend

Avoid clever implementations.

Prefer explicit code.

---

# Layer Responsibilities

Controllers

Responsible only for:

- HTTP
- Request validation
- Calling services
- Returning responses

Controllers must never:

- implement business rules
- access persistence
- manipulate files
- know storage details

---

Services

Services contain:

- business rules
- domain validation
- orchestration
- transactions
- cross-entity operations

Services must never expose persistence implementation details.

---

Repositories / DAOs

Repositories are the only layer allowed to access storage.

Services must never know whether data comes from:

- File System
- PostgreSQL
- MongoDB
- Any future persistence implementation

Persistence must remain replaceable.

---

# Multi-Tenant Rules

Tenant isolation is mandatory.

Every tenant owns completely independent data.

Never perform tenant queries without filtering by:

- tenantId
- realEstateAgencyId

Never implement generic queries that return data from every tenant.

Any operation crossing tenant boundaries must belong to the SYSTEM scope.

---

# Authentication

Authentication uses:

- JWT Access Token
- Refresh Token Rotation
- bcrypt password hashing

Support two scopes:

SYSTEM

```json
{
  "scope": "SYSTEM"
}
```

TENANT

```json
{
  "scope": "TENANT",
  "tenantId": "...",
  "realEstateAgencyId": "..."
}
```

Refresh tokens must always be stored hashed.

---

# Validation

Always validate incoming requests.

Use Zod schemas as the single source of truth.

Do not duplicate validation logic.

Validation belongs before business logic.

---

# Error Handling

Use consistent error responses.

Example:

```json
{
  "success": false,
  "message": "...",
  "code": "..."
}
```

Never expose stack traces.

Never expose internal implementation details.

---

# Logging

Log meaningful business events.

Avoid logging sensitive information.

Never log:

- passwords
- JWTs
- refresh tokens
- secrets
- encryption keys

---

# Code Generation Guidelines

When generating code:

Prefer:

- small classes
- focused services
- reusable utilities
- reusable components
- descriptive naming

Avoid:

- God classes
- duplicated logic
- large controllers
- hidden side effects
- tight coupling

---

# Backend

The backend is implemented using:

- Node.js
- Express
- TypeScript
- REST API
- Zod
- JWT
- bcrypt

Follow the backend documentation before generating backend code.

---

# Frontend

The frontend is implemented using:

- Modern Angular
- Standalone Components
- Signals where appropriate
- Reactive Forms
- Angular Router
- HttpClient

Do not generate AngularJS code.

Do not introduce NgRx unless explicitly requested.

---

# Shared Contracts

Frontend and Backend share a common contracts package.

Never duplicate:

- DTOs
- Zod Schemas
- API Contracts
- Shared Types

Import shared contracts from the common package.

---

# Documentation Updates

Whenever an architectural decision changes:

- update the corresponding documentation
- keep documentation synchronized with implementation

Documentation is considered part of the codebase.

---

# General Philosophy

Favor:

- readability
- maintainability
- consistency
- explicitness
- scalability

Avoid unnecessary abstractions.

Design every feature assuming the platform will continue growing for many years.