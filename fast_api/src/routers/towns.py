from typing import List, Optional

from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel

# Environment-aware Firestore client
from ..main import firestore_client as db

router = APIRouter()


class MapCenter(BaseModel):
    lat: float
    lng: float


class Category(BaseModel):
    value: str
    label: str


class Barrio(BaseModel):
    nombre: str
    color: str
    center: str


class Comunidad(BaseModel):
    nombre: str
    center: str
    barrios: List[Barrio]


class Town(BaseModel):
    id: str
    nombre: str
    file: Optional[str]
    map_center: Optional[MapCenter]
    categories: Optional[List[Category]]
    comunidades: Optional[List[Comunidad]]


@router.get("/towns", response_model=List[Town], tags=["towns"])
def get_towns():
    towns_ref = db.collection("towns")
    docs = towns_ref.stream()
    towns = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        towns.append(data)
    return towns


@router.get("/towns/{town_id}", response_model=Town, tags=["towns"])
def get_town(town_id: str):
    doc_ref = db.collection("towns").document(town_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Town not found")
    data = doc.to_dict()
    data["id"] = doc.id
    return data


@router.put("/towns/{town_id}", response_model=Town, tags=["towns"])
def update_town(town_id: str, town: Town):
    doc_ref = db.collection("towns").document(town_id)
    doc_ref.set(town.dict(exclude_unset=True))
    return town


@router.post("/towns", response_model=Town, tags=["towns"])
def create_town(town: Town):
    doc_ref = db.collection("towns").document()
    doc_ref.set(town.dict(exclude_unset=True))
    return town


@router.delete("/towns/{town_id}", tags=["towns"])
def delete_town(town_id: str):
    doc_ref = db.collection("towns").document(town_id)
    doc_ref.delete()
    return {"detail": "Town deleted"}
