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
    role: str = "viewer"
    permissions: list[str] = []


def get_current_user(authorization: Annotated[Union[str, None], Header()] = None):
    if authorization is None or "undefined" in authorization:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )
    token = authorization.split(" ")[1]

    creds = Credentials(token=token)

    user_info_service = build("oauth2", "v2", credentials=creds)
    user_info = user_info_service.userinfo().get().execute()

    # Get user from Firestore to include role and permissions
    user_doc = db.collection("users").where("email", "==", user_info["email"]).get()
    
    if user_doc:
        user_data = user_doc[0].to_dict()
        profile = {
            "name": user_info["name"],
            "picture": user_info["picture"],
            "email": user_info["email"],
            "role": user_data.get("role", "viewer"),
            "permissions": user_data.get("permissions", [])
        }
    else:
        # Default profile for users not yet in the system
        profile = {
            "name": user_info["name"],
            "picture": user_info["picture"],
            "email": user_info["email"],
            "role": "viewer",
            "permissions": []
        }

    return User(**profile)


def valid_user(current_user: Annotated[User, Depends(get_current_user)]):
    """Check if the user is a valid user"""
    valid_users = [doc.to_dict()["email"] for doc in db.collection("users").stream()]

    if current_user.email in valid_users:
        return current_user
    else:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )


def require_permission(permission: str):
    """Dependency factory to check if user has a specific permission"""
    def check_permission(current_user: Annotated[User, Depends(valid_user)]):
        if permission in current_user.permissions or current_user.role == "admin":
            return current_user
        else:
            raise HTTPException(
                status_code=403, 
                detail=f"You do not have permission to {permission}"
            )
    return check_permission


def require_role(required_role: str):
    """Dependency factory to check if user has a specific role"""
    def check_role(current_user: Annotated[User, Depends(valid_user)]):
        # Admin role can access everything
        if current_user.role == "admin" or current_user.role == required_role:
            return current_user
        else:
            raise HTTPException(
                status_code=403,
                detail=f"You need {required_role} role to access this resource"
            )
    return check_role


# Permission constants
class Permissions:
    READ_PDR = "read_pdr"
    WRITE_PDR = "write_pdr"
    DELETE_PDR = "delete_pdr"
    READ_RECOGIDA = "read_recogida"
    WRITE_RECOGIDA = "write_recogida"
    READ_WEIGHT = "read_weight"
    WRITE_WEIGHT = "write_weight"
    MANAGE_USERS = "manage_users"
