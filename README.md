# ReciclApp

This is a [Next.js](https://nextjs.org/) project for the Recicla+ project by Nature Power Foundation.

## Environments

The application supports three environments:
- **Development**: Local development with test Firebase project
- **Stage**: Production-like environment for testing before deploying to production
- **Production**: Live production environment

For detailed information about environment configuration and deployment, see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md).

### Quick Start

```bash
# Development
npm run dev:development

# Stage (test before production)
npm run dev:stage

# Production
npm run dev:production
```

### Deployment

```bash
# Deploy to stage
./deploy-stage.sh

# Deploy to production
npm run deploy
```

## Configuration

The application can be configured for different towns/deployments using environment variables. Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

### Environment Variables

- `NEXT_PUBLIC_TOWN`: Specifies which town configuration to use. Valid values are:
  - `sabanayegua` (default)
  - `proyecto4`
  - `sample`

Each town has different deployments to different subdomains, so this value should be set based on the deployment environment.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deployment

This project uses automated deployment to Google App Engine. For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deployment
1. Go to GitHub Actions → Create Release
2. Enter version number and select component
3. Deployment happens automatically

### Validate Setup
Before deploying, you can validate your setup:
```bash
./scripts/validate-deployment-setup.sh
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Additional Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Automated deployment to Google App Engine
- [Environment Setup](./ENVIRONMENT_SETUP.md) - Development and production environment configuration
- [Admin Panel](./ADMIN_PANEL.md) - Admin panel documentation
- [Cookie Authentication](./COOKIE_AUTH_IMPLEMENTATION.md) - Authentication implementation details

---

# reciclapp