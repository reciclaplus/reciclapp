# ReciclApp FastAPI Backend

This is the FastAPI backend for ReciclApp, built with Python 3.10+.

## Package Management with UV

This project uses [UV](https://docs.astral.sh/uv/) as the Python package manager for faster, more reliable dependency management.

### Prerequisites

- Python 3.10 or higher
- UV package manager

### Installing UV

```bash
# Install UV using pip
pip install uv

# Or using the standalone installer (recommended)
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Setting Up the Development Environment

1. Clone the repository and navigate to the `fast_api` directory:
```bash
cd fast_api
```

2. Install dependencies using UV:
```bash
uv sync
```

This will:
- Create a virtual environment in `.venv/`
- Install all dependencies from `pyproject.toml`
- Generate/update the `uv.lock` file

### Running the Development Server

```bash
# Run using UV (automatically uses the virtual environment)
uv run fastapi dev src/main.py

# Or activate the virtual environment and run directly
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
fastapi dev src/main.py
```

### Adding New Dependencies

```bash
# Add a new dependency
uv add package-name

# Add a development dependency
uv add --dev package-name

# This will update both pyproject.toml and uv.lock

# After adding dependencies, update requirements.txt for deployment
./update-requirements.sh
```

### Updating Dependencies

```bash
# Update all dependencies to their latest compatible versions
uv sync --upgrade

# Update a specific package
uv add package-name@latest
```

### Removing Dependencies

```bash
uv remove package-name

# After removing dependencies, update requirements.txt for deployment
./update-requirements.sh
```

## Project Structure

```
fast_api/
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── dependencies.py      # Shared dependencies and auth
│   └── routers/             # API route handlers
│       ├── __init__.py
│       ├── users.py
│       ├── towns.py
│       ├── pdr.py
│       ├── recogida.py
│       └── public.py
├── pyproject.toml           # Project metadata and dependencies
├── uv.lock                  # Locked dependency versions
├── .python-version          # Python version specification
├── app.yaml                 # Google App Engine config (production)
└── app-stage.yaml           # Google App Engine config (staging)
```

## Deployment

The application is deployed to Google App Engine. For deployment, Google App Engine will automatically:
1. Detect the `pyproject.toml` file
2. Install UV if needed
3. Install dependencies using UV
4. Run the application using the entrypoint specified in `app.yaml`

### Manual Deployment

```bash
# Deploy to staging
gcloud app deploy app-stage.yaml --project your-project-id

# Deploy to production
gcloud app deploy app.yaml --project your-project-id
```

## Migration from requirements.txt

This project has been migrated from using `requirements.txt` to UV with `pyproject.toml`. The benefits include:

- **Faster installation**: UV is significantly faster than pip
- **Deterministic builds**: `uv.lock` ensures reproducible environments
- **Better dependency resolution**: UV has a more sophisticated resolver
- **Modern Python packaging**: Uses standard `pyproject.toml` format
- **Virtual environment management**: Automatic `.venv` handling

The `requirements.txt` file is now auto-generated from `pyproject.toml` and is used specifically for Google App Engine deployment (which doesn't support UV natively). For local development, always use UV commands to manage dependencies.

## Environment Variables

The application requires the following environment variables:

- `NODE_ENV`: Environment name (development/stage/production)
- `FAST_API_URL`: Base URL for the API
- `FIREBASE_PROJECT_ID`: Firebase project identifier
- `FIRESTORE_DATABASE_ID`: Firestore database name
- `OAUTH_REDIRECT_URI`: OAuth redirect URL
- `ALLOWED_ORIGINS`: CORS allowed origins
- `COOKIE_DOMAIN`: Domain for authentication cookies
- `GOOGLE_OAUTH_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_OAUTH_CLIENT_SECRET`: Google OAuth client secret

See `app.yaml` and `app-stage.yaml` for the full configuration.
