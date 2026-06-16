# System Architecture

## Overview

Queen's Banquet Digital Invitation Management System uses a decoupled frontend/backend architecture:

```text
┌─────────────────────┐
│     React Frontend  │
└──────────┬──────────┘
           │
           │ API Requests
           ▼
┌─────────────────────┐
│      PHP REST API   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      MySQL DB       │
└─────────────────────┘
```

The frontend currently sends requests through `frontend/src/services/api.js`, which provides an Axios-style API client wrapper using `fetch`.

## Frontend Layers

- Pages: route-level views for landing, client, admin, and public invitations
- Layouts: shared shells for client and admin workspaces
- Components: reusable UI, dashboard widgets, and invitation page sections
- Services: API communication for invitations, events, guests, RSVPs, templates, gallery, and reports
- Context/Hooks: authentication, bookings, and notifications state

## Backend Layers

- Routes: HTTP endpoint definitions
- Controllers: request handling logic
- Models: database access through PDO
- Middleware: authentication, validation, and admin checks
- Helpers: response formatting, uploads, slugs, mail, and validation

## Invitation Management Flow

1. Client creates an event and invitation in the builder.
2. Client customizes invitation content, photos, music, video, venue, and RSVP copy in the manager.
3. System publishes a shareable invitation URL and QR code.
4. Guests open the public invitation page and submit RSVP responses or messages.
5. Client monitors guests and RSVPs.
6. Admin monitors templates, gallery assets, all-event RSVPs, calendars, and reports.

## Core Data Flow

1. User interacts with a React page or component.
2. Frontend service calls the PHP REST API.
3. Route dispatches to the correct controller.
4. Controller validates input and calls a model.
5. Model reads or writes MySQL tables.
6. JSON response returns to the frontend.

## Primary Modules

- Client invitation builder and manager
- Public invitation microsite renderer
- RSVP collection and monitoring
- Guest management
- Admin template management
- Admin gallery asset management
- Admin reports
- Admin schedules/calendar
