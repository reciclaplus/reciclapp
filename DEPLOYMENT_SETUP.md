# First-Time Deployment Setup Checklist

This checklist helps you set up automated deployment for the first time.

## Prerequisites

- [ ] Google Cloud Project with billing enabled
- [ ] GitHub repository admin access
- [ ] `gcloud` CLI installed (for initial setup)

## 1. Google Cloud Setup

### Create Service Account
```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Create service account
gcloud iam service-accounts create github-actions-deployer \
    --display-name="GitHub Actions Deployer" \
    --project=$PROJECT_ID

# Get the service account email
export SA_EMAIL="github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com"
```

### Assign Required Roles
```bash
# App Engine Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/appengine.appAdmin"

# Service Account User
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/iam.serviceAccountUser"

# Cloud Build Service Account
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/cloudbuild.builds.editor"

# Storage Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/storage.admin"

# Cloud Scheduler Admin (if using scheduled tasks)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/cloudscheduler.admin"
```

### Create and Download Key
```bash
# Create key
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=$SA_EMAIL \
    --project=$PROJECT_ID

# Display key (copy this for GitHub Secrets)
cat github-actions-key.json
```

⚠️ **Important**: Keep this key secure and delete the local file after adding to GitHub Secrets!

### Initialize App Engine (if not already done)
```bash
# Initialize App Engine
gcloud app create --region=us-central --project=$PROJECT_ID

# Verify
gcloud app describe --project=$PROJECT_ID
```

## 2. GitHub Secrets Setup

Go to: `https://github.com/reciclaplus/reciclapp/settings/secrets/actions`

### Add Secrets

1. **GCP_SA_KEY**
   - Click "New repository secret"
   - Name: `GCP_SA_KEY`
   - Value: Paste the entire contents of `github-actions-key.json`
   - Click "Add secret"

2. **GCP_PROJECT_ID**
   - Click "New repository secret"
   - Name: `GCP_PROJECT_ID`
   - Value: Your Google Cloud project ID (e.g., `norse-voice-343214`)
   - Click "Add secret"

### Verify Secrets
- [ ] `GCP_SA_KEY` added
- [ ] `GCP_PROJECT_ID` added

## 3. Repository Configuration

### Verify Required Files Exist

- [ ] `app.yaml` (root directory - frontend config)
- [ ] `fast_api/app.yaml` (API config)
- [ ] `.env.production` (production environment config)
- [ ] Service account files (not in git):
  - [ ] `fast_api/routers/firestore-service-account.json`
  - [ ] `fast_api/routers/firestore-service-account-dev.json` (if deploying to dev)

### Verify Workflow Files

- [ ] `.github/workflows/create-release.yml`
- [ ] `.github/workflows/deploy-frontend.yml`
- [ ] `.github/workflows/deploy-api.yml`

## 4. Test Deployment

### Option A: Manual Deployment Test (Recommended)

Test deployment manually before creating a release:

1. Go to GitHub Actions
2. Select "Deploy Frontend to GAE" workflow
3. Click "Run workflow"
4. Select "production" environment
5. Click "Run workflow"
6. Monitor the deployment
7. Verify the app works

Repeat for API:
1. Select "Deploy API to GAE" workflow
2. Click "Run workflow"
3. Select "production" environment
4. Click "Run workflow"
5. Monitor the deployment
6. Verify the API works

### Option B: Create First Release

1. Go to GitHub Actions
2. Select "Create Release" workflow
3. Click "Run workflow"
4. Enter version: `1.0.0`
5. Select component: `both`
6. Add release notes (optional)
7. Click "Run workflow"
8. Watch for automatic deployments to trigger

## 5. Verify Deployment

### Check App Engine
```bash
# List deployed versions
gcloud app versions list --project=$PROJECT_ID

# View frontend service
gcloud app services describe default --project=$PROJECT_ID

# View API service
gcloud app services describe fastapi --project=$PROJECT_ID

# Get app URL
gcloud app browse --project=$PROJECT_ID
```

### Check Application

- [ ] Frontend is accessible
- [ ] API endpoints are working
- [ ] Authentication works
- [ ] Database connections work

## 6. Clean Up

After successful setup:

```bash
# Remove local service account key
rm github-actions-key.json

# Remove from shell history (optional but recommended)
history -c
```

## Troubleshooting

### "App Engine application not found"
```bash
gcloud app create --region=us-central --project=$PROJECT_ID
```

### "Permission denied"
Check that all IAM roles are assigned to the service account.

### "Secrets not found"
Verify secrets are correctly named and contain valid JSON/text.

### "Build fails"
Check that `package.json` and `requirements.txt` are up to date.

## Next Steps

Once setup is complete:

1. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment procedures
2. Set up monitoring in Google Cloud Console
3. Configure alerts for deployment failures
4. Document your specific project configuration
5. Train team members on deployment process

## Support

For issues:
1. Check GitHub Actions logs
2. Review Google Cloud logs: `gcloud app logs tail -s default` or `gcloud app logs tail -s fastapi`
3. Consult [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
4. Open an issue in the repository

---

**Last Updated**: 2025-11-23
