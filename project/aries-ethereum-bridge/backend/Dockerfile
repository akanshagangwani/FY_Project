FROM node:16

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first
COPY package*.json ./

# Install dependencies (with correct permissions)
RUN npm install

# Alternative: Replace bcrypt with bcryptjs that doesn't need compilation
# RUN npm uninstall bcrypt && npm install bcryptjs

# Then copy everything else
COPY . .

# Set proper permissions and rebuild bcrypt
RUN chmod -R 755 /app/node_modules/.bin \
    && npm rebuild bcrypt --build-from-source

EXPOSE 3001

# Use the correct entry point for your Node.js app
CMD ["node", "server.js"]