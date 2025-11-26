#!/usr/bin/env node

/**
 * Environment Switcher Script
 * 
 * This script switches the environment by updating NODE_ENV in .env file,
 * then displays the configuration from .env.{environment}.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const environment = process.argv[2];

if (!environment || !['development', 'production', 'stage'].includes(environment)) {
  console.error('Usage: npm run switch-env <development|production|stage>');
  console.error('Example: npm run switch-env development');
  process.exit(1);
}

const rootDir = path.join(__dirname, '..');
const envFilePath = path.join(rootDir, `.env.${environment}`);
const mainEnvPath = path.join(rootDir, '.env');

try {
  // Check if environment-specific file exists
  if (!fs.existsSync(envFilePath)) {
    console.error(`❌ Environment file not found: .env.${environment}`);
    process.exit(1);
  }

  // Update NODE_ENV in .env file
  const envContent = `# Environment Configuration\nNODE_ENV=${environment}\n`;
  fs.writeFileSync(mainEnvPath, envContent);

  console.log(`✅ Environment switched to: ${environment}`);
  console.log(`📁 Updated .env with NODE_ENV=${environment}`);

  // Read and parse the environment-specific file using dotenv
  const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

  // Display environment-specific configuration
  const icons = {
    'development': '🔧',
    'stage': '🎭',
    'production': '🚀'
  };

  console.log(`${icons[environment]} ${environment.charAt(0).toUpperCase() + environment.slice(1)} configuration:`);

  if (envConfig.NEXT_PUBLIC_API_URL) {
    console.log(`   - API URL: ${envConfig.NEXT_PUBLIC_API_URL}`);
  }

  if (envConfig.OAUTH_REDIRECT_URI) {
    console.log(`   - App URL: ${envConfig.OAUTH_REDIRECT_URI}`);
  }

  if (envConfig.FIREBASE_PROJECT_ID) {
    console.log(`   - Firebase Project: ${envConfig.FIREBASE_PROJECT_ID}`);
  }

  if (envConfig.FIRESTORE_DATABASE_ID) {
    console.log(`   - Firestore Database: ${envConfig.FIRESTORE_DATABASE_ID}`);
  }

  if (envConfig.ALLOWED_ORIGINS) {
    console.log(`   - CORS Origins: ${envConfig.ALLOWED_ORIGINS}`);
  }

  console.log(`\nℹ️  Set NODE_ENV=${environment} and restart your server to use this configuration.`);
} catch (error) {
  console.error('❌ Error reading environment:', error.message);
  process.exit(1);
}