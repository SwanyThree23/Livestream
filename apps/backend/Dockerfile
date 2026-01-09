# SwanyThree Ultimate - Backend Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Base
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Stage 2: Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 3: Development dependencies
FROM base AS dev-deps
COPY package*.json ./
RUN npm ci

# Stage 4: Production
FROM base AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "src/index.js"]

# Stage 5: Development
FROM dev-deps AS development

# Copy application code
COPY . .

# Expose port
EXPOSE 3001

# Start with nodemon for development
CMD ["npm", "run", "dev"]
