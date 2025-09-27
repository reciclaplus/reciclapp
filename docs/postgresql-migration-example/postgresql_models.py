"""
SQLAlchemy models for PostgreSQL migration
Replaces Firebase/Firestore collections with SQL tables
"""

from sqlalchemy import Boolean, Column, Decimal, ForeignKey, Integer, String, Text, DateTime, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()


class User(Base):
    """User model - replaces Firestore 'users' collection"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    picture = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


class PDR(Base):
    """PDR (Points of Recycling) model - replaces Firestore 'pdr' collection"""
    __tablename__ = "pdr"
    
    id = Column(Integer, primary_key=True)
    internal_id = Column(Integer, unique=True, nullable=False)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text)
    barrio = Column(String(255), nullable=False)
    categoria = Column(String(100), nullable=False)
    comunidad = Column(String(255))
    date_added = Column(TIMESTAMP, server_default=func.now())
    lat = Column(Decimal(10, 8), nullable=False)
    lng = Column(Decimal(11, 8), nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    recogidas = relationship("Recogida", back_populates="pdr")
    logs = relationship("PDRLog", back_populates="pdr")


class Recogida(Base):
    """Collection/pickup model - replaces Firestore 'recogida' collection"""
    __tablename__ = "recogida"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pdr_id = Column(Integer, ForeignKey("pdr.id", ondelete="CASCADE"))
    pdr_internal_id = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    week = Column(Integer, nullable=False)
    was_collected = Column(String(20), nullable=False, default="no")
    weight = Column(Decimal(10, 2))
    notes = Column(Text)
    collected_by = Column(String(255))
    collection_date = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    pdr = relationship("PDR", back_populates="recogidas")


class PDRLog(Base):
    """PDR action logs - replaces Firestore 'pdr_logs' collection"""
    __tablename__ = "pdr_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    action = Column(String(50), nullable=False)
    pdr_id = Column(Integer, ForeignKey("pdr.id", ondelete="SET NULL"))
    pdr_data = Column(JSONB)  # Store the full PDR data as JSON
    user_email = Column(String(255))
    timestamp = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    pdr = relationship("PDR", back_populates="logs")


# Pydantic models for API responses (equivalent to current FastAPI models)
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class PDRResponse(BaseModel):
    id: int
    internal_id: int
    nombre: str
    descripcion: Optional[str] = None
    barrio: str
    categoria: str
    comunidad: Optional[str] = None
    date_added: datetime
    lat: float
    lng: float
    active: bool = True
    
    class Config:
        from_attributes = True


class RecogidaResponse(BaseModel):
    id: str
    pdr_internal_id: int
    year: int
    week: int
    was_collected: str
    weight: Optional[float] = None
    notes: Optional[str] = None
    collected_by: Optional[str] = None
    collection_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PDRLogResponse(BaseModel):
    id: str
    action: str
    pdr_id: Optional[int] = None
    pdr_data: Optional[dict] = None
    user_email: Optional[str] = None
    timestamp: datetime
    
    class Config:
        from_attributes = True