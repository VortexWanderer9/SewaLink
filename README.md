# SewaLink Nepal — Trusted Local Services Marketplace

Production-ready MVP for **SewaLink Nepal**, a home services marketplace connecting
verified Nepali tradespeople (electricians, plumbers, AC technicians, tutors, cleaners,
movers, pest control, photographers, etc.) with customers across Kathmandu Valley,
Pokhara, Biratnagar and beyond.

## Stack

**Frontend — `app/`, `components/`, `lib/`**
- Next.js 14 (App Router) + React 18 + TypeScript (strict)
- Tailwind CSS (custom Nepal-themed design system)
- Google Fonts: Sora (display), Inter (body), IBM Plex Mono (mono), Noto Sans Devanagari
- Lucide icons
- Server components + Suspense boundaries + static generation

**Backend — `backend/`**
- NestJS 10 + TypeScript (strict)
- PostgreSQL 16 + Prisma 5 ORM (production schema, indexes ready)
- JWT auth (access + httpOnly refresh tokens), bcrypt password hashing
- Socket.IO realtime (chat, notifications, booking updates)
- Swagger/OpenAPI docs (`/api/docs`)
- Multer file uploads (citizenship, certificates, profile photos)
- Nepali payment gateways architecture: eSewa, Khalti, IME Pay + Cash
- Role-based access: CUSTOMER / WORKER / ADMIN
- Structured audit logs, worker verification workflow

**Deployment**
- Docker multi-stage builds for frontend + backend
- `docker-compose.yml` for local Postgres + Backend + Frontend
- Railway-ready config (`railway.json`) + env reference

---

## Quick Start (Local Development)

### 0. Prerequisites
- Node.js >= 20
- PostgreSQL >= 15 (local install or Docker)
- npm >= 10

### 1. Environment
```bash
cp .env.example .env
# then edit DATABASE_URL, JWT secrets, etc.
```

### 2. Install all dependencies
```bash
# Root (frontend)
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Prepare the database
```bash
# Make sure PostgreSQL is running, or start it via docker:
docker compose up -d postgres

cd backend
cp .env.example .env   # edit DATABASE_URL if needed
npx prisma migrate dev --name init
npm run prisma:seed    # Nepal-realistic seed data (24 workers, 30 customers, 60 bookings, etc.)
cd ..
```

### 4. Run the API
```bash
cd backend
npm run start:dev
# Swagger: http://localhost:3001/api/docs
# Health:  http://localhost:3001/api/v1/health
```

### 5. Run the frontend (separate terminal)
```bash
npm run dev
# Frontend: http://localhost:3000
```

### 6. Seeded test credentials
| Role     | Phone            | Password      |
|----------|------------------|---------------|
| Admin    | +9779800000000   | Admin@123     |
| Worker   | +9779810000001   | Worker@123    |
| Customer | +9779830000001   | Customer@123  |

---

## Docker / Production-style Local Run

```bash
docker compose up --build
# Frontend:  http://localhost:3000
# Backend:   http://localhost:3001
# Postgres:  localhost:5432
#
# Run migrations + seed inside backend container (first time only):
docker exec sewalink-backend npx prisma migrate deploy
docker exec sewalink-backend npx ts-node prisma/seed.ts
```

---

## Railway Deployment

Three services on Railway — wire them together with **Reference Variables**.

### 1. Postgres
- Marketplace → Add service → Database → **Postgres**

### 2. Backend service
- Settings → Root Directory = `/backend`
- Build command:  `npm ci && npx prisma generate && npm run build`
- Start command:  `npx prisma migrate deploy && npx prisma db seed && node dist/main.js`
- Port: `3001`
- Variables:
  - `DATABASE_URL` → reference from Postgres
  - `JWT_SECRET`, `JWT_REFRESH_SECRET` → strong 32+ char random
  - `NODE_ENV=production`
  - `CORS_ORIGIN` → your frontend URL
  - Payment gateway live credentials

### 3. Frontend service
- Settings → Root Directory = `/`
- Build command:  `npm ci && npm run build`
- Start command:  `npm run start`
- Port: `3000`
- Variables:
  - `NEXT_PUBLIC_API_URL` → backend public `/api/v1`
  - `NEXT_PUBLIC_APP_URL` → this frontend URL

Finally → Generate a domain for each service, update `CORS_ORIGIN` and `NEXT_PUBLIC_API_URL`,
and trigger a **Redeploy**.

---

## API Endpoints (Swagger: `http://localhost:3001/api/docs`)

