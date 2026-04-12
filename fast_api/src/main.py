import json
import os
from typing import Annotated, Union

import google.auth
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.auth.transport import requests
from google.cloud import firestore
from google.oauth2 import id_token, service_account
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow

# Import environment configuration
from src.config import config

# Create a google-cloud Firestore client using Application Default Credentials (ADC)
# In App Engine, ADC are provided by the runtime. If explicit credentials are provided
# via env (GCLOUD_SA_JSON), we will use them; otherwise fall back to ADC.
gcloud_sa_json = os.getenv("GCLOUD_SA_JSON")
if gcloud_sa_json:
    sa_info = json.loads(gcloud_sa_json)
    gcloud_creds = service_account.Credentials.from_service_account_info(sa_info)
else:
    gcloud_creds, _ = google.auth.default()

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
# OAuth flow setup using environment variables (no local secret files)
GOOGLE_OAUTH_CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
GOOGLE_OAUTH_CLIENT_SECRET = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")
print("GOOGLE_OAUTH_CLIENT_ID:", GOOGLE_OAUTH_CLIENT_ID)
print("GOOGLE_OAUTH_CLIENT_SECRET:", GOOGLE_OAUTH_CLIENT_SECRET)
flow = Flow.from_client_config(
    {
        "web": {
            "client_id": GOOGLE_OAUTH_CLIENT_ID,
            "client_secret": GOOGLE_OAUTH_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    },
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
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load client_id and client_secret from environment
client_id = GOOGLE_OAUTH_CLIENT_ID
client_secret = GOOGLE_OAUTH_CLIENT_SECRET


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/auth")
def authentication(
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

    return {
        "token": credentials.token,
        "id_token": credentials.id_token,
        "refresh_token": credentials.refresh_token,
        "expiry": credentials.expiry.strftime("%Y-%m-%d %H:%M:%S"),
        "message": "Authentication successful",
    }


@app.get("/refresh-token")
def refresh_token(
    authorization: Annotated[Union[str, None], Header()] = None,
):
    if not authorization:
        raise HTTPException(status_code=401, detail="No refresh token provided")

    parts = authorization.split(" ")
    if len(parts) < 2:
        raise HTTPException(status_code=400, detail="Malformed Authorization header")
    refresh_token_value = parts[1]

    credentials = Credentials(
        token=None,
        refresh_token=refresh_token_value,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
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

    return {
        "token": credentials.token,
        "id_token": credentials.id_token,
        "refresh_token": credentials.refresh_token,
        "expiry": credentials.expiry.strftime("%Y-%m-%d %H:%M:%S"),
        "message": "Tokens refreshed",
    }


@app.get("/get-current-user")
def get_active_user(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user.dict()


@app.post("/logout")
def logout():
    """Client-side clears tokens from localStorage"""
    return {"message": "Logged out successfully"}
