FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

# Copy package files and install dependencies
COPY package*.json ./                
RUN npm ci

# Copy source and build
COPY . .
# Ensure tsc in node_modules is executable and run the TypeScript compiler via npx
# Some environments may produce a non-executable bin; chmod is a safe no-op if permissions are already correct.
RUN chmod -R a+rx node_modules/.bin || true
RUN npx tsc -p tsconfig.json

# Production image
FROM node:20-alpine
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --production

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# (Optional) copy other necessary runtime files like views/public if needed
# COPY --from=builder /app/public ./public

# Expose default Nest port
EXPOSE 3000

# Use non-root user if desired (optional)
# RUN addgroup -S app && adduser -S -G app app
# USER app

CMD ["node", "dist/main.js"]
