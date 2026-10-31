FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY src/ ./src/
COPY swagger.yaml ./
COPY .env.example ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
