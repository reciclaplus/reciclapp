from datetime import datetime, timedelta

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


@router.get("/public/recogida/stats/successful", tags=["public"])
async def get_successful_recogidas():
    """Get successful recogidas count for last month and year"""
    collection = db.collection("recogida")
    docs = collection.stream()

    now = datetime.now()
    one_month_ago = now - timedelta(days=30)
    one_year_ago = now - timedelta(days=365)

    last_month_count = 0
    last_year_count = 0

    for doc in docs:
        doc_dict = doc.to_dict()
        # Skip metadata fields
        if "week" in doc_dict or "date" in doc_dict:
            doc_date_str = doc_dict.get("date")
            if doc_date_str:
                try:
                    doc_date = datetime.strptime(doc_date_str, "%d/%m/%Y")

                    # Count successful recogidas (value == 'si')
                    successful_count = sum(
                        1
                        for key, value in doc_dict.items()
                        if isinstance(value, dict) and value.get("value") == "si"
                    )

                    if doc_date >= one_month_ago:
                        last_month_count += successful_count
                    if doc_date >= one_year_ago:
                        last_year_count += successful_count
                except (ValueError, TypeError):
                    continue

    return {"last_month": last_month_count, "last_year": last_year_count}


@router.get("/public/recogida/weight/totals", tags=["public"])
async def get_weight_totals():
    """Get total weight by plastic type"""
    collection = db.collection("weight")
    docs_dict = [doc.to_dict() for doc in collection.stream()]

    if not docs_dict:
        return {"plasticoduro": 0, "galones": 0, "pet": 0, "total": 0}

    df = pd.DataFrame(docs_dict)

    totals = {
        "plasticoduro": float(df["plasticoduro"].sum()) if "plasticoduro" in df else 0,
        "galones": float(df["galones"].sum()) if "galones" in df else 0,
        "pet": float(df["pet"].sum()) if "pet" in df else 0,
    }
    totals["total"] = totals["plasticoduro"] + totals["galones"] + totals["pet"]

    return totals


@router.get("/public/pdr/stats/by_categoria", tags=["public"])
async def get_pdr_by_categoria():
    """Get PDR count by categoria"""
    collection = db.collection("pdr")
    docs = collection.stream()

    categoria_counts = {}
    for doc in docs:
        doc_dict = doc.to_dict()
        categoria = doc_dict.get("categoria", "otros")
        categoria_counts[categoria] = categoria_counts.get(categoria, 0) + 1

    return categoria_counts
