# Authentication API

## Purpose

Manage user authentication, session lifecycle, token refresh, logout, password recovery, and retrieval of the authenticated user's profile.

Authentication supports two independent scopes:

- **SYSTEM**: SaaS platform administrators.
- **TENANT**: Users belonging to a real estate agency.

JWT access tokens are short-lived.

Refresh tokens are securely hashed before being persisted and are rotated after every successful refresh.

---

# Authentication Flow

```
Login
    ↓
Access Token + Refresh Token
    ↓
Authenticated Requests
    ↓
Access Token Expires
    ↓
Refresh Token
    ↓
New Access Token + New Refresh Token
```

---

# Endpoints

## POST /auth/login

Authenticate a user using email and password.

For tenant users, the tenant identifier must also be provided.

Returns:

- Access Token
- Refresh Token
- Token expiration information

**Allowed scopes**

- Public

**Notes**

- Passwords must be verified using bcrypt.
- Refresh token rotation is enabled.
- Every successful login creates a new session.

---

## POST /auth/refresh

Generate a new Access Token using a valid Refresh Token.

Returns:

- New Access Token
- New Refresh Token

**Allowed scopes**

- Authenticated Session

**Notes**

- Refresh tokens are single-use.
- Previous refresh token is immediately revoked.
- The new refresh token must replace the old one.
- Expired or revoked refresh tokens must be rejected.

---

## POST /auth/logout

Terminate the current authenticated session.

The current refresh token is revoked.

**Allowed scopes**

- SYSTEM
- TENANT

**Notes**

- Only the current session is affected.
- Other active sessions remain valid.

---

## POST /auth/logout-all

Terminate every active session belonging to the authenticated user.

Revokes every refresh token associated with the user.

**Allowed scopes**

- SYSTEM
- TENANT

**Notes**

- Useful after password changes or suspected account compromise.
- All devices will require authentication again.

---

## POST /auth/request-password-reset

Start the password recovery process.

Creates a PasswordReset record and sends a recovery email.

**Allowed scopes**

- Public

**Notes**

- The recovery token must never be stored in plain text.
- Only the token hash is persisted.
- Recovery tokens expire after 48 hours.
- Multiple recovery requests may invalidate previous tokens.

---

## POST /auth/reset-password

Reset the user's password using a valid recovery token.

Updates the stored password hash.

**Allowed scopes**

- Public

**Notes**

- Recovery token must be valid.
- Recovery token must not be expired.
- Recovery token must not have been used previously.
- Token becomes invalid immediately after use.
- Existing active sessions should be revoked after a successful password reset.

---

## GET /auth/me

Return information about the currently authenticated user.

Returns:

- User profile
- User role
- Authentication scope
- Tenant information (if applicable)
- Granted permissions

**Allowed scopes**

- SYSTEM
- TENANT

**Notes**

- Used during application startup.
- Used to determine which dashboard to display.
- Should never expose password hashes or sensitive authentication data.

---

# Session Management

Authentication creates persistent sessions.

Each session stores:

- User
- Scope
- Tenant (when applicable)
- Refresh token hash
- Creation date
- Expiration date
- Revocation date

Tenant sessions are stored inside the tenant directory.

System administrator sessions are stored in the global system directory.

---

# Security Rules

- Passwords must always be hashed using bcrypt.
- Refresh tokens must never be stored in plain text.
- JWT access tokens should be short-lived.
- Refresh tokens must be rotated.
- Revoked tokens must never be accepted.
- Password reset tokens must be hashed before persistence.
- Authentication responses must never expose sensitive internal information.
- Authentication failures should return generic error messages.

---

# Related Documentation

- `../security.md`
- `../backend.md`
- `../api-guidelines.md`
- `../architecture.md`