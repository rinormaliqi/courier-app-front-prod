# Stage 1: build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (ignore peer dependency conflicts)
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .
EXPOSE 3000

# Build the frontend (for Next.js)
RUN npm run build

# Stage 2: production
FROM node:20-alpine AS production

WORKDIR /app

# Copy only what's needed from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port 3000
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]
