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