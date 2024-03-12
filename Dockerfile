# Stage 1: install dependencies
FROM node:lts-alpine AS deps
WORKDIR /app
COPY client/package*.json .
RUN npm i

# Stage 2: build
FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY client/ .
ARG NODE_ENV=production
RUN npm run build

# Stage 3: run
FROM gcr.io/distroless/nodejs18-debian11
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
CMD ["server.js"]