import json
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from google.auth.transport import requests
from google.oauth2 import id_token
from pydantic import BaseModel

db = firestore.client()

router = APIRouter()

with open("./client_secret_.json") as f:
    data = json.load(f)
    client_id = data["web"]["client_id"]


class User(BaseModel):
    name: str
    picture: str
    email: str


def get_current_user(id_token_param: str):
    user = id_token.verify_oauth2_token(
        str(id_token_param),
        requests.Request(),
        client_id,
    )

    profile = {"name": user["name"], "picture": user["picture"], "email": user["email"]}

    return User(**profile)


def valid_user(current_user: Annotated[User, Depends(get_current_user)]):
    """Check if the user is a valid user"""
    valid_users = [doc.to_dict()["email"] for doc in db.collection("users").stream()]

    if current_user.email in valid_users:
        return True
    else:
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this resource"
        )


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
