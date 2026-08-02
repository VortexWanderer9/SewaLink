# ================================
# SewaLink Backend
# ================================
FROM node:20-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --include=dev --ignore-scripts=false

FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY --from=backend-deps /app/backend/node_modules ./node_modules
COPY backend/ ./
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS backend-prod-deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --omit=dev

FROM node:20-alpine AS backend
ENV NODE_ENV=production
WORKDIR /app/backend
COPY --from=backend-prod-deps /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=backend-builder /app/backend/package.json ./
COPY --from=backend-builder /app/backend/package-lock.json ./
RUN mkdir -p uploads
EXPOSE 3001
CMD ["node", "dist/main.js"]

# ================================
# SewaLink Frontend (Next.js)
# ================================
FROM node:20-alpine AS frontend-deps
WORKDIR /app/frontend
COPY package.json package-lock.json* ./
RUN npm ci --include=dev --ignore-scripts=false

FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY --from=frontend-deps /app/frontend/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS frontend
ENV NODE_ENV=production
WORKDIR /app/frontend
COPY --from=frontend-deps /app/frontend/node_modules ./node_modules
COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/package.json ./
COPY --from=frontend-builder /app/frontend/next.config.mjs ./
COPY --from=frontend-builder /app/frontend/tailwind.config.ts ./
COPY --from=frontend-builder /app/frontend/postcss.config.mjs ./
EXPOSE 3000
CMD ["npm", "run", "start"]
