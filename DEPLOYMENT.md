# Automated Deployment Guide

This document explains the automated deployment system for ReciclApp, which includes the Next.js frontend and FastAPI backend.

## Overview

The deployment system uses GitHub Actions to automate:
1. Creating version tags and GitHub releases
2. Deploying the frontend to Google App Engine (service: default)
3. Deploying the API to Google App Engine (service: fastapi)

## Architecture

The frontend and API are **independently versioned and deployed** to allow:
- Different release cycles for frontend and backend
- Independent rollback capabilities
- Isolated service deployments
- Flexible development workflows

## Version Tags

Version tags follow this pattern:
- **Frontend:** `v{version}-frontend` (e.g., `v1.0.0-frontend`)
- **API:** `v{version}-api` (e.g., `v1.0.0-api`)

Version numbers follow semantic versioning: `MAJOR.MINOR.PATCH`

## Setup Requirements

### Google Cloud Platform Configuration

1. **Service Account**: Create a service account with the following roles:
   - `App Engine Admin`
   - `Service Account User`
   - `Cloud Build Service Account`
   - `Storage Admin`

2. **Download Service Account Key**: Export the key as JSON

3. **App Engine Application**: Ensure App Engine is initialized in your GCP project:
   ```bash
   gcloud app create --region=us-central
   ```

### GitHub Secrets Configuration

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `GCP_SA_KEY` | Service account JSON key | `{"type": "service_account", ...}` |
| `GCP_PROJECT_ID` | Google Cloud project ID | `norse-voice-343214` |

To add secrets:
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret with its value

### Additional Requirements

Ensure the following files exist in your repository:
- `app.yaml` - Frontend App Engine configuration (root directory)
- `fast_api/app.yaml` - API App Engine configuration
- Service account files (not committed to git):
  - `fast_api/routers/firestore-service-account.json` (production)
  - `fast_api/routers/firestore-service-account-dev.json` (development)

## How to Deploy

### Method 1: Automated Release and Deployment (Recommended)

1. **Go to GitHub Actions**
   - Navigate to your repository
   - Click on "Actions" tab
   - Select "Create Release" workflow

2. **Trigger the Workflow**
   - Click "Run workflow"
   - Fill in the parameters:
     - **Version**: Enter version number (e.g., `1.0.0`)
     - **Component**: Choose `frontend`, `api`, or `both`
     - **Release notes**: (Optional) Add release description
   - Click "Run workflow"

3. **Automatic Deployment**
   - The workflow will create the tag(s) and release(s)
   - Deployment workflows will automatically trigger
   - Monitor progress in the Actions tab

### Method 2: Manual Tag Creation

You can also create tags manually and push them to trigger deployments:

```bash
# Create and push a frontend tag
git tag -a v1.0.0-frontend -m "Frontend Release v1.0.0"
git push origin v1.0.0-frontend

# Create and push an API tag
git tag -a v1.0.0-api -m "API Release v1.0.0"
git push origin v1.0.0-api
```

### Method 3: Manual Deployment (Without Tags)

You can also trigger deployments manually without creating tags:

1. Go to GitHub Actions
2. Select "Deploy Frontend to GAE" or "Deploy API to GAE"
3. Click "Run workflow"
4. Select the environment (production/development)
5. Click "Run workflow"

## Deployment Workflows

### Create Release Workflow

**File:** `.github/workflows/create-release.yml`

**Triggers:** Manual (workflow_dispatch)

**What it does:**
- Validates version number format
- Creates version tag(s) with proper naming
- Creates GitHub release(s) with notes
- Triggers deployment workflows automatically

### Deploy Frontend Workflow

**File:** `.github/workflows/deploy-frontend.yml`

**Triggers:**
- Push of tags matching `v*-frontend`
- Manual workflow dispatch

**Steps:**
1. Checkout code
2. Set up Node.js 18
3. Install dependencies
4. Switch to target environment (production/development)
5. Build the Next.js application
6. Authenticate to Google Cloud
7. Deploy to App Engine (service: default)

### Deploy API Workflow

**File:** `.github/workflows/deploy-api.yml`

**Triggers:**
- Push of tags matching `v*-api`
- Manual workflow dispatch

**Steps:**
1. Checkout code
2. Set up Python 3.10
3. Switch to target environment (production/development)
4. Authenticate to Google Cloud
5. Deploy to App Engine (service: fastapi)

## Environments

The system supports two environments:

### Production
- **Frontend Firebase:** `norse-voice-343214`
- **API URL:** `https://fastapi-dot-norse-voice-343214.uc.r.appspot.com`
- **Collection Prefix:** None
- **OAuth Redirect:** `https://sabanayegua.reciclaplus.com`

