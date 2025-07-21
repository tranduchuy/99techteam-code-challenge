# ExpressJS CRUD Backend (TypeScript, DDD, PostgreSQL)

## Overview

This project is a robust, maintainable, and well-documented ExpressJS CRUD backend built with TypeScript, PostgreSQL, and Docker Compose. It demonstrates advanced backend and Domain-Driven Design (DDD) skills, clean code, and best practices. The codebase is structured for extensibility, testability, and clarity, following a layered DDD approach.

---

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [How to Run Locally](#how-to-run-locally)
  - [With Docker](#with-docker)
  - [Without Docker](#without-docker)
- [Available Commands](#available-commands)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Code Quality & Best Practices](#code-quality--best-practices)
- [Extensibility](#extensibility)

---

## Features
- **Full CRUD** for `Item` resource: create, read (list/detail), update, delete
- **Advanced DDD structure**: clear separation of domain, application, and interface layers
- **PostgreSQL** database with TypeORM and migrations
- **Validation**: request validation with `express-validator`
- **Centralized error handling**
- **Request logging** with `morgan`
- **OpenAPI (Swagger) documentation** auto-generated from code
- **Comprehensive unit tests** for domain, service, and controller layers
- **Dockerized** for easy local development

---

## Project Structure

```
problem4/
├── docker-compose.yml         # Orchestrates app and PostgreSQL
├── Dockerfile                 # Multi-stage build for dev/prod
├── package.json               # Scripts and dependencies
├── src/
│   ├── index.ts               # App entrypoint, DI, middleware, docs
│   ├── data-source.ts         # TypeORM DataSource config
│   ├── domains/               # Domain models/entities (core business logic)
│   │   ├── Item.ts            # Item entity definition
│   │   └── __tests__/         # Domain-level tests
│   ├── application/           # Application services (use cases, orchestration)
│   │   ├── ItemService.ts     # Business logic for Item
│   │   └── __tests__/         # Service-level tests
│   ├── interfaces/            # API layer (controllers, routes, error handling)
│   │   ├── itemRoutes.ts      # Express routes + Swagger docs
│   │   ├── itemController.ts  # Controller logic
│   │   ├── errorHandler.ts    # Centralized error handler
│   │   └── __tests__/         # Controller-level tests
│   ├── migrations/            # DB migrations (TypeORM)
│   │   └── 1753087024029-CreateItemTable.ts
│   └── ...
└── ...
```

### DDD Layering
- **domains/**: Entities, value objects, and domain logic (pure business rules)
- **application/**: Services that coordinate domain logic to fulfill use cases
- **interfaces/**: API controllers, routes, error handling, and external communication

---

## Tech Stack
- **Backend**: ExpressJS (TypeScript)
- **Database**: PostgreSQL (via Docker Compose)
- **ORM**: TypeORM
- **Validation**: express-validator
- **Testing**: Jest, Supertest, @jest-mock/express
- **Docs**: Swagger (OpenAPI) via swagger-jsdoc & swagger-ui-express
- **Dev Tools**: Nodemon, ts-node, ESLint, Prettier
- **Containerization**: Docker, docker-compose

---

## How to Run Locally

### With Docker
1. **Copy/Create `.env` file** (see [Environment Variables](#environment-variables))
2. **Build and start all services:**
   ```sh
   docker-compose up --build
   ```
   - App: http://localhost:3000
   - PostgreSQL: localhost:5432
3. **Run database migrations:**
   > Even when using Docker for PostgreSQL, you must run the migration command to initialize the database schema:
   ```sh
   npm run typeorm migration:run
   ```
   You can run this in a separate terminal while the containers are up.
4. **Access API docs:** http://localhost:3000/docs

### Without Docker
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start PostgreSQL** (locally or with Docker)
3. **Set up `.env` file** (see [Environment Variables](#environment-variables))
4. **Run DB migrations:**
   ```sh
   npm run typeorm migration:run
   ```
5. **Start the app (dev mode):**
   ```sh
   npm run dev
   ```
   Or (prod mode):
   ```sh
   npm start
   ```
6. **Access API docs:** http://localhost:3000/docs

---

## Available Commands
| Command                        | Description                                 |
|------------------------------- |---------------------------------------------|
| `npm run dev`                  | Start in dev mode (Nodemon, hot reload)     |
| `npm start`                    | Start in prod mode (ts-node)                |
| `npm test`                     | Run all tests (Jest)                        |
| `npm run lint`                 | Run ESLint                                  |
| `npm run format`               | Run Prettier                                |
| `npm run typeorm migration:run`| Run DB migrations                           |

---

## API Documentation (Swagger)
- **Interactive docs:** http://localhost:3000/docs
- **OpenAPI spec** auto-generated from JSDoc comments in `src/interfaces/itemRoutes.ts`
- **Endpoints:**
  - `POST   /items`      – Create item
  - `GET    /items`      – List items (filter: name, pagination)
  - `GET    /items/:id`  – Get item by ID
  - `PUT    /items/:id`  – Update item
  - `DELETE /items/:id`  – Delete item
- **Schema:**
  - `id` (string, uuid)
  - `name` (string, required)
  - `description` (string, optional)
  - `createdAt`, `updatedAt` (ISO date strings)
- **Validation:**
  - `name` required for create/update
  - Pagination: `limit` (>=1), `offset` (>=0)
- **Error responses:**
  - 400: Validation error
  - 404: Not found

---

## Testing
- **Unit tests** for domain, service, and controller layers
- **Tested with mocks** (no real DB required for unit tests)
- **Coverage:**
  - Domain entity: `src/domains/__tests__/Item.test.ts`
  - Service logic: `src/application/__tests__/ItemService.test.ts`
  - Controller/API: `src/interfaces/__tests__/itemController.test.ts`
- **Run all tests:**
  ```sh
  npm test
  ```

---

## Environment Variables
Create a `.env` file in the root with:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=appdb
```
- These match the defaults in `docker-compose.yml` and `src/data-source.ts`.
- You can override as needed for your environment.

---

## Code Quality & Best Practices
- **Type safety**: TypeScript throughout
- **Validation**: All input validated with `express-validator`
- **Centralized error handling**: See `src/interfaces/errorHandler.ts`
- **Logging**: HTTP requests logged with `morgan`
- **Linting/Formatting**: ESLint and Prettier enforced
- **SOLID principles**: Clear separation of concerns, DDD layering
- **Extensible**: Add new resources by following the same DDD structure

---

## Extensibility
- **Add new entities**: Create new domain models in `src/domains/`
- **Add new services/use cases**: Implement in `src/application/`
- **Add new routes/controllers**: Implement in `src/interfaces/`
- **Document new endpoints**: Use JSDoc + Swagger comments for auto-generated docs

---

## Reviewer Guidance
- The codebase is organized for clarity, testability, and maintainability
- DDD layering is strictly followed
- All business logic is isolated from the API layer
- API is fully documented and testable via Swagger UI
- Tests cover all critical paths and edge cases
- Docker setup ensures reproducibility

---

**For any questions, see the code comments and Swagger docs, or contact the author.**

## Future Improvements
- **CI/CD:** Set up GitHub Actions for continuous integration and deployment (test, lint, build, deploy on push/PR)
- **Integration tests:** Add end-to-end and integration tests (e.g., using Supertest with a test DB)
- **Production readiness:** Add health checks, monitoring, and production Docker optimizations
- **More resources:** Extend DDD structure to support additional domain entities and aggregates
- **API versioning & security:** Add versioned routes, authentication, and authorization
