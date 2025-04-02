import time
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


def log_pdr_action(action: str, pdr: Pdr):
    log_entry = {
        "action": action,
        "pdr": pdr.dict(),
        "timestamp": firestore.SERVER_TIMESTAMP,
    }
    log_id = str(int(time.time()))
    db.collection("pdr_logs").document(log_id).set(log_entry)


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
    log_pdr_action("update", new_data)
    return new_data


@router.post("/pdr/add", tags=["pdr"])
async def add_pdr(
    new_pdr: Pdr, is_valid_user: Annotated[bool, Depends(valid_user)]
) -> Pdr:
    db.collection("pdr").document(str(new_pdr.internal_id)).set(new_pdr.dict())
    log_pdr_action("add", new_pdr)
    return new_pdr


@router.delete("/pdr/delete/{internal_id}", tags=["pdr"])
async def delete_pdr(
    internal_id: str, is_valid_user: Annotated[bool, Depends(valid_user)]
):
    doc_ref = db.collection("pdr").document(f"{str(internal_id)}")
    doc = doc_ref.get()
    if doc.exists:
        pdr_data = doc.to_dict()
        db.collection("pdr").document(f"{str(internal_id)}").delete()
        log_pdr_action("delete", Pdr(**pdr_data))
    return internal_id
    return internal_id
