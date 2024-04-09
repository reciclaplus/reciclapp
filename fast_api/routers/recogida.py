from datetime import date, timedelta
from typing import Annotated

import pandas as pd
from dependencies import valid_user
from fastapi import APIRouter, Depends
from firebase_admin import firestore

db = firestore.client()

router = APIRouter()


@router.get("/recogida/get/last_n", tags=["recogida"])
async def last_n(is_valid_user: Annotated[bool, Depends(valid_user)], n: int = 5):
    collection = db.collection("recogida")
    docs = (
        collection.order_by("week", direction=firestore.Query.DESCENDING)
        .limit(n)
        .stream()
    )
    docs_dict = [doc.to_dict() for doc in docs]

    return docs_dict


@router.get("/recogida/get/{year}/{week}/{id}", tags=["recogida"])
async def get_individual_id_week(
    is_valid_user: Annotated[bool, Depends(valid_user)], year: int, week: int, id: str
):
    if week < 10:
        week = f"0{week}"
    doc = db.collection("recogida").document(f"{year}{week}").get()
    if not doc.exists:
        return {}
    return doc.to_dict()[id]


@router.get("/recogida/get/{year}/{week}", tags=["recogida"])
async def get_week(
    is_valid_user: Annotated[bool, Depends(valid_user)], year: int, week: int
):
    if week < 10:
        week = f"0{week}"
    doc = db.collection("recogida").document(f"{year}{week}").get()
    if not doc.exists:
        return {}
    return doc.to_dict()


@router.post("/recogida/set/{year}/{week}", tags=["recogida"])
async def set_week(
    is_valid_user: Annotated[bool, Depends(valid_user)],
    year: int,
    week: int,
    recogida: dict,
):
    if week < 10:
        week = f"0{week}"
    week_doc = db.collection("recogida").document(f"{year}{week}").get()
    if not week_doc.exists:
        db.collection("recogida").document(f"{year}{week}").set(recogida)
        db.collection("recogida").document(f"{year}{week}").update(
            {"week": int(f"{year}{week}"), "date": list(recogida.values())[0]["date"]}
        )
    else:
        db.collection("recogida").document(f"{year}{week}").update(recogida)

    return recogida


@router.get("/recogida/get/last_n_by_barrio", tags=["recogida"])
async def last_n_by_barrio(
    is_valid_user: Annotated[bool, Depends(valid_user)],
    n: int = 5,
    category: str = None,
    barrio: str = None,
):
    current_date = date.today()

    if n == -1:
        start_date = date(2021, 1, 1)
    else:
        start_date = current_date - timedelta(weeks=n)

    dr = pd.DataFrame(
        pd.date_range(start_date, current_date, freq="W-MON").tolist(),
        columns=["date"],
    )

    start_week = start_date.isocalendar().week
    if start_week < 10:
        start_week = f"0{start_week}"
    start_year = start_date.isocalendar().year

    if category != "all" and barrio != "all":
        pdrs = pd.DataFrame(
            [
                doc.to_dict()
                for doc in db.collection("pdr")
                .where("categoria", "==", category)
                .where("barrio", "==", barrio)
                .stream()
            ]
        )
    else:
        pdrs = pd.DataFrame([doc.to_dict() for doc in db.collection("pdr").stream()])

    if category != "all":
        pdrs = pdrs[pdrs["categoria"] == category]
    if barrio != "all":
        pdrs = pdrs[pdrs["barrio"] == barrio]

    docs = [
        doc.to_dict()
        for doc in db.collection("recogida")
        .where("week", ">", int(f"{start_year}{start_week}"))
        .stream()
    ]

    values = [list(x.values()) for x in docs if x not in ["date", "week"]]
    values = [x for xs in values for x in xs if isinstance(x, dict)]

    if len(values) == 0:
        empty_result = []
        date_range = (
            pd.date_range(start_date, current_date, freq="W-MON")
            .strftime("%d/%m/%Y")
            .tolist()
        )
        barrios = pdrs["barrio"].unique()
        for d in date_range:
            empty_dict = {barrio: 0 for barrio in barrios}
            empty_dict["date"] = d
            empty_result.append(empty_dict)
        return empty_result

    recogida = pd.DataFrame(values)
    recogida = recogida.merge(pdrs, on="internal_id", how="inner")
    recogida["date"] = pd.to_datetime(recogida["date"], format="%d/%m/%Y")

    recogida_grouped = (
        recogida.groupby(["barrio", "date"])["value"]
        .apply(lambda x: (x == "si").sum())
        .reset_index()
        .pivot(index="date", columns="barrio", values="value")
        .fillna(0)
        .reset_index()
    )

    result = recogida_grouped
    result = dr.merge(result, how="left", on="date").fillna(0).sort_values("date")
    result["date"] = result["date"].dt.strftime("%d/%m/%Y")

    return result.to_dict(orient="records")


@router.get("/recogida/weight/get", tags=["recogida"])
async def get_weight(is_valid_user: Annotated[bool, Depends(valid_user)]):
    collection = db.collection("weight")
    docs_dict = [doc.to_dict() for doc in collection.stream()]
    return docs_dict


@router.post("/recogida/weight/set/{id}", tags=["recogida"])
async def set_weight(
    is_valid_user: Annotated[bool, Depends(valid_user)], id: int, new_weight: dict
):
    collection = db.collection("weight").document(f"{id}").set(new_weight)
    docs_dict = [doc.to_dict() for doc in collection.stream()]
    return docs_dict


@router.post("/recogida/weight/update/{id}", tags=["recogida"])
async def update_weight(
    is_valid_user: Annotated[bool, Depends(valid_user)], id: int, new_weight: dict
):
    collection = db.collection("weight").document(f"{id}").update(new_weight)
    docs_dict = [doc.to_dict() for doc in collection.stream()]
    return docs_dict


@router.delete("/recogida/weight/delete/{id}", tags=["recogida"])
async def delete_weight(is_valid_user: Annotated[bool, Depends(valid_user)], id: int):
    db.collection("weight").document(f"{id}").delete()
    return id
