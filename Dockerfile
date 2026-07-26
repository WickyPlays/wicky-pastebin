# Builder stage

# Use the official Bun image as the base
FROM oven/bun:1 AS builder
WORKDIR /app

# Build-time argument.
# Can be overridden using --build-arg when running docker build.
ARG PORT=3030

# These are only placeholder values, and NOT intended to be real production credentials.
ENV PORT=$PORT
ENV DB_MODE=sqlite
ENV DB_URL=file:./database/dev.db
ENV DB_AUTH_TOKEN=""

# Copy package manifests and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy project files
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Compile CSS
RUN bun run build:css

# Production runner stage
FROM oven/bun:1 AS runner
WORKDIR /app

# Default runtime configuration.
# These values may be overridden using `docker run -e ...`
ARG PORT=3030

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=$PORT \
    DB_MODE=sqlite \
    DB_URL=file:./database/dev.db

# Ensure the SQLite directory exists.
RUN mkdir -p database

# Copy the application from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Start the application
CMD ["bun", "src/index.ts"]