from typing import Annotated

from dependencies import Permissions, User, require_permission, valid_user
from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel

db = firestore.client()

router = APIRouter()


class UserUpdate(BaseModel):
    role: str
    permissions: list[str]


class UserCreate(BaseModel):
    email: str
    name: str
    role: str = "viewer"
    permissions: list[str] = []


@router.get("/users", tags=["users"])
async def list_users(
    current_user: Annotated[User, Depends(require_permission(Permissions.MANAGE_USERS))]
):
    """List all users - requires manage_users permission"""
    collection = db.collection("users")
    docs = collection.stream()
    users = [doc.to_dict() for doc in docs]
    return users


@router.post("/users", tags=["users"])
async def create_user(
    user_data: UserCreate,
    current_user: Annotated[User, Depends(require_permission(Permissions.MANAGE_USERS))]
):
    """Create a new user - requires manage_users permission"""
    # Check if user already exists
    existing_user = db.collection("users").where("email", "==", user_data.email).get()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create user document
    user_doc = {
        "email": user_data.email,
        "name": user_data.name,
        "role": user_data.role,
        "permissions": user_data.permissions,
        "created_by": current_user.email,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    
    db.collection("users").document(user_data.email).set(user_doc)
    return user_doc


@router.put("/users/{user_email}", tags=["users"])
async def update_user(
    user_email: str,
    user_update: UserUpdate,
    current_user: Annotated[User, Depends(require_permission(Permissions.MANAGE_USERS))]
):
    """Update user role and permissions - requires manage_users permission"""
    user_ref = db.collection("users").document(user_email)
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {
        "role": user_update.role,
        "permissions": user_update.permissions,
        "updated_by": current_user.email,
        "updated_at": firestore.SERVER_TIMESTAMP
    }
    
    user_ref.update(update_data)
    
    # Return updated user data
    updated_doc = user_ref.get()
    return updated_doc.to_dict()


@router.delete("/users/{user_email}", tags=["users"])
async def delete_user(
    user_email: str,
    current_user: Annotated[User, Depends(require_permission(Permissions.MANAGE_USERS))]
):
    """Delete a user - requires manage_users permission"""
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
async def get_current_user_info(
    current_user: Annotated[User, Depends(valid_user)]
):
    """Get current user information"""
    return current_user.dict()


@router.get("/users/permissions", tags=["users"])
async def list_available_permissions(
    current_user: Annotated[User, Depends(require_permission(Permissions.MANAGE_USERS))]
):
    """List all available permissions - requires manage_users permission"""
    return {
        "permissions": [
            {"name": Permissions.READ_PDR, "description": "Read PDR data"},
            {"name": Permissions.WRITE_PDR, "description": "Create and update PDR data"},
            {"name": Permissions.DELETE_PDR, "description": "Delete PDR data"},
            {"name": Permissions.READ_RECOGIDA, "description": "Read collection data"},
            {"name": Permissions.WRITE_RECOGIDA, "description": "Create and update collection data"},
            {"name": Permissions.READ_WEIGHT, "description": "Read weight data"},
            {"name": Permissions.WRITE_WEIGHT, "description": "Create and update weight data"},
            {"name": Permissions.MANAGE_USERS, "description": "Manage user accounts and permissions"},
        ],
        "roles": [
            {"name": "viewer", "description": "Can only view data"},
            {"name": "editor", "description": "Can view and edit data"},
            {"name": "admin", "description": "Full access to all features"}
        ]
    }