# Use a lightweight Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the service code
COPY . .

# Expose the port your service listens on
EXPOSE 6000

# Start the service
CMD ["node", "server.js"]