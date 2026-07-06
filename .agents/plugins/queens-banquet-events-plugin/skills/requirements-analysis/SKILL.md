---
name: requirements-analysis
description: "Guidelines for conducting code analysis, schema validation, and technical planning for the Queen's Banquet codebase. Used by requirements-analyst to generate comprehensive technical specs in markdown format."
---

# Requirements Analysis

Guides the analysis of Queen's Banquet features, files, database constraints, and REST API structures.

## Instructions

### 1. Codebase Exploration
- **Frontend Check**:
  - Examine `frontend/src/services/api.js` to understand available network request routes.
  - Scan `frontend/src/pages/` or `frontend/src/components/` to find relevant component files.
  - Review how the UI handles layout, states, and hooks.
- **Backend Check**:
  - Review PHP routing and controllers under `backend/`.
  - Map incoming request arguments and database query statements.
- **Database Check**:
  - Review PostgreSQL tables, indexes, and primary/foreign key relations in `database/queens_banquet.sql` and `database/invitation_system.sql`.
  - Design migration SQL scripts if new tables or columns are required.

### 2. Formulating the Specification Plan
Draft the output plan `_workspace/02_requirements_analyst_plan.md` using the following template:

```markdown
# Implementation Spec: [Feature Title]

## Database Changes
- Table modifications, SQL DDL statements to run.

## Backend Changes
- Specific files to modify: controllers, routes, models.
- Required endpoint paths, request bodies, and JSON responses.

## Frontend Changes
- Modified components, routes, styles.
- Fetch API call details.

## Boundary Interfaces
- Field structure mapping (ensure case consistency: e.g. snake_case vs camelCase).
- Validation conditions for inputs.
```

### 3. Safety Rules
- Never delete or change database tables without writing backup scripts first.
- Keep modifications compatible with existing user models (Client, Admin).
