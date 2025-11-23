# Environment Configuration Guide

This document explains how to use the environment configuration system for the reciclapp project, which allows easy switching between development, stage, and production environments.

## Overview

The environment system provides:
- **Separate Firebase/Firestore databases** for development and production/stage
- **Environment-aware API URLs** and deployment configurations
- **Collection name prefixing** to separate development data from production/stage data
- **Easy switching** between environments via configuration files and scripts

## Environment Files

The project uses the following environment configuration files:

- `.env` - Contains the current environment setting
- `.env.development` - Development environment configuration
- `.env.stage` - Stage environment configuration
- `.env.production` - Production environment configuration

### Development Environment

- **Firebase Project:** `reciclapp-dev-23776`
- **API URL:** `http://localhost:8000`
- **Collection Prefix:** `dev_` (e.g., `dev_users`, `dev_pdr`, `dev_recogida`)
- **Service Account:** `firestore-service-account-dev.json`
- **OAuth Redirect:** `http://localhost:3000`

### Stage Environment

- **Firebase Project:** `norse-voice-343214` (same as production)
- **Frontend URL:** `https://reciclapp-dev-dot-norse-voice-343214.uc.r.appspot.com`
- **API URL:** `https://api-dev-dot-norse-voice-343214.uc.r.appspot.com`
- **Collection Prefix:** None (e.g., `users`, `pdr`, `recogida`)
- **Service Account:** `firestore-service-account.json` (same as production)
- **OAuth Redirect:** `https://reciclapp-dev-dot-norse-voice-343214.uc.r.appspot.com`
- **Purpose:** Replicate production environment for testing before deploying to production

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

# Switch to stage environment
npm run switch-env stage

# Switch to production environment
npm run switch-env production

# Run development server in development mode
npm run dev:development

# Run development server in stage mode
npm run dev:stage

# Run development server in production mode
npm run dev:production

# Build for development environment
npm run build:development

# Build for stage environment
npm run build:stage

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

# Switch to stage environment
python switch_env.py stage

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
- **Production/Stage:** `fast_api/routers/firestore-service-account.json` (shared between stage and production)

## OAuth Configuration

Different OAuth redirect URIs are used for each environment:

- **Development:** `http://localhost:3000`
- **Stage:** `https://reciclapp-dev-dot-norse-voice-343214.uc.r.appspot.com`
- **Production:** `https://sabanayegua.reciclaplus.com`

Ensure your OAuth client configuration in Google Cloud Console includes the appropriate redirect URIs for all environments.

## Deployment

### Deploying to Stage Environment

The stage environment allows you to test in a production-like environment before deploying to production. 

#### Quick Deploy (Both Apps)

To deploy both the Next.js frontend and FastAPI backend to stage with a single command:

```bash
./deploy-stage.sh
```

This script will:
1. Switch both apps to stage environment
2. Deploy the FastAPI backend to the `api-dev` service
3. Build and deploy the Next.js frontend to the `reciclapp-dev` service

#### Manual Deploy

If you prefer to deploy each app separately:

**Deploy FastAPI Backend:**
```bash
cd fast_api
python switch_env.py stage
gcloud app deploy app-stage.yaml
```

**Deploy Next.js Frontend:**
```bash
npm run switch-env stage
npm run build
gcloud app deploy app-stage.yaml
```

### Deploying to Production Environment

**Deploy FastAPI Backend:**
```bash
cd fast_api
python switch_env.py production
gcloud app deploy app.yaml
```

**Deploy Next.js Frontend:**
```bash
npm run switch-env production
npm run build
gcloud app deploy app.yaml
```

Or use the existing shortcut:
```bash
npm run deploy
```

## Best Practices

1. **Always develop in development mode** to avoid affecting production/stage data
2. **Test in stage environment** before deploying to production to replicate production conditions
3. **Keep service account files secure** and never commit them to version control
4. **Use environment-aware collection names** in all database operations
5. **Restart servers** after switching environments to ensure changes take effect
6. **Stage uses production Firebase project** - be aware that stage shares the same database as production

## Troubleshooting

### Environment Not Switching

If the environment doesn't seem to switch properly:

1. Check that the `.env` file contains the correct `NODE_ENV` value
2. Restart your development servers (both frontend and backend)
3. Verify that the environment-specific files (`.env.development`, `.env.stage`, `.env.production`) exist

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

# For stage deployment
npm run switch-env stage
npm run build
gcloud app deploy app-stage.yaml

# For production deployment
npm run switch-env production
npm run build
gcloud app deploy app.yaml
```

This ensures the correct configuration is built into the application.