# Dashboard API

## Purpose

Provide aggregated information for the main application dashboards.

Dashboards are different depending on authentication scope:

- SYSTEM dashboard: global SaaS platform view.
- TENANT dashboard: real estate agency operational view.

Dashboard endpoints are read-only.

---

# Authorization

## SYSTEM Dashboard

Requires:

```
scope = SYSTEM
```

Accessible only by system administrators.

---

## TENANT Dashboard

Requires:

```
scope = TENANT
```

Data is automatically restricted to the authenticated tenant.

---

# System Dashboard

## GET /system/dashboard

Returns global SaaS platform metrics.

Used by the system administration interface.

Includes:

- Total tenants.
- Active tenants.
- Suspended tenants.
- Subscription statistics.
- Recent tenant registrations.
- Recent system activity.

**Allowed scopes**

- SYSTEM

**Notes**

- Must never expose tenant business information.
- Only returns platform-level aggregated information.

---

# Tenant Dashboard

## GET /dashboard/summary

Returns the main operational summary of a real estate agency.

Includes:

- Total properties.
- Available properties.
- Rented properties.
- Active contracts.
- Pending payments.
- Late payments.
- Pending tasks.
- Revenue summary.

**Allowed scopes**

- TENANT

**Notes**

- All calculations must be limited to the authenticated tenant.
- Must not access information from other tenants.

---

## GET /dashboard/upcoming-expirations

Returns upcoming important expiration events.

Examples:

- Contracts close to expiration.
- Scheduled payment dates.
- Important tasks.

Supports:

- Date range filtering.
- Configurable warning periods.

**Allowed scopes**

- TENANT

**Notes**

- Uses tenant configuration:
  - `diasAvisoVencimientoContrato`
- Results should prioritize actionable information.

---

## GET /dashboard/late-payments

Returns payments that are overdue.

Includes:

- Property.
- Contract.
- Tenant responsible.
- Original amount.
- Delay amount.
- Days overdue.
- Current status.

**Allowed scopes**

- TENANT

**Notes**

- Only returns payments belonging to the authenticated tenant.
- Used for financial monitoring.

---

# Dashboard Design Rules

Dashboards should provide:

- Aggregated information.
- Fast access to frequent operations.
- Alerts requiring attention.
- Operational visibility.

Dashboards should not:

- Modify business data directly.
- Replace detail views.
- Contain complex business logic.

Business calculations must live in services, not controllers.

---

# Related Documentation

- `../architecture.md`
- `../backend.md`
- `../domain.md`
- `../api-guidelines.md`