### Auth
| Method | Path                              | Purpose                                  |
|--------|-----------------------------------|------------------------------------------|
| POST   | `/api/v1/auth/register/customer`  | Register customer account                |
| POST   | `/api/v1/auth/register/worker`    | Register worker (pending verification)   |
| POST   | `/api/v1/auth/login`              | Phone/Email + Password → JWT + cookie    |
| POST   | `/api/v1/auth/refresh`            | Rotate tokens (httpOnly cookie)          |
| POST   | `/api/v1/auth/logout`             | Revoke tokens                            |
| POST   | `/api/v1/auth/otp/send`           | Send SMS OTP (SparrowSMS stub ready)     |
| POST   | `/api/v1/auth/otp/verify`         | Verify OTP → mark phone verified         |

### Users, Workers, Customers
| Method | Path                              | Purpose                                  |
|--------|-----------------------------------|------------------------------------------|
| GET    | `/api/v1/users/me`                | My profile (with customer/worker sub)    |
| PUT    | `/api/v1/users/me`                | Update my account                        |
| GET    | `/api/v1/users`                   | **Admin** List all users                 |
| DELETE | `/api/v1/users/:id`               | **Admin** Deactivate user                |
| GET    | `/api/v1/workers/search`          | Public search + filter verified workers  |
| GET    | `/api/v1/workers/:id`             | Public worker profile                    |
| GET    | `/api/v1/workers/me/profile`      | **Worker** My full profile               |
| PUT    | `/api/v1/workers/me/profile`      | **Worker** Update profile, availability  |
| PATCH  | `/api/v1/workers/me/online`       | **Worker** Toggle online/offline         |
| GET    | `/api/v1/workers/me/bookings`     | **Worker** My bookings                   |
| GET    | `/api/v1/workers/me/earnings`     | **Worker** Earnings dashboard            |
| GET    | `/api/v1/customers/me/dashboard`  | **Customer** Dashboard                   |
| GET    | `/api/v1/customers/me/history`    | **Customer** Booking history             |
| PATCH  | `/api/v1/workers/:id/verification`| **Admin** Approve/reject worker          |

### Bookings & Payments
| Method | Path                                  | Purpose                                   |
|--------|---------------------------------------|-------------------------------------------|
| POST   | `/api/v1/bookings`                    | **Customer** Create booking               |
| GET    | `/api/v1/bookings/me`                 | My bookings (worker or customer)          |
| GET    | `/api/v1/bookings/:id`                | Booking details                           |
| PATCH  | `/api/v1/bookings/:id/status`         | Accept / Reject / En route / Complete / Cancel |
| PUT    | `/api/v1/bookings/:id/reschedule`     | **Customer** Reschedule                   |
| POST   | `/api/v1/payments/initiate`          | Initiate eSewa / Khalti / IME Pay         |
| POST   | `/api/v1/payments/esewa/verify`      | Verify eSewa after callback               |
| POST   | `/api/v1/payments/khalti/verify`     | Verify Khalti ebanking token              |
| POST   | `/api/v1/payments/:bookingId/cash-paid` | **Worker** Mark cash paid             |
| PATCH  | `/api/v1/payments/:paymentId/refund` | **Admin** Refund                          |

### Everything else
- **Categories**  `/api/v1/categories`
- **Reviews**     `/api/v1/reviews` (create after booking; per-worker list)
- **Addresses**   `/api/v1/addresses` (saved address book CRUD + set default)
- **Documents**   `/api/v1/documents/upload` (citizenship, certificates, profile photo)
- **Favorites**   `/api/v1/favorites` (customer-saved workers)
- **Earnings**    `/api/v1/earnings/me`, `/api/v1/earnings/me/request` (payout)
- **Notifications**  `/api/v1/notifications`, realtime: `ws://host/notifications`
- **Chat**           `/api/v1/chat/sessions`, realtime: `ws://host/chat`
- **Admin Dashboard** `/api/v1/admin/dashboard/overview` (KPIs, charts, pending verifications)
- **Admin Reports**   `/api/v1/admin/reports?type=bookings|revenue|workers`
- **Audit Logs**      `/api/v1/admin/audit` → `/api/v1/audit`
- **Health**          `/api/v1/health`

---

## Database & Seed

