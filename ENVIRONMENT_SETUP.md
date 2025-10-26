# Environment Configuration Guide

This document explains how to use the environment configuration system for the reciclapp project, which allows easy switching between development and production environments.

## Overview

The environment system provides:
- **Separate Firebase/Firestore databases** for development and production
- **Environment-aware API URLs** and deployment configurations
- **Collection name prefixing** to separate development data from production data
- **Easy switching** between environments via configuration files and scripts

## Environment Files

The project uses the following environment configuration files:

- `.env` - Contains the current environment setting
- `.env.development` - Development environment configuration
- `.env.production` - Production environment configuration

### Development Environment

- **Firebase Project:** `reciclapp-dev-23776`
- **API URL:** `http://localhost:8000`
- **Collection Prefix:** `dev_` (e.g., `dev_users`, `dev_pdr`, `dev_recogida`)
- **Service Account:** `firestore-service-account-dev.json`
- **OAuth Redirect:** `http://localhost:3000`

### Production Environment

- **Firebase Project:** `norse-voice-343214`
- **API URL:** `https://fastapi-dot-norse-voice-343214.uc.r.appspot.com`
- **Collection Prefix:** None (e.g., `users`, `pdr`, `recogida`)
- **Service Account:** `firestore-service-account.json`
- **OAuth Redirect:** `https://sabanayegua.reciclaplus.com`

## Switching Environments

### Frontend (Next.js)

Use the provided npm scripts to switch environments:

```bash
# Switch to development environment
npm run switch-env development

# Switch to production environment
npm run switch-env production

# Run development server in development mode
npm run dev:development

# Run development server in production mode
npm run dev:production

# Build for development environment
npm run build:development

# Build for production environment
npm run build:production
```

### Backend (FastAPI)

Use the Python script to switch environments:

```bash
# Navigate to the FastAPI directory
cd fast_api

# Switch to development environment
python switch_env.py development

# Switch to production environment
python switch_env.py production
```

## Configuration Files

### Frontend Configuration (`config/environment.js`)

This module provides centralized configuration management:

```javascript
import config from './config/environment.js';

// Access environment-specific settings
const apiUrl = config.apiUrl;
const isDev = config.isDevelopment();
const collectionName = config.getCollectionName('users');
```

### Backend Configuration (`fast_api/config.py`)

The Python configuration module provides:

```python
from .config import config

# Environment-aware settings
firebase_project = config.firebase_project_id
collection_name = config.get_collection_name('users')
is_dev = config.is_development
```

## Database Structure

The system uses collection name prefixing to separate development and production data:

### Development Collections
- `dev_users` - User accounts and permissions
- `dev_pdr` - Puntos de Reciclaje (recycling points)
- `dev_recogida` - Collection data
- `dev_weight` - Weight measurements
- `dev_pdr_logs` - Activity logs

### Production Collections
- `users` - User accounts and permissions
- `pdr` - Puntos de Reciclaje (recycling points)
- `recogida` - Collection data
- `weight` - Weight measurements
- `pdr_logs` - Activity logs

## Service Account Files

Ensure you have the appropriate service account files for each environment:

- **Development:** `fast_api/routers/firestore-service-account-dev.json`
- **Production:** `fast_api/routers/firestore-service-account.json`

## OAuth Configuration

Different OAuth redirect URIs are used for each environment:

- **Development:** `http://localhost:3000`
- **Production:** `https://sabanayegua.reciclaplus.com`

Ensure your OAuth client configuration in Google Cloud Console includes the appropriate redirect URIs for both environments.

## Best Practices

1. **Always develop in development mode** to avoid affecting production data
2. **Test thoroughly in development** before switching to production mode
3. **Keep service account files secure** and never commit them to version control
4. **Use environment-aware collection names** in all database operations
5. **Restart servers** after switching environments to ensure changes take effect

## Troubleshooting

### Environment Not Switching

If the environment doesn't seem to switch properly:

1. Check that the `.env` file contains the correct `NODE_ENV` value
2. Restart your development servers (both frontend and backend)
3. Verify that the environment-specific files (`.env.development`, `.env.production`) exist

### Database Connection Issues

If you can't connect to the database:

1. Verify the service account file exists and has the correct permissions
2. Check that the Firebase project ID is correct for your environment
3. Ensure your Firebase project has Firestore enabled

### Collection Not Found

If collections are not found:

1. Verify you're using the correct environment
2. Check that data exists in the expected collections (with or without `dev_` prefix)
3. Ensure the collection naming logic is applied consistently

## Integration with CI/CD

For deployment pipelines, set the environment before building:

```bash
# For development deployment
npm run switch-env development
npm run build

# For production deployment
npm run switch-env production
npm run build
```

This ensures the correct configuration is built into the application.