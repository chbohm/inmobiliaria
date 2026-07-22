# Tasks API

## Purpose

Manage operational tasks inside a real estate organization.

Tasks help users organize daily work:

- Property visits.
- Contract renewals.
- Maintenance actions.
- Client follow-ups.
- Administrative activities.

Tasks belong to a tenant and may optionally relate to business entities.

---

# Authorization

All endpoints require:

```
scope = TENANT
```

Allowed roles:

- Tenant administrator.
- Managers.
- Users with task management permissions.

---

# Task Management

## GET /tasks

Returns tasks belonging to the authenticated tenant.

Supports:

- Pagination.
- Search.
- Filtering.
- Sorting.

Possible filters:

- Status.
- Assigned user.
- Due date.
- Related entity.
- Creation date.

Examples:

```
status=PENDING

assignedTo=userId

dueDate=2026-07-22
```

**Allowed scopes**

- TENANT

**Notes**

- Only tasks from current tenant are returned.
- Deleted tasks excluded by default.
- Must support dashboard widgets.

---

## GET /tasks/:id

Returns complete task information.

Includes:

- Title.
- Description.
- Status.
- Assigned user.
- Due date.
- Related entity.
- Creation data.
- Update history if available.

**Allowed scopes**

- TENANT

**Notes**

- Task must belong to authenticated tenant.
- Related entities must be validated.

---

## POST /tasks

Creates a new task.

Creates:

- Task record.
- Tenant relationship.
- Optional assignment.
- Optional entity relationship.

**Allowed scopes**

- TENANT

**Required validations**

- Title required.
- Tenant context required.
- Assigned user must belong to same tenant.
- Related entity must belong to same tenant.

---

## PUT /tasks/:id

Updates task information.

Possible updates:

- Title.
- Description.
- Status.
- Assigned user.
- Due date.
- Related entity.

**Allowed scopes**

- TENANT

**Notes**

- Changes must be audited when relevant.
- Assignment changes should be traceable.

---

## DELETE /tasks/:id

Soft deletes a task.

Task remains available for:

- Audit.
- Historical reporting.
- User activity tracking.

**Allowed scopes**

- TENANT

**Notes**

- Hard delete forbidden.
- Completed task history should remain.

---

# Task Status

Supported values:

```
PENDING

IN_PROGRESS

COMPLETED

CANCELLED
```

Equivalent domain values:

```
PENDIENTE

EN_PROGRESO

COMPLETADA

CANCELADA
```

---

# Task Data

Main fields:

```
idTarea

idInmobiliaria

titulo

descripcion

estado

assignedTo

dueDate

relatedEntity

createdAt

updatedAt

deletedAt
```

---

# Task Assignment

Tasks can be assigned to tenant users.

Relationship:

```
User
 |
 +-- Tasks[]
```

Rules:

- Assigned user must belong to same tenant.
- Deleted users cannot receive new tasks.

---

# Related Entities

Tasks may reference:

```
PROPERTY

CONTRACT

PAYMENT

CONTACT

DOCUMENT
```

Example:

```
Task:

"Renew rental contract"

relatedEntity:

{
 entity: "CONTRACT",
 entityId: "uuid"
}
```

---

# Dashboard Usage

Tasks feed:

Tenant dashboard:

- Pending tasks.
- Overdue tasks.
- Assigned tasks.
- Upcoming activities.

Example widgets:

```
Pending tasks: 12

Due today: 4

Overdue: 3
```

---

# Filtering Rules

Every task query must include:

```
inmobiliariaId = currentUser.inmobiliariaId
```

Forbidden:

```
taskDAO.findAll()
```

Required:

```
taskDAO.findAllByTenant(currentTenant)
```

---

# Audit Rules

Audit required for:

- Task creation.
- Assignment changes.
- Status changes.
- Task deletion.

Example:

```
Action:
CHANGE_TASK_STATUS

Before:
PENDING

After:
COMPLETED
```

---

# Security Rules

Mandatory:

- Tenant isolation.
- Validate assigned users.
- Validate related entities.
- Protect tenant operational information.

Forbidden:

```
createTask()
```

without tenant context.

---

# Related Documentation

- `contacts.md`
- `properties.md`
- `contracts.md`
- `audit.md`
- `api-guidelines.md`