- Prisma schema: `backend/prisma/schema.prisma` (20+ tables, production indexes)
- Nepal seed data: `backend/prisma/seed.ts`
  - 12 service categories (with Nepali names)
  - 5 achievement badges
  - 1 Admin, 24 workers (6 unverified for testing), 30 customers
  - 60 bookings across realistic past/future dates with status mix
  - Reviews, payments, notifications, earnings, audit logs
- Seed commands:
  ```bash
  cd backend
  npx prisma migrate dev --name init  # Dev DB
  npm run prisma:seed                 # Load Nepal data
  npx prisma migrate deploy           # Production / Railway
  ```

---

## Payment Gateways (Nepal-ready architecture)

| Gateway  | Environment | Docs                                     |
|----------|-------------|------------------------------------------|
| eSewa    | UAT uses `EPAYTEST` creds | https://developer.esewa.com.np        |
| Khalti   | Test public/secret keys     | https://docs.khalti.com/khalti-epayment/ |
| IME Pay  | Staging env                 | Merchant onboarding via IME Pay         |

Each gateway implements: `initiate() → user redirect/confirm → verify() → complete booking`.
Cash-on-completion flow is built in (worker marks paid at job end).

---

## NPM Scripts

**Root (frontend)**
```bash
npm run dev       # Next.js dev server (3000)
npm run build     # Production build
npm run start     # Serve build
npm run lint      # ESLint (next/core-web-vitals)
npx tsc --noEmit  # TypeScript strict check
```

**Backend (`cd backend`)**
```bash
npm run start:dev             # Nest dev watch mode (3001)
npm run build                 # tsc build
npm run start:prod            # node dist/main
npm run prisma:generate       # Regenerate Prisma client
npm run prisma:migrate:dev    # Dev migration (dev db only)
npm run prisma:migrate:deploy # Production (Railway, etc.)
npm run prisma:seed           # Seed Nepal data
```

---

## Project Structure

```
sewalink-nepal/
├── app/                         Next.js App Router pages
│   ├── page.tsx                 Home
│   ├── booking/[workerId]/      4-step booking flow
│   ├── booking/confirmed/       Confirmation screen
│   ├── browse/                  Search/filter professionals
│   ├── worker/[id]/             Public worker profile
│   ├── login/                   Phone OTP / Email / Google
│   ├── pro/apply/               Worker onboarding
│   └── ... (about, terms, etc.)
├── components/                  Reusable UI (Header, Footer, WorkerCard, BookingFlow, LoginView, ProApplyView, ...)
├── lib/
│   ├── data.ts                  Static types + mock seed (kept for zero-backend fallback)
│   └── api.ts                   Typed API client for SewaLink backend (auth/categories/workers/bookings/payments/chat/etc.)
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        PostgreSQL schema (20+ tables, indexes)
│   │   └── seed.ts              Nepal-realistic seed script
│   ├── src/
│   │   ├── main.ts              Bootstrap (helmet, cors, global pipes, Swagger)
│   │   ├── app.module.ts        Module composition
│   │   ├── prisma/              Global PrismaService
│   │   ├── common/              JwtAuthGuard, Roles/CurrentUser/Public decorators, logger middleware
│   │   ├── auth/                Register/login, JWT strategy, refresh tokens, phone OTP stubs
│   │   ├── users/ customers/ workers/ categories/ bookings/ payments/
│   │   ├── reviews/ notifications/ (with Socket.IO gateway)
│   │   ├── chat/                Chat sessions + messages + Socket.IO gateway
│   │   ├── addresses/ documents/ favorites/ earnings/
│   │   ├── admin/               Dashboard KPIs, charts (monthly bookings), reports, system health
│   │   └── audit/               Structured audit logs (retrieve for admin)
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
├── Dockerfile                   Multi-stage: frontend + backend targets
├── docker-compose.yml           Postgres + Backend + Frontend stack
├── railway.json                 Railway deployment env template
├── .env.example                 All env vars for local dev
└── README.md
```

---

## Quality Gates

All three must be green before deploy:
```bash
# Frontend
cd /project
npm run build        # Next.js build (includes type-check + lint)
npm run lint
npx tsc --noEmit

# Backend
cd backend
npm run build        # TypeScript compile
```

---

## License & Business Information

SewaLink Nepal — Verified local professionals for every home and business.

- Info pages: `/about`, `/trust`, `/careers`, `/press`, `/privacy`, `/terms`, `/help`, `/blog`
- Worker onboarding: `/pro/apply`, `/pro/earnings`, `/pro/support`, `/pro/verification`
- Customer help: `help@sewalinknepal.com`
- Pro onboarding team: +977-98-0000-0000
