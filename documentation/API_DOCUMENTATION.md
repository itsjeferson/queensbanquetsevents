# API Documentation

Base URL: `http://localhost:8000`

The PHP REST API powers Queen's Banquet Digital Invitation Management System.

## Authentication

### POST /auth/login

```json
{ "email": "user@email.com", "password": "password" }
```

### POST /auth/register

```json
{ "firstName": "Maria", "lastName": "Santos", "email": "maria@email.com", "phone": "+63...", "password": "..." }
```

### GET /auth/me

Requires `Authorization: Bearer <token>`.

## Events and Invitations

- `GET /events` - List events
- `GET /events?client_id={id}` - List events for one client
- `GET /events/{id}` - Get event and invitation page
- `POST /events` - Create event and invitation
- `PUT /events/{id}` - Update event and invitation
- `POST /events/{id}/publish` - Publish invitation
- `DELETE /events/{id}` - Delete or archive event
- `GET /invitations/slug/{slug}` - Get public invitation by slug
- `GET /invitations/code/{code}` - Get public invitation by invite code

## Guests

- `GET /guests/event/{event_id}` - List guests for an event
- `POST /guests` - Add guest
- `POST /guests/bulk` - Bulk add guests
- `DELETE /guests/{id}` - Remove guest

## RSVP

- `GET /rsvp/event/{event_id}` - List RSVP responses for an event
- `POST /rsvp` - Submit RSVP response

## Guest Messages

- `GET /guest-messages/event/{event_id}` - List public guest messages
- `POST /guest-messages` - Submit guest message

## Invitation Templates

- `GET /templates` - List active templates
- `GET /templates?category=wedding` - List templates by category
- `GET /templates/{id}` - Get template
- `POST /templates` - Create template
- `PUT /templates/{id}` - Update template

## Gallery Assets

- `GET /gallery` - List gallery assets
- `GET /gallery?category=wedding` - List gallery assets by category
- `POST /gallery/upload` - Upload image asset
- `DELETE /gallery/{id}` - Delete image asset

## Reports

- `GET /reports/summary` - Analytics summary for admin reports

## Supporting Business Modules

- `GET /bookings` - List bookings
- `POST /bookings` - Create booking
- `PUT /bookings/{id}` - Update booking
- `DELETE /bookings/{id}` - Cancel booking
- `GET /payments` - List payments
- `POST /payments/upload` - Upload receipt
- `PUT /payments/{id}/verify` - Verify or reject payment
- `GET /packages` - List packages
- `POST /packages` - Create package
- `PUT /packages/{id}` - Update package
- `DELETE /packages/{id}` - Delete package
- `GET /users` - List users
- `GET /users/{id}` - Get user
- `PUT /users/{id}` - Update user
