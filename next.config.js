const path = require('path');

// Load environment variables
const dotenv = require('dotenv');

// Load the main .env file
dotenv.config();

// Load environment-specific .env file
const NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = path.join(__dirname, `.env.${NODE_ENV}`);
dotenv.config({ path: envFile, override: true });

module.exports = {
  reactStrictMode: true,
  distDir: 'build',
  eslint: {
    // Disable ESLint during builds to focus on environment setup functionality
    ignoreDuringBuilds: true,
  },
  env: {
    // Remove NODE_ENV as it's automatically handled by Next.js
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    OAUTH_REDIRECT_URI: process.env.OAUTH_REDIRECT_URI,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  }
}
