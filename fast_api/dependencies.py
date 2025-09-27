import json
from typing import Annotated, Union

from fastapi import Depends, Header, HTTPException
from firebase_admin import firestore
from google.auth.transport import requests
from google.oauth2 import id_token
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from pydantic import BaseModel

db = firestore.client()
with open("./client_secret_.json") as f:
    data = json.load(f)
    client_id = data["web"]["client_id"]


class User(BaseModel):
    name: str
    picture: str
    email: str
    role: str = "user"  # Default role


def get_current_user(authorization: Annotated[Union[str, None], Header()] = None):
    if authorization is None or "undefined" in authorization:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )
    token = authorization.split(" ")[1]

    creds = Credentials(token=token)

    user_info_service = build("oauth2", "v2", credentials=creds)
    user_info = user_info_service.userinfo().get().execute()

    # Get user role from database
    user_doc = db.collection("users").document(user_info["email"]).get()
    role = "user"  # default role
    if user_doc.exists:
        user_data = user_doc.to_dict()
        role = user_data.get("role", "user")

    profile = {
        "name": user_info["name"],
        "picture": user_info["picture"],
        "email": user_info["email"],
        "role": role,
    }

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


def admin_user(current_user: Annotated[User, Depends(get_current_user)]):
    """Check if the user is an admin"""
    if not valid_user(current_user):
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )
    
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403, detail="Admin access required"
        )
    
    return current_user
