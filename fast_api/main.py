import json
import os
from typing import Annotated, Union

from fastapi import Depends, FastAPI, Header
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
from .routers import pdr, public, recogida, users

app = FastAPI()


app.include_router(pdr.router)
app.include_router(recogida.router)
app.include_router(public.router)
app.include_router(users.router)


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
def authentication(authorization: Annotated[Union[str, None], Header()] = None):
    code = authorization.split(" ")[1]
    flow.fetch_token(code=code)
    credentials = flow.credentials
    user = id_token.verify_oauth2_token(
        str(credentials.id_token),
        requests.Request(),
        client_id,
    )

    return {
        "token": credentials.token,
        "id_token": credentials.id_token,
        "refresh_token": credentials.refresh_token,
        "expiry": credentials.expiry.strftime("%Y-%m-%d %H:%M:%S"),
    }


@app.get("/refresh-token")
def refresh_token(authorization: Annotated[Union[str, None], Header()] = None):
    refresh_token = authorization.split(" ")[1]

    credentials = Credentials(
        token=None,
        refresh_token=refresh_token,
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

    return {
        "token": credentials.token,
        "id_token": credentials.id_token,
        "refresh_token": credentials.refresh_token,
        "expiry": credentials.expiry.strftime("%Y-%m-%d %H:%M:%S"),
    }


@app.get("/get-current-user")
def get_active_user(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user.dict()
