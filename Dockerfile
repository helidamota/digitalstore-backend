FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code and .env
COPY src/ ./src/
COPY swagger.yaml ./
COPY .env ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/server.js"]