### Development
- **Frontend Firebase:** `reciclapp-dev-23776`
- **API URL:** `http://localhost:8000`
- **Collection Prefix:** `dev_`
- **OAuth Redirect:** `http://localhost:3000`

Environment switching is automatic during deployment based on the workflow input or defaults to production for tag-based deployments.

## Versioning Strategy

### When to Bump Version Numbers

**MAJOR version** (X.0.0):
- Breaking changes
- Major feature releases
- Significant architecture changes

**MINOR version** (x.Y.0):
- New features
- Non-breaking enhancements
- Backwards-compatible changes

**PATCH version** (x.y.Z):
- Bug fixes
- Security patches
- Minor improvements

### Independent Versioning

Frontend and API can have different version numbers:
- `v2.1.0-frontend` with `v1.5.2-api` is perfectly valid
- Release components independently when changes only affect one

### Synchronized Releases

For major releases affecting both components:
```bash
# Use "both" option to create matching versions
Component: both
Version: 2.0.0
```

This creates:
- `v2.0.0-frontend`
- `v2.0.0-api`

## Monitoring Deployments

### Via GitHub Actions
1. Go to repository → Actions tab
2. Click on the running workflow
3. Monitor step-by-step progress
4. View deployment summary

### Via Google Cloud Console
1. Go to [App Engine → Versions](https://console.cloud.google.com/appengine/versions)
2. See deployed versions for each service
3. Monitor traffic allocation
4. View logs and metrics

### Via gcloud CLI
```bash
# List deployed versions
gcloud app versions list

# View service details
gcloud app services describe default
gcloud app services describe fastapi

# Stream logs
gcloud app logs tail -s default
gcloud app logs tail -s fastapi
```

## Rollback Procedures

### Via Google Cloud Console
1. Go to App Engine → Versions
2. Select the service (default or fastapi)
3. Find the previous working version
4. Click "Migrate traffic" to the desired version

### Via gcloud CLI
```bash
# Split traffic to a specific version
gcloud app services set-traffic default --splits VERSION_ID=1.0

# Or for the API
gcloud app services set-traffic fastapi --splits VERSION_ID=1.0
```

### Via GitHub Actions
1. Trigger a manual deployment workflow
2. The current code will be redeployed

## Troubleshooting

### Deployment Fails - Authentication Error
**Problem:** `ERROR: (gcloud.app.deploy) Error Response: [7] Access denied`

**Solution:**
1. Verify `GCP_SA_KEY` secret is correctly set
2. Ensure service account has required permissions
3. Check that the service account key hasn't expired

### Deployment Fails - App Engine Not Found
**Problem:** `ERROR: (gcloud.app.deploy) The current Google Cloud project [...] does not contain an App Engine application`

**Solution:**
```bash
gcloud app create --region=us-central --project=YOUR_PROJECT_ID
```

### Build Fails - Dependencies
**Problem:** `npm ci` or `pip install` fails

**Solution:**
1. Check `package-lock.json` or `requirements.txt` are committed
2. Verify Node.js/Python versions match workflow configuration
3. Review error logs for specific dependency issues

### Environment Switch Fails
**Problem:** Environment variables not switching correctly

**Solution:**
1. Verify `.env.development` and `.env.production` files exist
2. Check `scripts/switch-env.js` and `fast_api/switch_env.py` are working
3. Ensure environment-specific files are not in `.gitignore`

### Tag Already Exists
**Problem:** `Error: Tag v1.0.0-frontend already exists`

**Solution:**
- Use a different version number
- Or delete the existing tag (carefully):
  ```bash
  git tag -d v1.0.0-frontend
  git push origin :refs/tags/v1.0.0-frontend
  ```

## Best Practices

1. **Test Before Release**
   - Test thoroughly in development environment
   - Use manual deployments to development before creating releases

2. **Semantic Versioning**
   - Follow semantic versioning principles
   - Document breaking changes clearly

3. **Release Notes**
   - Always provide meaningful release notes
   - List new features, fixes, and breaking changes

4. **Monitor Deployments**
   - Watch deployment progress in GitHub Actions
   - Check App Engine logs after deployment
   - Verify application functionality post-deployment

5. **Gradual Rollouts** (Optional)
   - For critical releases, consider traffic splitting
   - Deploy to a version without promoting
   - Gradually migrate traffic

6. **Security**
   - Never commit service account keys
   - Rotate service account keys periodically
   - Review permissions regularly

## Related Documentation

- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
- [Google App Engine Documentation](https://cloud.google.com/appengine/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)

## Support

For issues or questions:
1. Check GitHub Actions logs
2. Review Google Cloud logs
3. Consult this documentation
4. Open an issue in the repository
