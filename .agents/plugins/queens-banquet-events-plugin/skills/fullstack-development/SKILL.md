---
name: fullstack-development
description: "Instructions for writing React frontend code, vanilla CSS, PHP controllers/models, and PostgreSQL migration queries. Used by fullstack-developer to implement planned technical modifications."
---

# Fullstack Development

Provides principles and patterns for implementing changes on frontend React pages and PHP REST API services.

## Instructions

### 1. Database Implementation
- Place any database DDL/migration script under `database/` with a descriptive name (e.g. `database/migration_xxxx.sql`).
- Ensure all constraints, defaults, and foreign keys are explicitly defined.
- Run migrations cleanly using standard PostgreSQL queries.

### 2. Backend PHP Development
- Implement API controller logic under `backend/`.
- Ensure robust validation of incoming inputs.
- Always use `try-catch` blocks and return appropriate JSON payloads:
  ```json
  {
    "success": false,
    "error": "Error message description"
  }
  ```
- Send correct HTTP headers (`Content-Type: application/json`) and status codes (400 for bad request, 401 for unauthorized, 404 for not found, 500 for server error).

### 3. Frontend React Development
- Add styles using Vanilla CSS in corresponding styles files or inline styles where applicable.
- Make API requests through the unified wrapper at `frontend/src/services/api.js`. Add fetch methods mapping exact endpoints.
- Avoid using hardcoded credentials or API domains; utilize relative paths or environment variables if configured.
- Clean up resources in `useEffect` hooks to prevent memory leaks.

### 4. Implementation Report
Write a summary in `_workspace/03_fullstack_developer_report.md` detailing:
- The lists of files modified.
- Database queries executed.
- Implementation details and any deviation from the requirements-analyst's plan.
