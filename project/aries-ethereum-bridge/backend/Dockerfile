FROM node:16

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Then copy everything else
COPY . .

EXPOSE 3001

# Use the correct entry point for your Node.js app
CMD ["node", "server.js"]