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

from fastapi import Body, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "True"
flow = Flow.from_client_secrets_file(
    "../client_secret_.json",
    scopes=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/devstorage.full_control",
        "https://www.googleapis.com/auth/userinfo.email",
    ],
    redirect_uri="http://localhost:3000",
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(SessionMiddleware, secret_key="reciclapp")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("../client_secret_.json") as f:
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

    request.session["user"] = dict({"email": user["email"]})
    request.session["credentials"] = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }
    request.session["access_token"] = credentials.token

    return credentials.token, str(credentials.id_token)


@app.get("/get-current-user")
def get_current_user(request: Request, id_token_2: str):
    user = id_token.verify_oauth2_token(
        str(id_token_2),
        requests.Request(),
        client_id,
    )

    profile = {"name": user["name"], "picture": user["picture"]}
    name = user["name"]
    picture = user["picture"]

    return profile


@app.post("/time-series-data")
def time_series_data(
    categoria: str,
    start: str,
    end: str,
    barrio: str = "all",
    payload: Any = Body(None),
):
    return get_time_series_data(payload, categoria, start, end, barrio)


@app.get("/download-file")
def download_file(request: Request, file: str, bucket: str, token: str):
    access_token = request.session.get("credentials")
    print(access_token)
    print(token)
    # Load credentials
    credentials = google.oauth2.credentials.Credentials(token)

    storage_client = storage.Client("norse-voice", credentials=credentials)
    bucket = storage_client.bucket(bucket)
    blob = bucket.blob(file)
    try:
        contents = blob.download_as_bytes()
    except Exception as e:
        return e.message

    return json.loads(contents)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
