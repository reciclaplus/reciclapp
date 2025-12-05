import json
import os
from typing import Annotated, Union

from fastapi import Depends, FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from google.auth.transport import requests
from google.cloud import firestore
from google.oauth2 import id_token, service_account
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow

# Import environment configuration
from src.config import config

# Create a google-cloud Firestore client so we can target a non-default database
# Use the same service account file configured in `config`.
gcloud_creds = service_account.Credentials.from_service_account_file(
    config.firestore_service_account_file
)
# Expose `firestore_client` for other modules to import from this package.
firestore_client = firestore.Client(
    project=config.firebase_project_id,
    credentials=gcloud_creds,
    database=config.firestore_database_id,
)

from src.dependencies import User, get_current_user
from src.routers import pdr, public, recogida, towns, users


app = FastAPI()


app.include_router(pdr.router)
app.include_router(recogida.router)
app.include_router(public.router)
app.include_router(users.router)
app.include_router(towns.router)


# Environment-aware OAuth flow setup
os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "True"
flow = Flow.from_client_secrets_file(
    config.client_secret_file,
    scopes=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ],
    redirect_uri=config.oauth_redirect_uri,
)

# Environment-aware CORS origins
origins = config.allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load client secrets with environment-aware path
with open(config.client_secret_file) as f:
    data = json.load(f)
    client_id = data["web"]["client_id"]


@app.get("/")
async def root():
    return {"message": "Hello World"}


def _set_auth_cookies(response: Response, credentials: Credentials, request: Request):
    """Set cookies with attributes appropriate for HTTPS and cross-subdomain deployments.

    - Secure: True on HTTPS or prod-like envs
    - SameSite: None when COOKIE_DOMAIN is set (cross-site); else Lax for dev, Strict for prod
    - Domain: Optional COOKIE_DOMAIN (e.g., .example.com) so cookies are shared across subdomains
    - Path: '/'
    """
    node_env = os.getenv("NODE_ENV", "development")
    env = os.getenv("ENV", node_env)
    scheme = request.url.scheme
    is_secure_channel = scheme == "https"
    is_prod_like = env in ["production", "stage"]
    cookie_domain = os.getenv("COOKIE_DOMAIN")

    # For cross-site cookies across subdomains, SameSite must be 'None' and Secure must be True
    same_site = (
        "None"
        if cookie_domain and is_secure_channel
        else ("lax" if not is_prod_like else "strict")
    )
    secure_flag = True if is_secure_channel or is_prod_like else False

    common_kwargs = {
        "httponly": True,
        "secure": secure_flag,
        "samesite": same_site,
        "path": "/",
    }
    if cookie_domain:
        common_kwargs["domain"] = cookie_domain

    response.set_cookie(
        key="access_token",
        value=credentials.token,
        max_age=3600,
        **common_kwargs,
    )
    response.set_cookie(
        key="id_token",
        value=credentials.id_token,
        max_age=3600,
        **common_kwargs,
    )
    response.set_cookie(
        key="refresh_token",
        value=credentials.refresh_token,
        max_age=2592000,
        **common_kwargs,
    )


@app.get("/auth")
def authentication(
    request: Request,
    response: Response,
    authorization: Annotated[Union[str, None], Header()] = None,
):
    if not authorization:
        raise HTTPException(
            status_code=400, detail="Missing Authorization header with code"
        )
    parts = authorization.split(" ")
    if len(parts) < 2:
        raise HTTPException(status_code=400, detail="Malformed Authorization header")
    code = parts[1]
    flow.fetch_token(code=code)
    credentials = flow.credentials
    _ = id_token.verify_oauth2_token(
        str(credentials.id_token),
        requests.Request(),
        client_id,
    )

    _set_auth_cookies(response, credentials, request)

    return {
        "token": credentials.token,
        "id_token": credentials.id_token,
        "refresh_token": credentials.refresh_token,
        "expiry": credentials.expiry.strftime("%Y-%m-%d %H:%M:%S"),
        "message": "Authentication successful, tokens set in cookies",
    }


@app.get("/refresh-token")
def refresh_token(
    request: Request,
    response: Response,
    authorization: Annotated[Union[str, None], Header()] = None,
):
    # Try to get refresh token from cookie first, then fallback to header
    refresh_token_value = request.cookies.get("refresh_token")
    if not refresh_token_value and authorization:
        refresh_token_value = authorization.split(" ")[1]

    if not refresh_token_value:
        raise HTTPException(status_code=401, detail="No refresh token provided")

    credentials = Credentials(
        token=None,
        refresh_token=refresh_token_value,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=data["web"]["client_secret"],
        default_scopes=[
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
    )

    credentials.refresh(requests.Request())

    _ = id_token.verify_oauth2_token(
        str(credentials.id_token),
        requests.Request(),
        client_id,
    )

    _set_auth_cookies(response, credentials, request)

    return {
        "token": credentials.token,
        "id_token": credentials.id_token,
        "refresh_token": credentials.refresh_token,
        "expiry": credentials.expiry.strftime("%Y-%m-%d %H:%M:%S"),
        "message": "Tokens refreshed and updated in cookies",
    }


@app.get("/get-current-user")
def get_active_user(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user.dict()


@app.post("/logout")
def logout(response: Response):
    """Clear authentication cookies"""
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="id_token")
    response.delete_cookie(key="refresh_token")
    return {"message": "Logged out successfully"}
