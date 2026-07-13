# EN2H Booking Platform API

A RESTful Booking Platform API built with NestJS, Prisma ORM, and PostgreSQL.

This project allows users to register, authenticate using JWT, manage services, and create bookings. It also includes several bonus features such as Swagger documentation, pagination, booking search, status filtering, duplicate booking prevention, global exception handling, Docker support, and unit tests.

---

## Technologies Used

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger (OpenAPI)
- Class Validator
- bcrypt
- Docker / Docker Compose
- Jest

---

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

### Services
*(Requires authentication)*
- Create Service
- View Services (paginated)
- View Service by ID
- Update Service
- Delete Service

### Bookings
- Create Booking *(public — no authentication required)*
- View All Bookings *(requires authentication, paginated, searchable, filterable by status)*
- View Booking by ID *(requires authentication)*
- Update Booking *(requires authentication)*
- Cancel Booking *(requires authentication — sets status to `CANCELLED` without deleting the record)*
- Delete Booking *(requires authentication — permanently removes the record)*

### Bonus Features
- Swagger API Documentation
- Pagination
- Booking Search
- Filter Bookings by Status
- Duplicate Booking Prevention
- Global Exception Handling
- Docker Support
- Unit Testing

---

## Business Rules

- A booking must belong to an existing service.
- Booking dates cannot be in the past.
- Cancelled bookings cannot be marked as completed.
- Only authenticated users can manage services.
- Customers can create bookings without authentication.

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate dev
```

Start the application

```bash
npm run start:dev
```

---

## Environment Variables

Create a `.env` file and configure:

```env
DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secret_key

PORT=3000
```

---

## Environment Setup

Copy the example environment file.

```bash
cp .env.example .env
```

Update the values inside `.env` according to your local PostgreSQL database.

---

## Running with Docker (Alternative)

Instead of installing PostgreSQL locally, you can run the full stack with Docker Compose:

```bash
docker compose up --build
```

This starts the API on port `3000` and a PostgreSQL instance on port `5432`. Apply migrations once the containers are running:

```bash
docker compose exec api npx prisma migrate deploy
```

---

## Running Tests

Unit tests:

```bash
npm run test
```

End-to-end test:

```bash
npm run test:e2e
```

---

## Swagger Documentation

After starting the server, open:

```
http://localhost:3000/api
```

A Postman collection (`EN2H Booking Platform API.postman_collection.json`) is also included in the repository root.

---

## API Modules

- Authentication
- Services
- Bookings

---

## Project Structure

```
src/
├── auth/
├── bookings/
├── common/
├── prisma/
├── services/
└── users/
```

---

## Author

Dananjaya Senevirathne

---

## Assumptions Made

- Customers can create bookings without registering/logging in, per the spec's business rule; all other booking and service management endpoints require JWT authentication.
- `bookingDate` must be today or a future date; past dates are rejected at the DTO validation layer.
- Cancelling a booking is a soft action (status → `CANCELLED`); the existing `DELETE` endpoint remains available separately for hard removal.
- A `CANCELLED` booking cannot transition to `COMPLETED`.
- `price` is stored as a Prisma `Decimal` to avoid floating-point rounding issues.

## Future Improvements

- Refresh token support for longer-lived sessions.
- Role-based access control (e.g. admin vs staff) for service management.
- Rate limiting on public endpoints (e.g. `POST /bookings`) to prevent abuse.
- Broader automated test coverage (controllers, auth flow, e2e).