FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY src/ ./src/
COPY swagger.yaml ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
CMD ["node", "src/server.js"]
