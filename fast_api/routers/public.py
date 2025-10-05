import pandas as pd
from fastapi import APIRouter
from firebase_admin import firestore

db = firestore.client()

router = APIRouter()


@router.get("/public/recogida/get/last_n", tags=["public"])
async def last_n(n: int = 5):
    collection = db.collection("recogida")
    docs = (
        collection.order_by("week", direction=firestore.Query.DESCENDING)
        .limit(n)
        .stream()
    )
    docs_dict = [doc.to_dict() for doc in docs]
    return docs_dict


@router.get("/public/pdr/get_all", tags=["public"])
async def get_pdrs():
    collection = db.collection("pdr")
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
    collection = db.collection("weight")
    docs_dict = [doc.to_dict() for doc in collection.stream()]

    df = pd.DataFrame(docs_dict)
    df["month_year"] = pd.to_datetime(df["date"], format="%d/%m/%Y").dt.to_period("M")
    df = df.groupby("month_year").sum().reset_index()
    df["month_year"] = df["month_year"].astype(str)

    return df[["month_year", "plasticoduro", "galones", "pet"]].to_dict(
        orient="records"
    )


@router.get("/public/pdr/count_by_categoria", tags=["public"])
async def count_pdr_by_categoria():
    collection = db.collection("pdr")
    docs = collection.stream()
    docs_dict = [doc.to_dict() for doc in docs]

    df = pd.DataFrame(docs_dict)
    if df.empty:
        return []

    # Count by categoria
    counts = df.groupby("categoria").size().reset_index(name="count")
    return counts.to_dict(orient="records")


@router.get("/public/recogida/successful_count", tags=["public"])
async def get_successful_recogidas():
    from datetime import datetime, timedelta

    collection = db.collection("recogida")
    docs = [doc.to_dict() for doc in collection.stream()]

    if not docs:
        return {"last_month": 0, "last_year": 0}

    # Extract all recogida records
    all_records = []
    for doc in docs:
        date_str = doc.get("date", "")
        if not date_str:
            continue

        # Get all internal_id entries
        for key, value in doc.items():
            if key not in ["date", "week"] and isinstance(value, dict):
                if value.get("value") == "si":
                    all_records.append({"date": date_str, "internal_id": key})

    if not all_records:
        return {"last_month": 0, "last_year": 0}

    df = pd.DataFrame(all_records)
    df["date"] = pd.to_datetime(df["date"], format="%d/%m/%Y")

    # Calculate date ranges
    now = datetime.now()
    one_month_ago = now - timedelta(days=30)
    one_year_ago = now - timedelta(days=365)

    # Count successful recogidas
    last_month_count = len(df[df["date"] >= one_month_ago])
    last_year_count = len(df[df["date"] >= one_year_ago])

    return {"last_month": last_month_count, "last_year": last_year_count}


@router.get("/public/recogida/weight/total_by_type", tags=["public"])
async def get_total_weight_by_type():
    collection = db.collection("weight")
    docs_dict = [doc.to_dict() for doc in collection.stream()]

    if not docs_dict:
        return {"pet": 0, "plasticoduro": 0, "galones": 0, "basura": 0}

    df = pd.DataFrame(docs_dict)

    # Sum all plastic types
    totals = {
        "pet": float(df["pet"].sum()) if "pet" in df.columns else 0,
        "plasticoduro": float(df["plasticoduro"].sum())
        if "plasticoduro" in df.columns
        else 0,
        "galones": float(df["galones"].sum()) if "galones" in df.columns else 0,
        "basura": float(df["basura"].sum()) if "basura" in df.columns else 0,
    }

    return totals
