# System Architecture

## Overview

Queens Banquet Events uses a decoupled frontend/backend architecture:

```
[React SPA] ←→ [PHP REST API] ←→ [MySQL Database]
```

## Frontend Layers

- **Pages** — Route-level views (landing, client, admin)
- **Layouts** — Shared shells (Navbar, Sidebar, Footer)
- **Components** — Reusable UI (Hero, Packages, Tables)
- **Services** — API communication layer
- **Context/Hooks** — Auth, bookings, notifications state

## Backend Layers

- **Routes** — HTTP endpoint definitions
- **Controllers** — Request handling logic
- **Models** — Database access (PDO)
- **Middleware** — Auth, validation, admin checks
- **Helpers** — Response formatting, uploads, mail

## Data Flow

1. User interacts with React component
2. Service calls PHP API via fetch
3. Controller validates and processes request
4. Model reads/writes to MySQL
5. JSON response returned to frontend
