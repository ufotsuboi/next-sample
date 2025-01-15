# 2024-12-11 
# alpine3.21でlibssl/openssl周りのアップデートがあり、prismaが動かないため3.20に固定
# 該当のIssueはこちらなので、解決されたら変更する
# https://github.com/prisma/prisma/issues/25817
FROM node:20-alpine3.20 AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

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
