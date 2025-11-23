#!/bin/bash

# Deployment Setup Validation Script
# This script checks if the repository is properly configured for automated deployment

echo "🔍 Validating Deployment Setup..."
echo ""

ERRORS=0
WARNINGS=0

# Check workflow files
echo "📋 Checking workflow files..."
WORKFLOWS=(
    ".github/workflows/create-release.yml"
    ".github/workflows/deploy-frontend.yml"
    ".github/workflows/deploy-api.yml"
)

for workflow in "${WORKFLOWS[@]}"; do
    if [ -f "$workflow" ]; then
        echo "  ✅ $workflow exists"
    else
        echo "  ❌ $workflow is missing"
        ((ERRORS++))
    fi
done
echo ""

# Check App Engine configuration files
echo "📋 Checking App Engine configuration..."
APP_CONFIGS=(
    "app.yaml:Frontend configuration"
    "fast_api/app.yaml:API configuration"
)

for config in "${APP_CONFIGS[@]}"; do
    file="${config%%:*}"
    desc="${config##*:}"
    if [ -f "$file" ]; then
        echo "  ✅ $file exists ($desc)"
    else
        echo "  ❌ $file is missing ($desc)"
        ((ERRORS++))
    fi
done
echo ""

# Check environment files
echo "📋 Checking environment configuration..."
if [ -f ".env" ]; then
    echo "  ✅ .env exists"
else
    echo "  ⚠️  .env is missing (will be created by switch-env script)"
    ((WARNINGS++))
fi

if [ -f ".env.production" ]; then
    echo "  ✅ .env.production exists"
else
    echo "  ❌ .env.production is missing"
    ((ERRORS++))
fi

if [ -f ".env.development" ]; then
    echo "  ✅ .env.development exists"
else
    echo "  ⚠️  .env.development is missing (only needed for dev deployments)"
    ((WARNINGS++))
fi
echo ""

# Check switch-env scripts
echo "📋 Checking environment switch scripts..."
if [ -f "scripts/switch-env.js" ]; then
    echo "  ✅ scripts/switch-env.js exists"
else
    echo "  ❌ scripts/switch-env.js is missing"
    ((ERRORS++))
fi

if [ -f "fast_api/switch_env.py" ]; then
    echo "  ✅ fast_api/switch_env.py exists"
else
    echo "  ❌ fast_api/switch_env.py is missing"
    ((ERRORS++))
fi
echo ""

# Check package files
echo "📋 Checking package configuration..."
if [ -f "package.json" ]; then
    echo "  ✅ package.json exists"
    
    # Check for required scripts
    if grep -q '"switch-env"' package.json; then
        echo "  ✅ switch-env script found in package.json"
    else
        echo "  ❌ switch-env script missing in package.json"
        ((ERRORS++))
    fi
    
    if grep -q '"build"' package.json; then
        echo "  ✅ build script found in package.json"
    else
        echo "  ❌ build script missing in package.json"
        ((ERRORS++))
    fi
else
    echo "  ❌ package.json is missing"
    ((ERRORS++))
fi

if [ -f "fast_api/requirements.txt" ]; then
    echo "  ✅ fast_api/requirements.txt exists"
else
    echo "  ❌ fast_api/requirements.txt is missing"
    ((ERRORS++))
fi
echo ""

# Check documentation
echo "📋 Checking documentation..."
DOCS=(
    "DEPLOYMENT.md"
    "DEPLOYMENT_SETUP.md"
    ".github/workflows/README.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc exists"
    else
        echo "  ⚠️  $doc is missing"
        ((WARNINGS++))
    fi
done
echo ""

# Service account check (not failing - just informational)
echo "📋 Checking service account files (informational)..."
echo "  ℹ️  These files should NOT be in git"

if [ -f "fast_api/routers/firestore-service-account.json" ]; then
    echo "  ✅ Production service account exists"
else
    echo "  ⚠️  Production service account not found"
    echo "      (Required for production deployment)"
fi

if [ -f "fast_api/routers/firestore-service-account-dev.json" ]; then
    echo "  ✅ Development service account exists"
else
    echo "  ⚠️  Development service account not found"
    echo "      (Required for development deployment)"
fi
echo ""

# Check if in git repository
echo "📋 Checking git configuration..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "  ✅ Git repository detected"
    
    # Check if we're on a branch
    BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    if [ -n "$BRANCH" ]; then
        echo "  ✅ Current branch: $BRANCH"
    fi
else
    echo "  ❌ Not a git repository"
    ((ERRORS++))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Validation Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All checks passed! Repository is ready for deployment."
    echo ""
    echo "Next steps:"
    echo "  1. Ensure GitHub secrets are configured (GCP_SA_KEY, GCP_PROJECT_ID)"
    echo "  2. Review DEPLOYMENT_SETUP.md for first-time setup"
    echo "  3. Test deployment using GitHub Actions"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  Validation completed with $WARNINGS warning(s)."
    echo "   Review warnings above, but deployment should work."
    exit 0
else
    echo "❌ Validation failed with $ERRORS error(s) and $WARNINGS warning(s)."
    echo "   Please fix errors before attempting deployment."
    echo ""
    echo "See DEPLOYMENT_SETUP.md for setup instructions."
    exit 1
fi
