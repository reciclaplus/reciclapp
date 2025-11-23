#!/bin/bash

###############################################################################
# Stage Deployment Script for ReciclApp
#
# This script deploys both the Next.js frontend and FastAPI backend to the
# stage environment with a single command.
#
# Usage: ./deploy-stage.sh
###############################################################################

set -e  # Exit on any error

echo "🚀 Starting Stage Deployment for ReciclApp"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

if [ ! -d "fast_api" ]; then
    echo "❌ Error: fast_api directory not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Deploy FastAPI Backend
echo "📦 Step 1: Deploying FastAPI Backend to api-dev service..."
echo "-----------------------------------------------------------"
cd fast_api

# Switch to stage environment
echo "🔧 Switching FastAPI to stage environment..."
python switch_env.py stage

# Deploy to Google App Engine
echo "☁️  Deploying FastAPI to Google App Engine..."
gcloud app deploy app-stage.yaml --quiet

cd ..
echo "✅ FastAPI deployed successfully!"
echo ""

# Step 2: Deploy Next.js Frontend
echo "📦 Step 2: Deploying Next.js Frontend to reciclapp-dev service..."
echo "------------------------------------------------------------------"

# Switch to stage environment
echo "🔧 Switching Next.js to stage environment..."
npm run switch-env stage

# Build the Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Deploy to Google App Engine
echo "☁️  Deploying Next.js to Google App Engine..."
gcloud app deploy app-stage.yaml --quiet

echo "✅ Next.js deployed successfully!"
echo ""

# Step 3: Summary
echo "🎉 Stage Deployment Complete!"
echo "============================="
echo ""
echo "Your applications are now deployed:"
echo "  Frontend: https://reciclapp-dev-dot-norse-voice-343214.uc.r.appspot.com"
echo "  API:      https://api-dev-dot-norse-voice-343214.uc.r.appspot.com"
echo ""
echo "You can view the deployment status in the Google Cloud Console:"
echo "  https://console.cloud.google.com/appengine/services?project=norse-voice-343214"
echo ""
