# SewaLink Nepal - Task List

## Overview
This document tracks all tasks needed to complete the SewaLink Nepal project, a service marketplace connecting customers with skilled workers in Nepal.

## Project Status
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Deployment**: Railway (target)

---

## ✅ Completed Tasks

### Task #1: Initial Setup
- ✅ Project structure created
- ✅ Backend NestJS application initialized
- ✅ Frontend Next.js application initialized
- ✅ Prisma schema defined
- ✅ Database migrations created
- ✅ Authentication system implemented (JWT + HTTP-only cookies)
- ✅ Docker configuration added

### Task #2: Backend API Development
- ✅ Authentication endpoints (register, login, logout, refresh)
- ✅ User management endpoints
- ✅ Category management endpoints
- ✅ Worker profile endpoints
- ✅ Booking management endpoints
- ✅ Payment gateway integrations (eSewa, Khalti, IME Pay)
- ✅ Review system endpoints
- ✅ Notification system endpoints
- ✅ Address management endpoints
- ✅ Document upload endpoints
- ✅ Earnings and payout endpoints
- ✅ Favorites endpoints
- ✅ Chat system endpoints
- ✅ Audit logging system
- ✅ Admin dashboard endpoints

### Task #3: Frontend API Integration
- ✅ Removed all mock data from frontend
- ✅ Connected all pages to real backend APIs
- ✅ API client library with typed interfaces
- ✅ Authentication context and session management
- ✅ Loading, error, and empty states across all pages
- ✅ Build passes successfully
- ✅ TypeScript passes successfully

### Task #4: Customer Dashboard
- ✅ Customer Dashboard page (`/dashboard`)
  - Overview with stats (total bookings, total spent, favorites)
  - Pending bookings list
  - Quick actions (book service, view favorites)
  - Sidebar navigation
