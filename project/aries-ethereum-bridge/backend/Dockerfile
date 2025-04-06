FROM node:18

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Install Solidity compiler
RUN npm install solc@0.8.17

# Expose the backend port
EXPOSE 3001

# Start the backend server
CMD ["node", "server.js"]