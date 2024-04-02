import json
import os

import firebase_admin
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials
from google.auth.transport import requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow

cred = credentials.Certificate("fast_api/routers/firestore-service-account.json")
firebase_app = firebase_admin.initialize_app(cred)

from .routers import pdr, recogida

app = FastAPI()


app.include_router(pdr.router)
app.include_router(recogida.router)


os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "True"
flow = Flow.from_client_secrets_file(
    "fast_api/client_secret_.json",
    scopes=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/devstorage.full_control",
        "https://www.googleapis.com/auth/userinfo.email",
    ],
    redirect_uri="http://localhost:3000",
)

origins = [
    "https://reciclapp-dev-dot-norse-voice-343214.uc.r.appspot.com",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("fast_api/client_secret_.json") as f:
    data = json.load(f)
    client_id = data["web"]["client_id"]


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/auth")
def authentication(request: Request, code: str):
    # try:
    # Specify the CLIENT_ID of the app that accesses the backend:
    flow.fetch_token(code=code)
    credentials = flow.credentials
    user = id_token.verify_oauth2_token(
        str(credentials.id_token),
        requests.Request(),
        client_id,
    )

    return credentials.token, str(credentials.id_token)


@app.get("/get-current-user")
def get_current_user(request: Request, id_token_param: str):
    user = id_token.verify_oauth2_token(
        str(id_token_param),
        requests.Request(),
        client_id,
    )

    profile = {"name": user["name"], "picture": user["picture"]}
    name = user["name"]
    picture = user["picture"]
    print(name, picture)
    return profile
    return profile
