# Use the official Bun image as the base
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy package manifests and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy project files
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Compile CSS in the meantime
RUN bun run build:css

# Production runner stage
FROM oven/bun:1 AS runner
WORKDIR /app

# Set default port
ENV PORT=3030

# Set default production environment variables
# DB_MODE is set to sqlite by default. Choose one: sqlite, postgresql, libsql
# DB_URL is set to file:./database/dev.db by default. Change it to your database URL if using postgresql or libsql
ENV NODE_ENV=production \
    PORT=${PORT} \
    HOST=0.0.0.0 \
    DB_MODE=sqlite \
    DB_URL=file:./database/dev.db
    
# Copy built application and dependencies from builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Expose server port
EXPOSE ${PORT}

# Start the application
CMD ["bun", "src/index.ts"]
