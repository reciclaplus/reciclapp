import json
from typing import Annotated, Union

from fastapi import Depends, Header, HTTPException
from firebase_admin import firestore
from google.auth.transport import requests
from google.oauth2 import id_token
from pydantic import BaseModel

db = firestore.client()

with open("./client_secret_.json") as f:
    data = json.load(f)
    client_id = data["web"]["client_id"]


class User(BaseModel):
    name: str
    picture: str
    email: str


def get_current_user(authorization: Annotated[Union[str, None], Header()] = None):
    if authorization is None:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )
    token = authorization.split(" ")[1]
    user = id_token.verify_oauth2_token(
        token,
        requests.Request(),
        client_id,
    )

    profile = {"name": user["name"], "picture": user["picture"], "email": user["email"]}

    return User(**profile)


def valid_user(current_user: Annotated[User, Depends(get_current_user)]):
    """Check if the user is a valid user"""
    valid_users = [doc.to_dict()["email"] for doc in db.collection("users").stream()]

    if current_user.email in valid_users:
        return True
    else:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )
