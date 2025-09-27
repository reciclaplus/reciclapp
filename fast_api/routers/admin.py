from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel

from dependencies import User, admin_user, get_current_user

db = firestore.client()
router = APIRouter()


class UserUpdate(BaseModel):
    email: str
    role: str


class TownConfig(BaseModel):
    name: str
    config: dict


@router.get("/admin/users", tags=["admin"])
async def get_all_users(current_user: Annotated[User, Depends(admin_user)]):
    """Get all users (admin only)"""
    users = []
    for doc in db.collection("users").stream():
        user_data = doc.to_dict()
        user_data["id"] = doc.id
        users.append(user_data)
    return users


@router.put("/admin/users/{user_email}/role", tags=["admin"])
async def update_user_role(
    user_email: str, 
    role: str,
    current_user: Annotated[User, Depends(admin_user)]
):
    """Update user role (admin only)"""
    if role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'user' or 'admin'")
    
    user_doc = db.collection("users").document(user_email)
    user_doc.update({"role": role})
    
    return {"message": f"User {user_email} role updated to {role}"}


@router.post("/admin/users", tags=["admin"])
async def add_user(
    email: str,
    role: str = "user",
    current_user: Annotated[User, Depends(admin_user)]
):
    """Add new user (admin only)"""
    if role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'user' or 'admin'")
    
    user_data = {
        "email": email,
        "role": role,
        "created_by": current_user.email,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    
    db.collection("users").document(email).set(user_data)
    
    return {"message": f"User {email} added with role {role}"}


@router.delete("/admin/users/{user_email}", tags=["admin"])
async def remove_user(
    user_email: str,
    current_user: Annotated[User, Depends(admin_user)]
):
    """Remove user (admin only)"""
    if user_email == current_user.email:
        raise HTTPException(status_code=400, detail="Cannot remove yourself")
    
    db.collection("users").document(user_email).delete()
    
    return {"message": f"User {user_email} removed"}


@router.get("/admin/towns", tags=["admin"])
async def get_town_configs(current_user: Annotated[User, Depends(admin_user)]):
    """Get all town configurations (admin only)"""
    towns = []
    for doc in db.collection("towns").stream():
        town_data = doc.to_dict()
        town_data["id"] = doc.id
        towns.append(town_data)
    return towns


@router.put("/admin/towns/{town_id}", tags=["admin"])
async def update_town_config(
    town_id: str,
    town_config: TownConfig,
    current_user: Annotated[User, Depends(admin_user)]
):
    """Update town configuration (admin only)"""
    doc_ref = db.collection("towns").document(town_id)
    doc_ref.set({
        "name": town_config.name,
        "config": town_config.config,
        "updated_by": current_user.email,
        "updated_at": firestore.SERVER_TIMESTAMP
    })
    
    return {"message": f"Town {town_id} configuration updated"}


@router.get("/admin/stats/global", tags=["admin"])
async def get_global_stats(current_user: Annotated[User, Depends(admin_user)]):
    """Get global statistics across all towns (admin only)"""
    
    # Get total PDR count
    pdr_count = len(list(db.collection("pdr").stream()))
    
    # Get total recogida count
    recogida_count = len(list(db.collection("recogida").stream()))
    
    # Get user count
    user_count = len(list(db.collection("users").stream()))
    
    # Get town count
    town_count = len(list(db.collection("towns").stream()))
    
    # Get recent activity - last 10 recogida entries
    recent_activity = []
    docs = db.collection("recogida").order_by("week", direction=firestore.Query.DESCENDING).limit(10).stream()
    for doc in docs:
        activity = doc.to_dict()
        activity["id"] = doc.id
        recent_activity.append(activity)
    
    return {
        "total_pdrs": pdr_count,
        "total_recogidas": recogida_count,
        "total_users": user_count,
        "total_towns": town_count,
        "recent_activity": recent_activity
    }