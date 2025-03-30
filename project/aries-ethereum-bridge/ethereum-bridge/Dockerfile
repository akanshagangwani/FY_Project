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
# This path assumes the Dockerfile is being built with context at the root project directory
COPY smart\ contracts/contracts/CredentialStore.sol src/contracts/

EXPOSE 3000

CMD ["node", "src/bridge.js"]