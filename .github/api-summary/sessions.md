# Sessions API

## Purpose

Manage authenticated user sessions.

Sessions store refresh token lifecycle and allow:

- Secure authentication renewal.
- Logout.
- Logout from all devices.
- Session invalidation.
- Security monitoring.

Sessions exist in two isolated domains:

1. Tenant sessions.
2. System sessions.

---

# Session Scopes

## TENANT Sessions

Belong to:

```
scope = TENANT
```

Stored in:

```
data/inmobiliaria_<id>/sesiones.json
```

Required field:

```
inmobiliariaId
```

---

## SYSTEM Sessions

Belong to:

```
scope = SYSTEM
```

Stored in:

```
data/system/sesiones_sistema.json
```

Must not contain:

```
inmobiliariaId
```

---

# Authorization

Session management requires authentication except:

- Login.
- Refresh token exchange.

---

# Session Lifecycle

Typical flow:

```
LOGIN
 |
 +--> CREATE SESSION
 |
 +--> ACCESS TOKEN
 |
 +--> REFRESH TOKEN
 |
 +--> ROTATE SESSION
 |
 +--> LOGOUT
 |
 +--> REVOKED
```

---

# Session Data

Schema:

```typescript
{
 id,
 scope,
 userId,
 inmobiliariaId?,
 refreshTokenHash,
 createdAt,
 expiresAt,
 revokedAt?
}
```

---

# Authentication Endpoints

## POST /auth/login

Creates a new session.

Flow:

1. Validate credentials.
2. Generate access token.
3. Generate refresh token.
4. Hash refresh token.
5. Persist session.
6. Return tokens.

**Allowed scopes**

Public endpoint.

---

## POST /auth/refresh

Creates a new access token using refresh token.

Flow:

1. Receive refresh token.
2. Hash received token.
3. Find matching session.
4. Validate expiration.
5. Validate not revoked.
6. Rotate refresh token.
7. Return new tokens.

**Allowed scopes**

Public endpoint with valid refresh token.

---

## POST /auth/logout

Revokes current session.

Flow:

1. Identify current session.
2. Set:

```
revokedAt = currentDate
```

3. Invalidate refresh token.

**Allowed scopes**

- TENANT
- SYSTEM

---

## POST /auth/logout-all

Revokes all sessions for current user.

Examples:

User logged in:

```
Chrome
Mobile
Tablet
```

After logout-all:

```
All sessions revoked
```

**Allowed scopes**

- TENANT
- SYSTEM

---

# Session Rules

## Refresh Token Storage

Never store:

```
plain refresh token
```

Required:

```
hash(refreshToken)
```

Stored:

```
refreshTokenHash
```

---

## Token Rotation

Every refresh operation should:

1. Invalidate old refresh token.
2. Generate new refresh token.
3. Store new hash.
4. Return new token pair.

Prevents token replay attacks.

---

# Expiration Rules

Access token:

Short lifetime.

Example:

```
15 minutes
```

Refresh token:

Longer lifetime.

Example:

```
30 days
```

Values must come from configuration.

---

# Tenant Isolation

Tenant session validation must verify:

```
session.inmobiliariaId
==
currentUser.inmobiliariaId
```

Forbidden:

```
use session from another tenant
```

---

# System Session Rules

System users:

```
scope = SYSTEM
```

must only access:

```
data/system/
```

unless performing authorized global administration.

---

# Security Events

Audit:

- Login success.
- Login failure.
- Refresh success.
- Refresh failure.
- Logout.
- Logout all.
- Session revoked.

---

# Session Service

Session logic must be centralized.

Recommended:

```
SessionService
```

Responsibilities:

```
createSession()

validateSession()

refreshSession()

revokeSession()

revokeAllSessions()
```

---

# DAO Rules

Persistence must use DAO layer.

Example:

```
TenantSessionDAO

create()

findByTokenHash()

revoke()

revokeAllByUser()
```

System:

```
SystemSessionDAO
```

---

# Forbidden Practices

Do not:

```
store refresh tokens in plain text
```

Do not:

```
modify sessions directly from controllers
```

Do not:

```
query tenant sessions without tenant context
```

---

# Related Documentation

- `auth.md`
- `users.md`
- `roles.md`
- `audit.md`
- `security.md`
- `persistence.md`