# Builder stage

# Use the official Bun image as the base
FROM oven/bun:1 AS builder
WORKDIR /app

# Build-time arguments with default values.
# These can be overridden using --build-arg when running docker build.
ARG PORT=3030
ARG DB_MODE=sqlite
ARG DB_URL=file:./database/dev.db
# If selected libsql in DB_MODE, you can provide DB_AUTH_TOKEN while building
ARG DB_AUTH_TOKEN=""

# Make the build arguments available as environment variables.
# Prisma generate requires DB_URL to exist during the build stage.
ENV PORT=$PORT
ENV DB_MODE=$DB_MODE
ENV DB_URL=$DB_URL

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

# Build-time arguments (used to initialize default runtime values)
ARG PORT=3030
ARG DB_MODE=sqlite
ARG DB_URL=file:./database/dev.db

# Default production environment variables.
# These may still be overridden with `docker run -e ...`
ENV NODE_ENV=production \
    PORT=$PORT \
    HOST=0.0.0.0 \
    DB_MODE=$DB_MODE \
    DB_URL=$DB_URL

# Copy the built application and dependencies from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Expose the application port
EXPOSE $PORT

# Start the application
CMD ["bun", "src/index.ts"]