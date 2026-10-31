FROM node:20-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for nodemon)
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY swagger.yaml ./
COPY .env.example ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
