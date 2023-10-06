from datetime import datetime, timedelta

import pandas as pd


def get_time_series_data(data, categoria, start, end, barrio="all"):
    df = pd.DataFrame.from_dict(data)
    df["date"] = pd.to_datetime(df["date"], format="%d/%m/%Y")
    df = df[
        (df["date"] >= datetime.strptime(start, "%d/%m/%Y"))
        & (df["date"] <= datetime.strptime(end, "%d/%m/%Y"))
    ]

    if categoria != "all":
        df = df[df["categoria"] == categoria]

    if barrio != "all":
        df = df[df["barrio"] == barrio]

    df = (
        df.groupby(by=["barrio", "date"])
        .sum()
        .reset_index()
        .pivot(index="date", columns="barrio", values="affirmativePdr")
        .reset_index()
    )

    # Add weeks with no collection, if any
    def get_all_mondays(startDate, endDate):
        start = datetime.strptime(startDate, "%d/%m/%Y")
        end = datetime.strptime(endDate, "%d/%m/%Y")
        start += timedelta(days=-start.weekday(), weeks=1)

        mondays = []
        date = start

        while date <= end:
            mondays.append(date)
            date += timedelta(days=7)

        return mondays

    mondays = get_all_mondays(start, end)
    newrows = []
    for monday in mondays:
        if monday not in list(df["date"]):
            newrows.append([monday])

    df2 = pd.DataFrame(newrows, columns=["date"])
    new_df = pd.concat([df, df2])
    new_df = new_df.fillna(0).sort_values("date").reset_index()
    new_df["date"] = new_df["date"].dt.strftime("%d/%m/%Y")

    return new_df.to_json(orient="records", index=False)
