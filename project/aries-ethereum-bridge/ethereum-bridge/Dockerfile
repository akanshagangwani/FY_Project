FROM node:16

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Then copy everything else
COPY . .

# Create contracts directory
RUN mkdir -p src/contracts

# Copy smart contract



EXPOSE 3000

CMD ["node", "src/bridge.js"]