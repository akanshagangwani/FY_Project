FROM --platform=linux/arm64 node:16

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Then copy everything else (prevents reinstalling dependencies if only code changes)
COPY . .

EXPOSE 3000

CMD ["node", "src/bridge.js"]