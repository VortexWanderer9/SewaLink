# SEWALINK NEPAL — REMAINING TASKS (AUDIT FOR NEXT AI)

Last updated: 2026-08-02
Frontend status: ✅ STABLE — `npm run build`, `npm run lint`, `npx tsc --noEmit` ALL PASS
Backend status: ⚠️ CODE WRITTEN — NOT YET BUILT OR TESTED (deps not installed)

---

## PHASE 1 — STABILIZE & VALIDATE EVERYTHING

### 1.1 Fix frontend TypeScript errors (1 remaining)
File: `lib/realtime.ts` line ~32
Issue: `(mod as any).default?.io` — `mod` typed as module namespace object; optional chain `?.` may need cast.
Fix: Simplify ensureIO to:
```ts
const mod: any = await import('socket.io-client');
this.ioClient = mod.io ?? mod.default?.io ?? mod.default ?? mod;
```
Then verify:
```bash
cd /project
npx tsc --noEmit          # MUST = 0 errors
npm run lint              # MUST = 0 errors
npm run build             # MUST SUCCEED
```

### 1.2 Install backend deps + build
```bash
cd backend
npm install
# Then (fix any missing deps compile errors)
npx tsc --noEmit --project tsconfig.json   # MUST = 0 errors
npx tsc --build tsconfig.json              # OR: npm run build
```

Expected issues to fix:
- `main.ts` line ~6 `helmet({` — verify helmet v7+ default export (may need `import helmet from 'helmet'` vs default)
- `cookie-parser` import — default vs named
- `auth.service.ts` imports — check `Login` is actually imported/aliased or use `LoginDto`
- Prisma-specific Decimal handling — in seed and services `worker.profile.priceFrom.toNumber()` may need `Number(priceFrom)` if `.toNumber()` unavailable

### 1.3 Generate Prisma client
```bash
cd backend
npx prisma generate
# If postgres available, run:
npx prisma migrate dev --name init
npx prisma db seed            # or: npx ts-node prisma/seed.ts
```

### 1.4 Start backend locally and hit endpoints
```bash
cd backend && npm run start:dev
```
Check:
- GET  http://localhost:3001/api/v1/health  → 200 json
- GET  http://localhost:3001/api/docs       → Swagger loads
- POST /api/v1/auth/login `{phone:"+9779800000000", password:"Admin@123"}` → returns tokens
- GET  /api/v1/workers/search                → paginated worker list
- GET  /api/v1/categories                     → 12 categories

---

## PHASE 2 — FIX KNOWN BUGS / GAPS IN BACKEND

### 2.1 `auth.service.ts` — LoginDto param mismatch
Line: `async login(dto: Login, ...)` should be `dto: LoginDto`
File: `backend/src/auth/auth.service.ts:176`

### 2.2 `categories.service.ts` was already fixed (line 11 — missing `]`)
Verify again.

### 2.3 `bookings.service.ts` circular import risk
BookingsModule imports NotificationsModule, ChatModule; ChatModule imports NotificationsModule — audit order or forwardRef.
If nest boot fails: use `forwardRef(() => NotificationsModule)` in Bookings/Chat imports.

### 2.4 Verify every module exists for app.module.ts imports
There are 16 imports in app.module. Confirm each of these files exists:
✅ prisma, auth, users, workers, customers, categories, bookings, payments, reviews, notifications, chat, addresses, documents, earnings, favorites, admin, audit.

### 2.5 `PrismaService` `cleanDatabase` query raw
`TRUNCATE TABLE "${table}" CASCADE;` — Prisma.ModelName is enum, need string[] array manually OR cast.

### 2.6 Seed script Decimal math
```ts
worker.profile.priceFrom.toNumber()  // NOT valid on Prisma.Decimal — use Number(worker.profile.priceFrom)
```
Replace all `.toNumber()` occurrences in seed + services with `Number(...)`.

### 2.7 `chat.gateway.ts` imports PrismaService — verify injection works
PrismaModule is Global, so should be fine.

### 2.8 `documents.controller.ts` storage path
Need to ensure `./uploads` or `process.env.UPLOAD_DIR` exists before app boots. Add mkdir in main.ts bootstrap:
```ts
import { mkdirSync, existsSync } from 'fs';
const dir = process.env.UPLOAD_DIR || './uploads';
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
```

### 2.9 `admin/admin.service.ts` `monthlyBookingsChart`
Parallel prisma calls inside for loop 12× = OK but not great. Keep for now.

---

## PHASE 3 — CONNECT FRONTEND TO REAL APIs (REPLACE MOCK DATA EVERYWHERE)

Current state: Frontend UI still uses `lib/data.ts` arrays (static mock) for:
- `app/page.tsx` → categories/workers
- `app/browse/page.tsx` → BrowseContent
- `app/worker/[id]/page.tsx` → worker profile
- `app/booking/[workerId]/page.tsx` → find worker by id
- `components/booking/ConfirmedView.tsx` → find worker
- `components/home/FeaturedPros.tsx` → workers.slice
- `components/CategoryCard.tsx` → categories list
- etc.

