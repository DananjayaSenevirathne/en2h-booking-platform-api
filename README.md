# EN2H Booking Platform API

A RESTful Booking Platform API built with NestJS, Prisma ORM, and PostgreSQL.

This project allows users to register, authenticate using JWT, manage services, and create bookings. It also includes several bonus features such as Swagger documentation, pagination, booking search, status filtering, duplicate booking prevention, and global exception handling.

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

---

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

### Services
- Create Service
- View Services
- Update Service
- Delete Service

### Bookings
- Create Booking
- View Bookings
- Update Booking
- Delete Booking

### Bonus Features
- Swagger API Documentation
- Pagination
- Booking Search
- Filter Bookings by Status
- Duplicate Booking Prevention
- Global Exception Handling

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
```

---

## Environment Setup

Copy the example environment file.

```bash
cp .env.example .env
```

Update the values inside `.env` according to your local PostgreSQL database.


## Swagger Documentation

After starting the server, open:

```
http://localhost:3000/api
```

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
- Cancelling a booking is a soft action (status → `CANCELLED`); the existing `DELETE` endpoint   remains available separately for hard removal.
- A `CANCELLED` booking cannot transition to `COMPLETED`.
- `price` is stored as a Prisma `Decimal` to avoid floating-point rounding issues.

## Future Improvements

- Refresh token support for longer-lived sessions.
- Role-based access control (e.g. admin vs staff) for service management.
- Rate limiting on public endpoints (e.g. `POST /bookings`) to prevent abuse.
- Broader automated test coverage (controllers, auth flow, e2e).