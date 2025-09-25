import pandas as pd
from fastapi import APIRouter
from firebase_admin import firestore

# Import environment configuration
from ..config import config

db = firestore.client()

router = APIRouter()


@router.get("/public/recogida/get/last_n", tags=["public"])
async def last_n(n: int = 5):
    # Use environment-aware collection name
    collection_name = config.get_collection_name("recogida")
    collection = db.collection(collection_name)
    docs = (
        collection.order_by("week", direction=firestore.Query.DESCENDING)
        .limit(n)
        .stream()
    )
    docs_dict = [doc.to_dict() for doc in docs]
    return docs_dict


@router.get("/public/pdr/get_all", tags=["public"])
async def get_pdrs():
    # Use environment-aware collection name
    collection_name = config.get_collection_name("pdr")
    collection = db.collection(collection_name)
    docs = collection.stream()

    keys = [
        "internal_id",
        "comunidad",
        "barrio",
        "categoria",
        "date_added",
    ]  # Replace with your keys
    return [{key: doc.to_dict().get(key, None) for key in keys} for doc in docs]


@router.get("/public/recogida/weight/get", tags=["recogida"])
async def get_weight():
    # Use environment-aware collection name
    collection_name = config.get_collection_name("weight")
    collection = db.collection(collection_name)
    docs_dict = [doc.to_dict() for doc in collection.stream()]

    df = pd.DataFrame(docs_dict)
    df["month_year"] = pd.to_datetime(df["date"], format="%d/%m/%Y").dt.to_period("M")
    df = df.groupby("month_year").sum().reset_index()
    df["month_year"] = df["month_year"].astype(str)

    return df[["month_year", "plasticoduro", "galones", "pet"]].to_dict(
        orient="records"
    )