### 3.1 Strategy
Keep `lib/data.ts` as **fallback-only**, but create server-side `getData()` wrappers:
```ts
// lib/server-data.ts (server only)
export async function getCategories() {
  try { return await categoriesApi.list(); }
  catch { return import('./data').then(m => m.categories); }
}
```
Update each page to call real API with graceful fallback to mock.

### 3.2 Hook up LoginView (components/auth/LoginView.tsx)
On submit: call `authApi.login({phone, password})` → save token via `setAuthToken(result.accessToken)`.
On OTP submit: call sendOtp/verifyOtp.

### 3.3 Hook up ProApplyView (components/pro/ProApplyView.tsx)
On submit form → call `authApi.registerWorker(dto)` → save token → redirect `/pro/verification`.

### 3.4 Hook up BookingFlow (components/booking/BookingFlow.tsx)
Final "Confirm booking" → call `bookingsApi.create({workerId, scheduledAt: slot, address, notes, payment})` → redirect to `/booking/confirmed?bookingId=...` with real bookingId.

### 3.5 Hook up ConfirmedView to load by bookingId (not worker param)

### 3.6 Add AuthContext for frontend
`context/AuthContext.tsx` — provide `{user, login, logout, loading}`. Use `useEffect(() => usersApi.me().catch(()=>null))` on mount.

---

## PHASE 4 — DASHBOARD PAGES (MISSING ROUTES IN FRONTEND)

These page files DO NOT EXIST yet and must be created:

### 4.1 Customer routes
- `app/customer/dashboard/page.tsx`  — calls `customersApi.dashboard()`
- `app/customer/history/page.tsx`    — calls `customersApi.history()`
- `app/customer/bookings/page.tsx`   — lists bookings via `bookingsApi.getMy()`
- `app/customer/favorites/page.tsx`  — `favoritesApi.list()`
- `app/customer/addresses/page.tsx`  — `addressesApi CRUD`
- `app/customer/chat/page.tsx`       — chat sessions list + realtime

### 4.2 Worker routes
- `app/worker/dashboard/page.tsx`    — earnings, active bookings, reviews summary
- `app/worker/profile/page.tsx`      — edit form, upload documents, set availability, pricing
- `app/worker/bookings/page.tsx`     — accept/reject/en-route/complete buttons
- `app/worker/earnings/page.tsx`     — earnings line items + payout request
- `app/worker/documents/page.tsx`    — document upload + verification status
- `app/worker/chat/page.tsx`         — chat with customers
- `app/pro/verification/page.tsx`    — (currently placeholder shell) fill with real status

### 4.3 Admin routes (Role=ADMIN only)
- `app/admin/dashboard/page.tsx`     — cards + charts from `adminApi.dashboardOverview()`
- `app/admin/users/page.tsx`         — users list, activate/deactivate
- `app/admin/workers/page.tsx`       — pending verifications list + approve/reject modal
- `app/admin/bookings/page.tsx`      — booking management
- `app/admin/reports/page.tsx`       — report picker + download CSV
- `app/admin/audit/page.tsx`         — audit logs list
- `app/admin/system/page.tsx`        — system health

Add `middleware.ts` at project root to protect:
```ts
import { NextRequest, NextResponse } from 'next/server';
export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value || '';
  // decode base64 payload to check role, or check against /users/me via cache
}
export const config = { matcher: ['/customer/:path*','/worker/:path*','/admin/:path*'] };
```

---

## PHASE 5 — REALTIME (Socket.IO client wiring)

### 5.1 Notifications bell in Header.tsx
- Badge → `notificationsApi.unreadCount()`
- On click → dropdown list + mark read
- Subscribe via `useRealtime(userId, token)` to toast on `notification:new`

### 5.2 Chat page (worker & customer)
- Messages list, send text, typing indicator
- Auto-scroll, date separators, avatar bubbles
- Join session: `chatApi.getOrCreateSession(otherUserId, bookingId)` → subscribe
- Send: `chatApi.sendMessage(sessionId, content)` + realtime
- Typing: `getRealtime().sendTyping(sessionId, isTyping)`

### 5.3 Booking realtime updates
Show live status change toast in booking detail & dashboard when `status` updates.

---

## PHASE 6 — PAYMENT FLOW INTEGRATION

### 6.1 Booking step 3 "Payment" selection in BookingStepContent.tsx
Show eSewa / Khalti / IME Pay / Cash buttons.
On next → call `paymentsApi.initiate(bookingId, method)` →
- If ESEWA: redirect to result.gatewayConfig.paymentUrl with params from config
- If KHALTI: render Khalti widget with public key → on success call verifyKhalti
- If IMEPAY: IME Pay checkout redirect
- If CASH: skip, mark at completion

### 6.2 Callback pages
- `app/payments/esewa/page.tsx` — reads `oid, amt, refId` from query → calls `verifyEsewa` → redirect to booking
- Khalti/IMEPAY similar handlers

### 6.3 Mark cash paid button on worker booking completion
Currently worker booking actions → Add "Mark cash paid" before "Complete".

---

## PHASE 7 — DOCKER / RAILWAY PRODUCTION VALIDATION

