"""
Updated FastAPI dependencies for PostgreSQL
This replaces the current Firebase/Firestore dependencies
"""

import os
from typing import Annotated, Generator
from contextlib import contextmanager

from fastapi import Depends, Header, HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from google.auth.transport import requests
from google.oauth2 import id_token
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from pydantic import BaseModel

from postgresql_models import User as UserModel

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://reciclapp_user:reciclapp_secure_password_2024@localhost:5432/reciclapp"
)

# Create SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency to get database session
def get_db() -> Generator[Session, None, None]:
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# User model for API responses (same as current)
class User(BaseModel):
    name: str
    picture: str
    email: str


# Authentication functions (updated to work with PostgreSQL)
def get_current_user(authorization: Annotated[str, Header()] = None) -> User:
    """Get current user from Google OAuth token"""
    if authorization is None or "undefined" in authorization:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )
    
    token = authorization.split(" ")[1]
    creds = Credentials(token=token)
    
    user_info_service = build("oauth2", "v2", credentials=creds)
    user_info = user_info_service.userinfo().get().execute()
    
    profile = {
        "name": user_info["name"],
        "picture": user_info["picture"],
        "email": user_info["email"],
    }
    
    return User(**profile)


def valid_user(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)]
) -> bool:
    """Check if the user is a valid user (PostgreSQL version)"""
    
    # Query valid users from PostgreSQL instead of Firestore
    valid_users_query = db.query(UserModel.email).all()
    valid_users = [user.email for user in valid_users_query]
    
    if current_user.email in valid_users:
        return True
    else:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )


# Database utility functions
@contextmanager
def get_db_transaction():
    """Context manager for database transactions"""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def create_user_if_not_exists(db: Session, user_data: User) -> UserModel:
    """Create user in database if it doesn't exist"""
    existing_user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
    
    if not existing_user:
        db_user = UserModel(
            email=user_data.email,
            name=user_data.name,
            picture=user_data.picture
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    return existing_user


# Example of how to update an existing router function
"""
# OLD Firestore version:
from firebase_admin import firestore
db = firestore.client()

@router.get("/pdr/get_all")
async def get_pdrs(is_valid_user: Annotated[bool, Depends(valid_user)]):
    collection = db.collection("pdr")
    docs = collection.stream()
    return [doc.to_dict() for doc in docs]

# NEW PostgreSQL version:
from sqlalchemy.orm import Session
from postgresql_models import PDR

@router.get("/pdr/get_all")
async def get_pdrs(
    is_valid_user: Annotated[bool, Depends(valid_user)],
    db: Annotated[Session, Depends(get_db)]
):
    pdrs = db.query(PDR).filter(PDR.active == True).all()
    return [PDRResponse.from_orm(pdr) for pdr in pdrs]
"""