from datetime import date, timedelta

import pandas as pd
from fastapi import APIRouter
from firebase_admin import firestore

# Environment-aware Firestore client
from ..main import firestore_client as db

router = APIRouter()


@router.get("/public/recogida/get/last_n", tags=["public"])
async def last_n(n: int = 5):
    collection_name = "recogida"
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
    collection_name = "pdr"
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
    collection_name = "weight"
    collection = db.collection(collection_name)
    docs_dict = [doc.to_dict() for doc in collection.stream()]

    df = pd.DataFrame(docs_dict)
    df["month_year"] = pd.to_datetime(df["date"], format="%d/%m/%Y").dt.to_period("M")
    df = df.groupby("month_year").sum().reset_index()
    df["month_year"] = df["month_year"].astype(str)

    return df[["month_year", "plasticoduro", "galones", "pet"]].to_dict(
        orient="records"
    )


@router.get("/public/recogida/weight/total_by_type", tags=["public"])
async def get_total_weight_by_type():
    """Get total weight collected by plastic type (plasticoduro, pet, galones)"""
    collection_name = "weight"
    collection = db.collection(collection_name)
    docs_dict = [doc.to_dict() for doc in collection.stream()]

    df = pd.DataFrame(docs_dict)

    # Sum all weights by type
    total_plasticoduro = df["plasticoduro"].sum() if "plasticoduro" in df.columns else 0
    total_pet = df["pet"].sum() if "pet" in df.columns else 0
    total_galones = df["galones"].sum() if "galones" in df.columns else 0

    return {
        "plasticoduro": float(total_plasticoduro),
        "pet": float(total_pet),
        "galones": float(total_galones),
        "total": float(total_plasticoduro + total_pet + total_galones),
    }


@router.get("/public/recogida/successful_count", tags=["public"])
async def get_successful_recogidas_count():
    """Get count of successful recogidas for last month and last year"""
    current_date = date.today()
    one_month_ago = current_date - timedelta(days=30)
    one_year_ago = current_date - timedelta(days=365)

    # Get week numbers for filtering
    month_week = int(one_month_ago.strftime("%Y%W"))
    year_week = int(one_year_ago.strftime("%Y%W"))

    # Get all recogidas
    collection = db.collection("recogida")
    docs = collection.stream()

    month_count = 0
    year_count = 0

    for doc in docs:
        doc_dict = doc.to_dict()
        week = doc_dict.get("week", 0)

        # Count successful recogidas (value == "si")
        successful_in_week = sum(
            1
            for key, value in doc_dict.items()
            if isinstance(value, dict) and value.get("value") == "si"
        )

        if week >= month_week:
            month_count += successful_in_week
        if week >= year_week:
            year_count += successful_in_week

    return {"last_month": month_count, "last_year": year_count}


@router.get("/public/towns/count", tags=["public"])
async def get_comunidades_count():
    """Get total count of comunidades across all towns"""
    towns_ref = db.collection("towns")
    docs = towns_ref.stream()

    total_comunidades = 0
    for doc in docs:
        data = doc.to_dict()
        comunidades = data.get("comunidades", [])
        total_comunidades += len(comunidades)

    return {"count": total_comunidades}
