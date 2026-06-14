# API Documentation

Base URL: `http://localhost:8000`

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
Requires `Authorization: Bearer <token>`

## Bookings

- `GET /bookings` — List all bookings
- `GET /bookings/{id}` — Get booking
- `POST /bookings` — Create booking
- `PUT /bookings/{id}` — Update booking
- `DELETE /bookings/{id}` — Cancel booking

## Payments

- `GET /payments` — List payments
- `POST /payments/upload` — Upload receipt (multipart)
- `PUT /payments/{id}/verify` — Verify/reject payment

## Packages

- `GET /packages` — List packages
- `POST /packages` — Create package
- `PUT /packages/{id}` — Update package
- `DELETE /packages/{id}` — Delete package

## Gallery

- `GET /gallery?category=wedding` — List gallery items
- `POST /gallery/upload` — Upload image
- `DELETE /gallery/{id}` — Delete image

## Users

- `GET /users` — List clients
- `GET /users/{id}` — Get user
- `PUT /users/{id}` — Update user

## Reports

- `GET /reports/summary` — Analytics summary
