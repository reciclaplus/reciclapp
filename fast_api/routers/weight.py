from typing import Annotated

from dependencies import valid_user
from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel, Field, ValidationError

db = firestore.client()

router = APIRouter()

class WeightEntry(BaseModel):
    plasticType: str
    weight: float = Field(..., gt=0, description="Weight must be a positive number")
    date: str

@router.post("/weight", tags=["weight"])
async def add_weight_entry(
    new_weight_entry: WeightEntry, is_valid_user: Annotated[bool, Depends(valid_user)]
):
    try:
        new_weight_entry = WeightEntry(**new_weight_entry.dict())
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=e.errors())

    db.collection("weight").add(new_weight_entry.dict())
    return new_weight_entry

@router.get("/weight", tags=["weight"])
async def get_weight_entries(is_valid_user: Annotated[bool, Depends(valid_user)]):
    collection = db.collection("weight")
    docs = collection.stream()
    return [doc.to_dict() for doc in docs]

@router.delete("/weight/{id}", tags=["weight"])
async def delete_weight_entry(
    id: str, is_valid_user: Annotated[bool, Depends(valid_user)]
):
    doc_ref = db.collection("weight").document(id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Weight entry not found")
    doc_ref.delete()
    return {"message": "Weight entry deleted successfully"}
