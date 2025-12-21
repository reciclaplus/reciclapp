from datetime import date, timedelta

import pandas as pd
from fastapi import APIRouter

# Environment-aware Firestore client
from ..main import firestore_client as db

router = APIRouter()


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


@router.get("/public/recogida/weight/total_by_type", tags=["public"])
async def get_total_weight_by_type():
    """Get total weight collected by plastic type (plasticoduro, pet, galones)"""
    collection_name = "weight"
    collection = db.collection(collection_name)
    docs_dict = [doc.to_dict() for doc in collection.stream()]

    df = pd.DataFrame(docs_dict)
    df[["plasticoduro", "pet", "galones"]] = (
        df[["plasticoduro", "pet", "galones"]].replace("", 0).astype(float).fillna(0)
    )

    # Sum all weights by type
    total_plasticoduro = (
        df["plasticoduro"].astype(float).sum() if "plasticoduro" in df.columns else 0
    )
    total_pet = df["pet"].astype(float).sum() if "pet" in df.columns else 0
    total_galones = df["galones"].astype(float).sum() if "galones" in df.columns else 0

    return {
        "plasticoduro": float(total_plasticoduro),
        "pet": float(total_pet),
        "galones": float(total_galones),
        "total": float(total_plasticoduro + total_pet + total_galones),
    }


@router.get("/public/recogida/successful_count", tags=["public"])
async def get_successful_recogidas_count():
    """Get count of successful recogidas for last month, last year, and all time"""
    current_date = date.today()
    one_month_ago = current_date - timedelta(days=30)
    one_year_ago = current_date - timedelta(days=365)

    # Get ISO week numbers for filtering (consistent with existing code)
    # Format: YYYYWW (e.g., 202453)
    month_iso = one_month_ago.isocalendar()
    month_week = int(f"{month_iso.year}{month_iso.week:02d}")

    year_iso = one_year_ago.isocalendar()
    year_week = int(f"{year_iso.year}{year_iso.week:02d}")

    # Get all recogidas
    collection = db.collection("recogida")
    docs = collection.stream()

    month_count = 0
    year_count = 0
    total_count = 0

    for doc in docs:
        doc_dict = doc.to_dict()
        week = doc_dict.get("week", 0)

        # Count successful recogidas (value == "si")
        successful_in_week = sum(
            1
            for key, value in doc_dict.items()
            if isinstance(value, dict) and value.get("value") == "si"
        )

        total_count += successful_in_week
        if week >= month_week:
            month_count += successful_in_week
        if week >= year_week:
            year_count += successful_in_week

    return {"last_month": month_count, "last_year": year_count, "total": total_count}
