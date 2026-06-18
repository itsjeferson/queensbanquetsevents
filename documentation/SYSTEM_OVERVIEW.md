# Queen's Banquet Digital Invitation Management System

## System Name

Queen's Banquet Digital Invitation Management System

## Main Users

- Client
- Admin

## Core Purpose

The system lets clients create, customize, publish, and share digital invitation pages while collecting RSVPs, guest details, and guest messages.

The system lets admins manage invitation templates, gallery assets, event schedules, RSVP activity, and operational reports across all events.

## Architecture Summary

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

## Client Capabilities

- Create invitations from `/client/invitations/builder`
- Customize invitations from `/client/invitations/:id`
- Add cover photos, gallery photos, background video, and music
- Share public invitation links and QR codes
- Collect RSVPs from public invitation pages
- Monitor guests from `/client/invitations/:id/guests`
- Monitor event RSVPs from `/client/invitations/:id/rsvp`

## Admin Capabilities

- Manage invitation templates from `/admin/invitations`
- Monitor RSVPs across all events from `/admin/rsvp`
- Manage gallery assets from `/admin/gallery`
- Generate reports from `/admin/reports`
- Manage schedules and calendar items from `/admin/calendar`
- Manage clients, bookings, packages, payments, and CMS content

## Transferred Code Map

- Public invitation page: `frontend/src/pages/invitation/InvitationView.jsx`
- Invitation renderer and sections: `frontend/src/components/invitation/`
- Client builder: `frontend/src/pages/client/InvitationBuilder.jsx`
- Client invitation manager: `frontend/src/pages/client/InvitationManage.jsx`
- Guest management: `frontend/src/pages/client/GuestManagement.jsx`
- RSVP monitoring: `frontend/src/pages/client/RSVPMonitoring.jsx`
- Admin template management: `frontend/src/pages/admin/InvitationTemplates.jsx`
- Admin RSVP monitoring: `frontend/src/pages/admin/AdminRsvpMonitoring.jsx`
- Admin gallery management: `frontend/src/pages/admin/Gallery.jsx`
- Admin reports: `frontend/src/pages/admin/Reports.jsx`
- Admin calendar: `frontend/src/pages/admin/Calendar.jsx`
- API services: `frontend/src/services/invitationService.js`
- Backend invitation routes/controllers/models: `backend/routes`, `backend/controllers`, `backend/models`
- Database schema: `database/queens_banquet.sql` and `database/invitation_system.sql`

## Public Invitation URL

The frontend entry file is `queensbanquetevents.html`, so public invitation links use hash routing:

```text
/queensbanquetevents.html#/invite/{slug}
/queensbanquetevents.html#/event/{invite_code}
```

## Current Implementation Notes

- The frontend can preview invitation drafts locally through browser local storage.
- The backend already exposes routes for events, invitations, guests, RSVPs, guest messages, templates, gallery, reports, and calendar-related data.
- The database includes invitation templates, invitation pages, guest records, RSVP responses, and guest messages.
