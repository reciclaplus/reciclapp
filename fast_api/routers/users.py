from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel

# Import environment configuration
from ..config import config
from ..dependencies import User, require_role, valid_user

# Environment-aware Firestore client
from ..main import firestore_client as db

router = APIRouter()


class UserUpdate(BaseModel):
    name: str
    role: str


class UserCreate(BaseModel):
    email: str
    name: str
    role: str = "read"


@router.get("/users", tags=["users"])
async def list_users(
    current_user: Annotated[User, Depends(require_role("admin"))],
):
    """List all users - requires admin role"""
    collection = db.collection("users")
    docs = collection.stream()
    users = [doc.to_dict() for doc in docs]
    return users


@router.post("/users", tags=["users"])
async def create_user(
    user_data: UserCreate,
    current_user: Annotated[User, Depends(require_role("admin"))],
):
    """Create a new user - requires admin role"""
    # Check if user already exists
    existing_user = db.collection("users").where("email", "==", user_data.email).get()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    # Create user document
    user_doc = {
        "email": user_data.email,
        "name": user_data.name,
        "role": user_data.role,
        "created_by": current_user.email,
        "created_at": firestore.SERVER_TIMESTAMP,
    }

    db.collection("users").document(user_data.email).set(user_doc)
    created_doc = db.collection("users").document(user_data.email).get()

    return created_doc.to_dict()


@router.put("/users/{user_email}", tags=["users"])
async def update_user(
    user_email: str,
    user_update: UserUpdate,
    current_user: Annotated[User, Depends(require_role("admin"))],
):
    """Update user role and permissions - requires admin role"""
    user_ref = db.collection("users").document(user_email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = {
        "role": user_update.role,
        "name": user_update.name,
        "updated_by": current_user.email,
        "updated_at": firestore.SERVER_TIMESTAMP,
    }

    user_ref.update(update_data)

    # Return updated user data
    updated_doc = user_ref.get()
    return updated_doc.to_dict()


@router.delete("/users/{user_email}", tags=["users"])
async def delete_user(
    user_email: str,
    current_user: Annotated[User, Depends(require_role("admin"))],
):
    """Delete a user - requires admin role"""
    # Prevent users from deleting themselves
    if user_email == current_user.email:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    user_ref = db.collection("users").document(user_email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    user_ref.delete()
    return {"message": f"User {user_email} deleted successfully"}


@router.get("/users/me", tags=["users"])
async def get_current_user_info(current_user: Annotated[User, Depends(valid_user)]):
    """Get current user information"""
    return current_user.dict()