### 7.1 Docker build
```bash
docker build --target backend -t sewalink-be .
docker build --target frontend -t sewalink-fe .
```
Fix any COPY errors (missing files etc.).

### 7.2 docker-compose full stack run
```bash
docker compose up --build
# then in backend container:
docker exec sewalink-backend sh -c 'npx prisma migrate deploy && npx ts-node prisma/seed.ts'
```
Verify:
- http://localhost:3000 loads home page
- http://localhost:3001/api/v1/health returns 200
- http://localhost:3001/api/docs loads Swagger
- Login as seeded admin/customer/worker works
- File upload works (POST /documents/upload with JPG)

### 7.3 Railway.json cleanup
`railway.json` was mis-labeled — it actually contains env vars only. Rename to `railway.env.example` OR move to proper Railway `nixpacks.toml` per service:

For backend: create `backend/railway.toml` with:
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm ci && npx prisma generate && npx tsc -p tsconfig.json"
startCommand = "npx prisma migrate deploy && node dist/main.js"

[[services.ports]]
port = 3001
type = "HTTP"
```
For frontend: `railway.toml`:
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm ci && npm run build"
startCommand = "npm run start"

[[services.ports]]
port = 3000
type = "HTTP"
```

### 7.4 Production env var checklists in README
Ensure README Railway section has explicit copy-paste variables list.

---

## PHASE 8 — POLISH / QUALITY GATES

### 8.1 Accessibility (WCAG AA)
- All existing pages pass; new dashboard pages MUST include:
  - aria-labels on icon-only buttons
  - focus visible states
  - semantic headings order
  - `alt`/`aria-label` on images

### 8.2 Strict no-`any` audit in backend
Currently services use `any` for DTOs. Replace with class-validator DTOs per module:
- `workers/dto/`   UpdateWorkerProfileDto etc.
- `bookings/dto/`  CreateBookingDto, UpdateBookingStatusDto
- `reviews/dto/`   CreateReviewDto
- etc.

### 8.3 Unit tests for auth + booking lifecycle (optional for MVP)
```bash
cd backend
npm run test   # add minimal auth service spec
```

### 8.4 Lighthouse on homepage + browse
Target: performance >90, a11y >95, best practices >90, SEO >95.

### 8.5 Seed script: use NUMBER() not .toNumber()
Replace every `.toNumber()` in `backend/prisma/seed.ts`.

### 8.6 Final green build for frontend AND backend
```bash
# /project
npm run build        # pass
npm run lint         # pass
npx tsc --noEmit     # pass
# /backend
npm run build        # pass (dist/ generated)
```

---

## COMPLETE QUICK HIT LIST (IN ORDER — HIGH IMPACT FIRST)

1. ✅ Simplify `lib/realtime.ts` ensureIO → cast to any properly
2. ✅ Run `npm install socket.io-client` — DONE
3. 🔲 Run frontend `tsc` + `lint` + `build` until 3× green
4. 🔲 `cd backend && npm install`
5. 🔲 Fix login `Login` → `LoginDto` parameter name
6. 🔲 Fix all `.toNumber()` → `Number(...)` in seed + services
7. 🔲 Add mkdir uploads in main.ts
8. 🔲 `npx prisma generate` → `tsc --noEmit` → fix any TS issues → `npm run build` green
9. 🔲 Start DB locally → migrate dev → seed → hit endpoints
10. 🔲 Start backend with `npm run start:dev` → test login, workers, categories via curl/Postman
11. 🔲 Wrap lib/api server-side fallbacks + update pages to use them
12. 🔲 Wire LoginView + ProApplyView forms to real APIs
13. 🔲 Create missing dashboard pages (customer/worker/admin — 16 pages)
14. 🔲 Wire payments step + callbacks
15. 🔲 Realtime notifications bell + chat pages UI
16. 🔲 Docker builds → compose up full → test
17. 🔲 Railway toml per service + final deployment docs
18. 🔲 Final quality gates (build x2 lint x2 + lightouse)

---

## QUICK REF — LOGIN CREDS (seeded users)
- Admin    → phone: +9779800000000   pw: Admin@123
- Worker   → phone: +9779810000001   pw: Worker@123
- Customer → phone: +9779830000001   pw: Customer@123

## KEY FILES TO ACCESS FIRST
- Backend entry:  `backend/src/main.ts` → `app.module.ts`
- Frontend entry: `app/layout.tsx` → `app/page.tsx`
- API client:     `lib/api.ts`       (already typed, all endpoints ready)
- Realtime:       `lib/realtime.ts`  (useRealtime hook + SewaLinkRealtime class)
- Prisma schema:  `backend/prisma/schema.prisma`  (20+ tables)
- Seed data:      `backend/prisma/seed.ts`         (Nepal-realistic 24w/30c/60b)
- Design system:  `app/globals.css`, `tailwind.config.ts`
- Reusable UI:    `components/Header.tsx`, `Footer.tsx`, `InfoPageShell.tsx`, `WorkerCard.tsx`, `VerifiedStamp.tsx`

End of audit.
