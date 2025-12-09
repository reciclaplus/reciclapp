import json
from typing import Annotated, Union
import os
from fastapi import Depends, Header, HTTPException, Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from pydantic import BaseModel

# Import environment configuration
from .config import config

# Environment-aware Firestore client
from .main import firestore_client as db

class User(BaseModel):
    name: str
    picture: str
    email: str
    role: str = "read"  # default role


def get_current_user(
    request: Request, authorization: Annotated[Union[str, None], Header()] = None
):
    # Try to get token from cookie first, then fallback to header for backward compatibility
    token = request.cookies.get("access_token")

    if not token and authorization and "undefined" not in authorization:
        token = authorization.split(" ")[1]

    if not token or "undefined" in str(token):
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )

    creds = Credentials(token=token)

    user_info_service = build("oauth2", "v2", credentials=creds)
    user_info = user_info_service.userinfo().get().execute()

    # Get user from Firestore to include role and permissions
    users_collection = "users"
    user_doc = (
        db.collection(users_collection).where("email", "==", user_info["email"]).get()
    )

    if user_doc:
        user_data = user_doc[0].to_dict()
        profile = {
            "name": user_info["name"],
            "picture": user_info["picture"],
            "email": user_info["email"],
            "role": user_data.get("role", "read"),
        }
    else:
        profile = {
            "name": user_info["name"],
            "picture": user_info["picture"],
            "email": user_info["email"],
            "role": "read",
        }

    return User(**profile)


def valid_user(current_user: Annotated[User, Depends(get_current_user)]):
    """Check if the user is a valid user"""
    # Use environment-aware collection name
    users_collection = "users"
    valid_users = [
        doc.to_dict()["email"] for doc in db.collection(users_collection).stream()
    ]

    if current_user.email in valid_users:
        return current_user
    else:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )


def require_role(required_role: str):
    """Dependency factory to check if user has a specific role"""

    def check_role(current_user: Annotated[User, Depends(valid_user)]):
        role_order = {"read": 1, "write": 2, "admin": 3}
        if role_order.get(current_user.role, 0) >= role_order.get(required_role, 0):
            return current_user
        else:
            raise HTTPException(
                status_code=403,
                detail=f"You need {required_role} role to access this resource",
            )

    return check_role
