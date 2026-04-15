# Tahap 1: Install dependencies
# Ganti dari 18 ke 20
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Tahap 2: Build aplikasi
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gunakan tanda = agar tidak kena warning LegacyKeyValueFormat
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Tahap 3: Runner (Tahap final yang akan jalan di EC2)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy file yang dibutuhkan
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]