import json
import os
from typing import Any

import google.oauth2.credentials
import uvicorn
from google.auth.transport import requests
from google.cloud import storage
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from starlette.middleware.sessions import SessionMiddleware
from time_series_data import get_time_series_data

from fastapi import Body, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "True"
flow = Flow.from_client_secrets_file(
    "./client_secret_.json",
    scopes=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/devstorage.full_control",
        "https://www.googleapis.com/auth/userinfo.email",
    ],
    redirect_uri="https://reciclapp-dev-dot-norse-voice-343214.uc.r.appspot.com",
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

with open("./client_secret_.json") as f:
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

    return profile


@app.post("/time-series-data")
def time_series_data(
    start: str,
    end: str,
    barrio: str = "all",
    categoria: str = "all",
    payload: Any = Body(None),
):
    return get_time_series_data(payload, categoria, start, end, barrio)


@app.get("/download-file")
def download_file(request: Request, file: str, bucket: str, token: str):
    # Load credentials
    credentials = google.oauth2.credentials.Credentials(token)

    storage_client = storage.Client("norse-voice", credentials=credentials)
    bucket = storage_client.bucket(bucket)
    blob = bucket.blob(file)
    try:
        contents = blob.download_as_bytes()
    except Exception as e:
        print(e.code)
        raise HTTPException(status_code=403, detail="No permission")

    return json.loads(contents)
