from typing import Annotated

from dependencies import valid_user
from fastapi import APIRouter, Depends
from firebase_admin import firestore
from pydantic import BaseModel

db = firestore.client()

router = APIRouter()


class Pdr(BaseModel):
    id: int
    internal_id: int
    nombre: str
    descripcion: str
    barrio: str
    categoria: str
    comunidad: str
    date_added: str
    lat: float
    lng: float


@router.get("/pdr/get_all", tags=["pdr"])
async def get_pdrs(is_valid_user: Annotated[bool, Depends(valid_user)]):
    collection = db.collection("pdr")
    docs = collection.stream()
    return [doc.to_dict() for doc in docs]


@router.get("/pdr/get/{internal_id}", tags=["pdr"])
async def get_pdr(
    internal_id: str, is_valid_user: Annotated[bool, Depends(valid_user)]
):
    doc_ref = db.collection("pdr").document(internal_id)
    doc = doc_ref.get()
    return doc.to_dict()


@router.post("/pdr/update/{internal_id}", tags=["pdr"])
async def update_pdr(
    internal_id: str, new_data: Pdr, is_valid_user: Annotated[bool, Depends(valid_user)]
):
    db.collection("pdr").document(f"{str(internal_id)}").update(new_data.dict())
    return new_data


@router.post("/pdr/add", tags=["pdr"])
async def add_pdr(
    new_pdr: Pdr, is_valid_user: Annotated[bool, Depends(valid_user)]
) -> Pdr:
    db.collection("pdr").document(str(new_pdr.internal_id)).set(new_pdr.dict())
    return new_pdr


@router.delete("/pdr/delete/{internal_id}", tags=["pdr"])
async def delete_pdr(
    internal_id: str, is_valid_user: Annotated[bool, Depends(valid_user)]
):
    db.collection("pdr").document(f"{str(internal_id)}").delete()
    return internal_id
