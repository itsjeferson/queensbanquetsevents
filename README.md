# Queen's Banquet Digital Invitation Management System

Queen's Banquet Digital Invitation Management System is a React, PHP, and PostgreSQL application for creating, customizing, sharing, and monitoring digital event invitations.

## Main Users

- Client
- Admin

## Core Purpose

Clients can create invitations, customize invitation pages, add photos/music/background video, share invitation links, collect RSVPs, and monitor guests.

Admins can manage invitation templates, monitor RSVPs across all events, manage gallery assets, generate reports, and manage schedules/calendar entries.

## Architecture

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
│    PostgreSQL DB    │
└─────────────────────┘
```

The frontend API client lives in `frontend/src/services/api.js`. It currently provides an Axios-style service wrapper using `fetch`.

## Key Modules

- Public invitation microsite: `frontend/src/pages/invitation/InvitationView.jsx`
- Invitation sections: `frontend/src/components/invitation/`
- Client builder: `frontend/src/pages/client/InvitationBuilder.jsx`
- Client invitation manager: `frontend/src/pages/client/InvitationManage.jsx`
- Client guest monitoring: `frontend/src/pages/client/GuestManagement.jsx`
- Client RSVP monitoring: `frontend/src/pages/client/RSVPMonitoring.jsx`
- Admin template management: `frontend/src/pages/admin/InvitationTemplates.jsx`
- Admin RSVP monitoring: `frontend/src/pages/admin/AdminRsvpMonitoring.jsx`
- Admin gallery management: `frontend/src/pages/admin/Gallery.jsx`
- Admin reports: `frontend/src/pages/admin/Reports.jsx`
- Admin calendar: `frontend/src/pages/admin/Calendar.jsx`
- Backend routes/controllers/models: `backend/`
- Database schema: `database/queens_banquet.sql` and `database/invitation_system.sql`

## Public Invitation URLs

The frontend entry file is `queensbanquetevents.html`, so public invitation links use hash routing:

```text
/queensbanquetevents.html#/invite/{slug}
/queensbanquetevents.html#/event/{invite_code}
```

## Frontend Commands

```bash
cd frontend
npm install
npm run dev
npm run build
```

## Documentation

- System overview: `documentation/SYSTEM_OVERVIEW.md`
- Architecture: `documentation/SYSTEM_ARCHITECTURE.md`
- API documentation: `documentation/API_DOCUMENTATION.md`
- Deployment guide: `documentation/DEPLOYMENT_GUIDE.md`
