# Railway Deployment Setup

## Service Configuration

### FRONTEND SERVICE:
- Root Directory: /
- Build Command: npm ci && npm run build
- Start Command: npm run start
- Port: 3000

### BACKEND SERVICE:
- Root Directory: /backend
- Build Command: npm ci && npx prisma generate && npm run build
- Start Command: npx prisma migrate deploy && node dist/main.js
- Port: 3001

### POSTGRES:
- Provision via Railway Marketplace "Postgres"
- Set BACKEND DATABASE_URL from the Postgres service using Reference Variables

## Environment Variables

### Frontend Variables
```
NEXT_PUBLIC_APP_URL=https://${{RAILWAY_STATIC_URL}}
NEXT_PUBLIC_API_URL=https://${{BACKEND_RAILWAY_STATIC_URL}}/api/v1
```

### Backend Variables
```
NODE_ENV=production
PORT=3001
DATABASE_URL=${{DATABASE_URL}}

# JWT - auto-generate strong values in Railway dashboard
JWT_SECRET=change-me-to-32-char-random-string
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change-me-to-another-32-char
JWT_REFRESH_EXPIRES_IN=30d

# Production CORS - your frontend domain
CORS_ORIGIN=https://${{RAILWAY_STATIC_URL}}

# Cookie configuration for Railway
COOKIE_DOMAIN=

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Payment gateways (live credentials)
ESEWA_MERCHANT_ID=your-live-esewa-id
ESEWA_SECRET_KEY=your-live-esewa-secret
ESEWA_BASE_URL=https://esewa.com.np

KHALTI_PUBLIC_KEY=your-live-khalti-public
KHALTI_SECRET_KEY=your-live-khalti-secret
KHALTI_BASE_URL=https://khalti.com/api/v2

IMEPAY_MERCHANT_ID=your-live-imepay-id
IMEPAY_SECRET_KEY=your-live-imepay-secret
IMEPAY_BASE_URL=https://app.imepay.com.np/api/v1
```

## Railway Reference Variables

When setting up the backend service, use these reference variables:

- `DATABASE_URL` - Reference the PostgreSQL service
- `BACKEND_RAILWAY_STATIC_URL` - Reference the backend service itself for frontend API URL
- `RAILWAY_STATIC_URL` - Reference the frontend service itself

## Deployment Steps

1. Create a new PostgreSQL service in Railway
2. Create a backend service with the backend directory
3. Set the DATABASE_URL reference variable to point to the PostgreSQL service
4. Configure all environment variables as shown above
5. Deploy the backend service
6. Create a frontend service with the root directory
7. Set the NEXT_PUBLIC_API_URL to reference the backend service
8. Deploy the frontend service
