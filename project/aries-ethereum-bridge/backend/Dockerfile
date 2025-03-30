FROM node:16

WORKDIR /app

# Copy package files first
COPY package*.json ./

# More aggressively replace bcrypt with bcryptjs in package.json
RUN sed -i 's/"bcrypt"/"bcryptjs"/g' package.json && \
    sed -i 's/"dependencies": {/"dependencies": {\n    "bcryptjs": "^5.0.1",/g' package.json

# Clean install without any existing node_modules
RUN npm cache clean --force && \
    npm install

# Then copy everything else
COPY . .

# Replace bcrypt with bcryptjs in all JavaScript files (both require and import styles)
RUN find . -type f -name "*.js" -exec sed -i 's/require("bcrypt")/require("bcryptjs")/g' {} \; && \
    find . -type f -name "*.js" -exec sed -i "s/require('bcrypt')/require('bcryptjs')/g" {} \; && \
    find . -type f -name "*.js" -exec sed -i "s/import bcrypt from 'bcrypt'/import bcrypt from 'bcryptjs'/g" {} \; && \
    find . -type f -name "*.js" -exec sed -i 's/import bcrypt from "bcrypt"/import bcrypt from "bcryptjs"/g' {} \;

# Final cleanup of any bcrypt remnants
RUN rm -rf node_modules/bcrypt || true

EXPOSE 3001

# Use the correct entry point for your Node.js app
CMD ["node", "server.js"]