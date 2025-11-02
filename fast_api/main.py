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
from .config import config

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

from .dependencies import User, get_current_user
from .routers import pdr, public, recogida, towns, users

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


@app.get("/auth")
def authentication(
    response: Response, authorization: Annotated[Union[str, None], Header()] = None
):
    code = authorization.split(" ")[1]
    flow.fetch_token(code=code)
    credentials = flow.credentials
    user = id_token.verify_oauth2_token(
        str(credentials.id_token),
        requests.Request(),
        client_id,
    )

    # Determine if we're in production (HTTPS) or development (HTTP)
    is_production = os.environ.get("ENV") == "production"

    # Set secure HTTP-only cookies
    response.set_cookie(
        key="access_token",
        value=credentials.token,
        httponly=True,
        secure=is_production,  # Only secure in production (HTTPS)
        samesite="lax"
        if not is_production
        else "strict",  # More lenient for development
        max_age=3600,  # 1 hour
    )
    response.set_cookie(
        key="id_token",
        value=credentials.id_token,
        httponly=True,
        secure=is_production,
        samesite="lax" if not is_production else "strict",
        max_age=3600,  # 1 hour
    )
    response.set_cookie(
        key="refresh_token",
        value=credentials.refresh_token,
        httponly=True,
        secure=is_production,
        samesite="lax" if not is_production else "strict",
        max_age=2592000,  # 30 days
    )

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

    user = id_token.verify_oauth2_token(
        str(credentials.id_token),
        requests.Request(),
        client_id,
    )

    # Determine if we're in production
    is_production = os.environ.get("ENV") == "production"

    # Set updated cookies
    response.set_cookie(
        key="access_token",
        value=credentials.token,
        httponly=True,
        secure=is_production,
        samesite="lax" if not is_production else "strict",
        max_age=3600,  # 1 hour
    )
    response.set_cookie(
        key="id_token",
        value=credentials.id_token,
        httponly=True,
        secure=is_production,
        samesite="lax" if not is_production else "strict",
        max_age=3600,  # 1 hour
    )
    response.set_cookie(
        key="refresh_token",
        value=credentials.refresh_token,
        httponly=True,
        secure=is_production,
        samesite="lax" if not is_production else "strict",
        max_age=2592000,  # 30 days
    )

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
