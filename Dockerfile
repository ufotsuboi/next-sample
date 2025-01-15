# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY . .

RUN npx prisma generate

# Build the Next.js application in standalone mode
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only the necessary files for standalone execution
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose the port Cloud Run listens on
ENV PORT=8080
EXPOSE 8080

# Run the standalone server.js
CMD ["node", "server.js"]
