#!/usr/bin/env node

/**
 * Environment Switcher Script
 * 
 * This script allows easy switching between development and production environments
 * by updating the NODE_ENV variable in the .env file.
 */

const fs = require('fs');
const path = require('path');

const environment = process.argv[2];

if (!environment || !['development', 'production', 'stage'].includes(environment)) {
  console.error('Usage: npm run switch-env <development|production|stage>');
  console.error('Example: npm run switch-env development');
  process.exit(1);
}

const envPath = path.join(__dirname, '..', '.env');
const envContent = `# Environment Configuration\nNODE_ENV=${environment}\n`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Environment switched to: ${environment}`);
  console.log(`📁 Updated .env file with NODE_ENV=${environment}`);

  if (environment === 'development') {
    console.log('🔧 Development mode:');
    console.log('   - API URL: http://localhost:8000');
    console.log('   - Firebase Project: reciclapp-dev-23776');
  } else if (environment === 'stage') {
    console.log('🎭 Stage mode:');
    console.log('   - API URL: https://api-dev-dot-norse-voice-343214.uc.r.appspot.com');
    console.log('   - App URL: https://reciclapp-dev-dot-norse-voice-343214.uc.r.appspot.com');
    console.log('   - Firebase Project: norse-voice-343214 (production)');
  } else {
    console.log('🚀 Production mode:');
    console.log('   - API URL: https://fastapi-dot-norse-voice-343214.uc.r.appspot.com');
    console.log('   - Firebase Project: norse-voice-343214');
  }

  console.log('\nℹ️  Restart your development server to apply changes.');
} catch (error) {
  console.error('❌ Error updating environment:', error.message);
  process.exit(1);
}