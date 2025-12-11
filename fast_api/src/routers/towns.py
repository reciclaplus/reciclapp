from typing import List, Optional

from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel

# Environment-aware Firestore client
from ..main import firestore_client as db

router = APIRouter(
    prefix="/towns",
    tags=["towns"],
)


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


@router.get("", response_model=List[Town])
def get_towns():
    towns_ref = db.collection("towns")
    docs = towns_ref.stream()
    towns = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        towns.append(data)
    return towns


@router.get("/{town_id}", response_model=Town)
def get_town(town_id: str):
    doc_ref = db.collection("towns").document(town_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Town not found")
    data = doc.to_dict()
    data["id"] = doc.id
    return data


@router.put("/{town_id}", response_model=Town)
def update_town(town_id: str, town: Town):
    doc_ref = db.collection("towns").document(town_id)
    doc_ref.set(town.dict(exclude_unset=True))
    return town


@router.post("", response_model=Town)
def create_town(town: Town):
    doc_ref = db.collection("towns").document()
    doc_ref.set(town.dict(exclude_unset=True))
    return town


@router.delete("/{town_id}")
def delete_town(town_id: str):
    doc_ref = db.collection("towns").document(town_id)
    doc_ref.delete()
    return {"detail": "Town deleted"}
