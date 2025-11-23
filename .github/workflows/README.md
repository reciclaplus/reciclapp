# GitHub Actions Workflows

This directory contains automated workflows for ReciclApp deployment.

## Workflows

### 1. Create Release (`create-release.yml`)
Creates version tags and GitHub releases for frontend and/or API.

**Trigger:** Manual (workflow_dispatch)

**Usage:**
1. Go to Actions → Create Release
2. Click "Run workflow"
3. Enter version number (e.g., `1.0.0`)
4. Select component (frontend, api, or both)
5. Optionally add release notes

### 2. Deploy Frontend (`deploy-frontend.yml`)
Deploys the Next.js frontend to Google App Engine.

**Triggers:**
- Automatic: When tags matching `v*-frontend` are pushed
- Manual: workflow_dispatch with environment selection

**Deployment:** App Engine service `default`

### 3. Deploy API (`deploy-api.yml`)
Deploys the FastAPI backend to Google App Engine.

**Triggers:**
- Automatic: When tags matching `v*-api` are pushed
- Manual: workflow_dispatch with environment selection

**Deployment:** App Engine service `fastapi`

## Required Secrets

Configure these in repository Settings → Secrets and variables → Actions:

- `GCP_SA_KEY` - Google Cloud service account JSON key
- `GCP_PROJECT_ID` - Google Cloud project ID

## Documentation

For detailed deployment instructions, see [DEPLOYMENT.md](../../DEPLOYMENT.md) in the root directory.
