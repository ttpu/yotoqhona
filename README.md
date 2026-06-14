# Smart Student Housing Ecosystem (SSHE)

Production-ready full-stack web platform for student housing lifecycle management in Uzbekistan.

## Core scope

- Student verification (OneID-ready flow)
- Housing search and filtering catalog
- Application and queue management
- Room allocation lifecycle
- Residency payments and receipts
- Notifications (in-app/email/SMS placeholders)
- Reviews and analytics dashboards
- Multi-role administration

## Roles

- Student
- University Administrator
- Hostel Administrator
- Private Landlord
- Super Administrator

## Tech stack

- Next.js 14 (App Router + API Routes)
- TypeScript
- Prisma ORM (PostgreSQL target)
- Responsive custom UI (no template boilerplate)

## Run locally

1. Install dependencies

```bash
npm install
```

2. Configure environment

```bash
cp .env.example .env
```

3. Start development server

```bash
npm run dev
```

Open http://localhost:3000

## Database

Prisma schema is included for production DB modeling.

Useful commands:

```bash
npm run db:generate
npm run db:push
npm run db:studio
```

For quick PostgreSQL startup:

```bash
docker compose up -d
```

## Important notes

- OneID is represented by an integration-ready mock endpoint.
- Payment providers (Click, Payme, Uzum, Paynet) are scaffolded with a unified API shape.
- Queue logic includes priority ordering, automatic candidate selection, and temporary reservation semantics.