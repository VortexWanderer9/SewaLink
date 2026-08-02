You are a senior full-stack engineer taking over an existing Sewalink Nepal marketplace project.

Your mission:
Transform the current codebase into a fully working MVP prototype that can be deployed from GitHub to Railway and tested end-to-end.

IMPORTANT:
- Do NOT rebuild the project.
- Keep the existing Next.js + NestJS + Prisma architecture.
- Reuse existing models, APIs, and components wherever possible.
- Simplify unfinished production features instead of overengineering.
- The goal is a working marketplace prototype, not enterprise security.

==================================================
MAIN MVP GOAL
==================================================

A user should be able to:

Customer:
1. Open website
2. Create account
3. Login
4. Browse available workers
5. View worker profile
6. Create booking request
7. Track booking status


Worker:
1. Create account
2. Login
3. Create worker profile
4. Add:
   - category
   - skills
   - description
   - location
   - price
   - availability

5. Become visible in marketplace
6. Receive booking requests
7. Accept booking
8. Complete booking


Owner/Admin:
1. Login
2. View dashboard
3. See:
   - total users
   - total workers
   - available workers
   - total bookings

==================================================
PHASE 1 — CLEAN CURRENT IMPLEMENTATION
==================================================

First analyze the existing code.

Identify:

- Working features
- Broken features
- Mock features
- Unused features

Do not remove working architecture.

Temporarily disable or simplify:

- Google login
- OTP verification
- Online payment gateways
- Chat
- Notifications
- Advanced verification

Focus only on the MVP flow.

==================================================
PHASE 2 — SIMPLE AUTHENTICATION
==================================================

Implement simple prototype authentication.

Requirements:

Customer registration:

Fields:
- name
- email
- password

Worker registration:

Fields:
- name
- phone or email
- password

Store users in PostgreSQL.

User roles:

CUSTOMER
WORKER
ADMIN


Required:

- Register API
- Login API
- Logout
- Protected dashboard access


Do not spend time on:

- refresh token rotation
- OAuth
- OTP
- advanced session security

The priority:
A user can create an account and login successfully.

==================================================
PHASE 3 — FIX WORKER SYSTEM
==================================================

Fix all worker ID problems.

Use one consistent identifier:

WorkerProfile.id

Verify:

Worker listing
        ↓
Worker card
        ↓
Worker profile page
        ↓
Booking


All must use the same ID.

Implement worker profile creation.

Worker can edit:

- profile image
- category
- skills
- description
- location
- price
- availability


Customer should only see:

available workers.

==================================================
PHASE 4 — CUSTOMER MARKETPLACE
==================================================

Remove fake worker data.

All workers must come from backend database.

Create working pages:

/
workers
worker/[id]
dashboard


Worker cards should show:

- name
- category
- skills
- location
- price
- available status


==================================================
PHASE 5 — SIMPLE BOOKING SYSTEM
==================================================

Implement MVP booking.

Customer:

Select worker
        ↓
Create booking


Booking status:

REQUESTED

Worker:

Accept booking

Status:

ACCEPTED

Worker completes service:

COMPLETED


Customer can see:

- current bookings
- booking history


Worker can see:

- incoming requests
- accepted jobs
- completed jobs


Use cash payment only.

Payment status:

UNPAID
CASH_PAID


Do not implement online payment.

==================================================
PHASE 6 — ADMIN DASHBOARD
==================================================

Create simple owner dashboard.

Show:

Total users

Total workers

Available workers

Total bookings


Use real database counts.

==================================================
PHASE 7 — DATABASE
==================================================

Review Prisma schema.

Keep existing schema if possible.

Only change when required.

Verify:

User
WorkerProfile
Booking

relations work correctly.

Create migrations.

Ensure Railway PostgreSQL can initialize successfully.

==================================================
PHASE 8 — RAILWAY DEPLOYMENT
==================================================

The final project must deploy from GitHub.

Create correct deployment setup.

Requirements:

Frontend:
- Railway service
- correct build command
- correct start command

Backend:
- Railway service
- correct root directory
- Prisma generate
- Prisma migrate deploy
- NestJS start


Fix:

- CORS
- environment variables
- API URLs
- health check


Required environment variables:

DATABASE_URL

JWT_SECRET

NEXT_PUBLIC_API_URL


==================================================
PHASE 9 — END TO END TEST
==================================================

Before finishing verify:

TEST 1:

Create customer account

Login

Browse workers


TEST 2:

Create worker account

Login

Create profile

Set available=true


TEST 3:

Customer sees worker

Open worker profile


TEST 4:

Customer creates booking


TEST 5:

Worker accepts booking


TEST 6:

Worker completes booking


TEST 7:

Admin dashboard shows:

- users
- workers
- bookings


==================================================
FINAL DELIVERY REPORT
==================================================

After completing changes provide:

1. Features completed
2. Features disabled
3. Files changed
4. Database changes
5. API changes
6. Railway deployment steps
7. Required environment variables
8. How to test the application
9. Remaining limitations

Remember:

The final output should be a working Railway-hosted Sewalink Nepal MVP prototype.

Do not optimize for production complexity.
Optimize for a complete working user journey.