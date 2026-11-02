FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and .env
COPY src/ ./src/

# Copy tests
COPY tests/ ./tests/

# Copy swagger
COPY swagger.yaml ./
COPY .env ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
