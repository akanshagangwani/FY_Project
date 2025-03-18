import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/aries-ethereum',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
  ARIES_ADMIN_URL: process.env.ARIES_ADMIN_URL || 'http://aries-agent:8010',
  ARIES_ADMIN_API_KEY: process.env.ARIES_ADMIN_API_KEY || '',
  BRIDGE_URL: process.env.BRIDGE_URL || 'http://ethereum-bridge:3000'
};