- ✅ Customer Bookings page (`/dashboard/bookings`)
  - Status filtering (ALL, PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
  - Pagination (10 items per page)
  - Color-coded status badges
  - Loading and error states
- ✅ Customer History page (`/dashboard/history`)
  - Completed bookings with reviews
  - Pagination with load more functionality
  - Empty state with call-to-action
- ✅ Favorites page (`/dashboard/favorites`)
  - View favorite workers
  - Remove favorite functionality
  - Book now button for each favorite
  - Empty state with browse link
- ✅ Addresses page (`/dashboard/addresses`)
  - View saved addresses
  - Add new address form with validation
  - Set default address functionality
  - Remove address functionality
  - Loading and error states

### Task #5: Worker Dashboard
- ✅ Worker Dashboard page (`/worker-dashboard`)
  - Overview with stats (total jobs, rating, reviews, earnings)
  - Online/offline toggle functionality
  - Active bookings list
  - Quick actions (update profile, view bookings)
  - Sidebar navigation
- ✅ Worker Profile page (`/worker-dashboard/profile`)
  - View and edit profile information
  - Form validation for price and location
  - Performance stats display
  - Loading and error states
- ✅ Worker Bookings page (`/worker-dashboard/bookings`)
  - Status filtering (ALL, PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
  - Pagination (10 items per page)
  - Color-coded status badges
  - Loading and error states
- ✅ Worker Earnings page (`/worker-dashboard/earnings`)
  - Earnings summary (total, available balance, pending)
  - Request payout functionality
  - Payout history with pagination
  - Loading and error states

---

## 🚧 Current Issues Blocking Progress

### Issue #1: Backend Database Schema Constraint
**Status**: In Progress  
**Priority**: Critical

**Problem**: 
- The `AuditLog` table has a foreign key constraint on `entityId` that references `Booking.id`
- This constraint is causing audit log creation to fail when `entityId` is null or references a non-booking entity
- Login attempts fail with `Foreign key constraint violated: AuditLog_entityId_fkey`
- Duplicate refresh token errors on repeated login attempts

**Steps Taken**:
- ✅ Removed the problematic foreign key constraint from the database
- ✅ Updated Prisma schema to make the `entityId` foreign key optional
- ✅ Created migration to fix the schema
- ⏳ Need to clear existing refresh tokens to prevent duplicate errors

**Remaining Steps**:
1. Clear existing refresh tokens from database
2. Test login functionality
3. Verify audit logging works correctly
4. Test all authentication flows

### Issue #2: Database Connection Configuration
**Status**: Resolved  
**Priority**: Critical

**Problem**:
- Backend could not connect to PostgreSQL due to incorrect credentials
- Default `postgres:postgres` credentials did not match the running Docker container

**Resolution**:
- ✅ Identified correct credentials (`user:password`)
- ✅ Updated `.env` file with correct DATABASE_URL
- ✅ Successfully ran `npx prisma migrate deploy`
- ✅ Successfully ran `npx prisma db seed`
- ✅ Backend now starts successfully

---

## 📋 Remaining Tasks

### Task #6: Backend Fix & Testing
**Status**: In Progress  
**Priority**: Critical

**Subtasks**:
- [ ] Clear existing refresh tokens from database
- [ ] Test `/health` endpoint
- [ ] Test customer login API
- [ ] Test worker login API
- [ ] Test customer dashboard APIs
  - [ ] `GET /customers/me/dashboard`
  - [ ] `GET /customers/me/history`
  - [ ] `GET /bookings/me`
  - [ ] `GET /favorites`
  - [ ] `GET /addresses`
  - [ ] `POST /addresses`
  - [ ] `PATCH /addresses/:id/default`
  - [ ] `DELETE /addresses/:id`
- [ ] Test worker dashboard APIs
  - [ ] `GET /workers/me/profile`
  - [ ] `PUT /workers/me/profile`
  - [ ] `PATCH /workers/me/online`
  - [ ] `GET /workers/me/bookings`
  - [ ] `GET /workers/me/earnings`
  - [ ] `GET /earnings/me/payouts`
  - [ ] `POST /earnings/me/request`
- [ ] Verify all endpoints return correct data
- [ ] Check backend logs for errors
- [ ] Fix any runtime bugs found during testing

### Task #7: Railway Deployment Preparation
**Status**: Pending  
**Priority**: High

**Subtasks**:
- [ ] Update Railway configuration with correct database URL
- [ ] Configure Railway environment variables
- [ ] Set up Railway PostgreSQL database
- [ ] Run migrations on Railway database
- [ ] Seed Railway database with initial data
- [ ] Test backend deployment on Railway
- [ ] Test frontend deployment on Railway
- [ ] Verify API connectivity between frontend and backend on Railway
- [ ] Update `RAILWAY_SETUP.md` with any new instructions

### Task #8: Frontend Testing
**Status**: Pending  
**Priority**: High

**Subtasks**:
- [ ] Start frontend with backend running
- [ ] Test customer registration flow
- [ ] Test customer login flow
- [ ] Test customer dashboard navigation
- [ ] Test customer bookings page
- [ ] Test customer history page
- [ ] Test favorites add/remove
- [ ] Test address CRUD operations
- [ ] Test worker registration flow
- [ ] Test worker login flow
- [ ] Test worker dashboard navigation
- [ ] Test worker profile update
- [ ] Test worker bookings page
- [ ] Test worker earnings page
- [ ] Test online/offline toggle
- [ ] Check browser console for errors
- [ ] Verify responsive design on mobile

### Task #9: Payments Integration (Skipped per User Request)
**Status**: Skipped  
**Priority**: N/A

**Note**: User requested to skip payments and admin dashboard for now.

### Task #10: Admin Dashboard (Skipped per User Request)
**Status**: Skipped  
**Priority**: N/A

**Note**: User requested to skip payments and admin dashboard for now.

---

## 🔧 Technical Notes

### Database Configuration
- **Local Development**: Uses existing PostgreSQL container (`ai-studyos-postgres-1`)
- **Credentials**: `user:password@localhost:5432/sewalink`
- **Migrations**: Located in `backend/prisma/migrations/`
- **Seed**: Located in `backend/prisma/seed.ts`

### API Base URL
- **Local**: `http://localhost:3001/api/v1`
- **Railway**: Will be configured during deployment

### Authentication
- **Method**: JWT with HTTP-only cookies
- **Access Token**: 15 minutes expiration
- **Refresh Token**: 30 days expiration
- **Cookie Domain**: Configurable via `COOKIE_DOMAIN` env var

### Key Files
- **Backend**: `/home/tyrell-wellick/Documents/Projects/sewalink-nepal/backend/`
- **Frontend**: `/home/tyrell-wellick/Documents/Projects/sewalink-nepal/`
- **Docker**: `/home/tyrell-wellick/Documents/Projects/sewalink-nepal/docker-compose.yml`
- **Railway Config**: `/home/tyrell-wellick/Documents/Projects/sewalink-nepal/backend/railway.json`

---

## 📝 Test Credentials (from seed)

### Admin
- Phone: `+9779800000000`
- Password: `Admin@123`

### Worker
- Phone: `+9779810000001`
- Password: `Worker@123`

### Customer
- Phone: `+9779830000000`
- Password: `Customer@123`

---

## 🚀 Next Steps

1. **Immediate**: Clear refresh tokens and test login API
2. **Short-term**: Complete backend API testing
3. **Medium-term**: Deploy to Railway
4. **Long-term**: Add payments and admin dashboard (when requested)

---

## 📊 Progress Summary

- **Total Tasks**: 10
- **Completed**: 5 (50%)
- **In Progress**: 1 (10%)
- **Pending**: 3 (30%)
- **Skipped**: 1 (10%)

**Overall Progress**: 60% complete
