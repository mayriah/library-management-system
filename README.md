# Library Management System

A production-ready data layer for a library's book catalog built with **NestJS**, **Prisma ORM**, and **PostgreSQL**.

---

## Checked Files & Implementation Summary

This project implements all required core deliverables and stretch tasks specified for the assignment:

1. **`api/prisma/schema.prisma`**
   - Defines a `Role` enum (`PATRON`, `LIBRARIAN`).
   - Defines `User` model using the `Role` enum with a default role of `PATRON`.
   - Defines `Genre` model with unique `name` and `slug`.
   - Defines `Book` model referencing `Genre` via `genreId` foreign key with `@relation(fields: [genreId], references: [id])`.
   - **Stretch task**: Defines `Review` model with `bookId`, `userId`, `rating`, and `comment` relations.

2. **`api/prisma/seed.ts`**
   - Seeds 4 genres (`Fantasy`, `Science Fiction`, `Mystery`, `Biography`).
   - Seeds 16 distinct books (4 per genre) with unique ISBNs, descriptions, and copy counts.

3. **`api/src/prisma/prisma.service.ts`**
   - Extends `PrismaClient`.
   - Implements `OnModuleInit`.
   - Connects to the database by calling `await this.$connect()` inside `onModuleInit()`.

4. **`api/.env.example`**
   - Provides a sanitized `DATABASE_URL` placeholder without real credentials.

5. **`README.md`**
   - Includes the required **Schema Decisions** section and comparative analysis between Prisma and document databases.

---

## Schema Decisions

Book references Genre via a genreId foreign key rather than embedding the genre name directly, because many books share one genre and genres are managed independently (renaming a genre should not require updating every book). User stores a `role` field using a Role enum so Postgres and TypeScript both reject any value other than PATRON or LIBRARIAN.

### Detailed Architecture Rationale

- **Normalization vs. Duplication**:
  Embedding genre data directly in each book record would cause data anomalies. If a genre's title or categorization changes (e.g., from "Sci-Fi" to "Science Fiction"), every matching book record would require a write update in an embedded design. A normalized foreign key relation (`genreId -> Genre.id`) guarantees single-source-of-truth consistency.
- **Slug Support for URLs**:
  The `Genre` model includes a unique `slug` (e.g., `science-fiction`), enabling SEO-friendly routing (`/genres/science-fiction`) without exposing internal database IDs or requiring query-time string manipulation.
- **Strict Role-Based Access**:
  Utilizing a native PostgreSQL enum for `Role` (`PATRON`, `LIBRARIAN`) ensures type safety across both database constraints and the TypeScript application layer, preventing invalid roles at compile time and runtime.
- **Stretch Entity - Review Relation**:
  The `Review` model links a `User` and a `Book` with foreign keys (`userId` and `bookId`), supporting user feedback, numeric ratings, and comments while maintaining referential integrity.

---

## Stretch Note: Modeling in Prisma vs. a Document Database

One prominent difference when modeling data in Prisma (with a relational database like PostgreSQL) versus a document database (like MongoDB) is **explicit schema enforcement and relationship directionality**.

In a document database (e.g., MongoDB / Mongoose):
- Relationships are often modeled by embedding sub-documents (e.g., an array of reviews directly inside the book document, or storing genre as an embedded object).
- Schema changes are often loose; orphaned references can easily occur because foreign key constraints do not exist natively at the storage engine level.
- Denormalization is common to optimize read speeds at the expense of write-time synchronization.

In Prisma (relational with PostgreSQL):
- Every relation requires bidirectional declaration in the schema (`Book` defines `genre Genre @relation(...)`, and `Genre` must define `books Book[]`).
- Referential integrity is strictly maintained by the database engine: attempting to insert a book with a non-existent `genreId` or deleting a referenced genre without handling cascades triggers a foreign key constraint violation.
- Migrations (`prisma migrate dev`) explicitly track and version structural transitions using reproducible SQL scripts, preventing schema drift across environments.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database instance (local or hosted e.g. Neon, Supabase, Render, Railway)

### 2. Environment Configuration
Navigate to the `api` folder and create your `.env` file:
```bash
cd api
cp .env.example .env
```
Update `DATABASE_URL` in `api/.env` with your actual PostgreSQL connection string:
```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Prisma Migration
Apply the schema migrations to your PostgreSQL database:
```bash
npx prisma migrate dev --name init
```

### 5. Seed the Database
Populate your database with the initial 4 genres and 16 books:
```bash
npx ts-node prisma/seed.ts
```
Or use the npm script:
```bash
npm run seed
```

### 6. Verify with Prisma Studio
Open Prisma Studio to visually inspect the seeded `Genre` and `Book` tables:
```bash
npx prisma studio
```

