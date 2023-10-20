import datetime
import json
import os
from datetime import date, datetime, timedelta

import flask
import google.oauth2.credentials
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from google.cloud import storage
from google_auth_oauthlib.flow import Flow
from time_series_data import get_time_series_data

app = Flask(__name__)
CORS(app)
app.secret_key = "yoreciclo"


@app.route("/hello", methods=["GET", "POST"])
def hello():
    return "hello world"


@app.route("/add-community", methods=["POST"])
def add_community():
    print("hello")
    pdr = request.json
    for ipdr in pdr:
        ipdr["comunidad"] = "Sabana Yegua"
    return jsonify(pdr)


@app.route("/add-date-added", methods=["POST"])
def add_date_added():
    pdr = request.json

    for ipdr in pdr:
        if "recogida" in ipdr.keys():
            recogida = ipdr["recogida"]
            if len(recogida) < 1:
                print(ipdr)
            else:
                dates = [
                    datetime.strptime(week["date"], "%d/%m/%Y") for week in recogida
                ]
                date_added = datetime.strftime(min(dates), "%d/%m/%Y")
                ipdr["dateAdded"] = date_added
    return jsonify(pdr)


@app.route("/add-date-to-recogida", methods=["GET", "POST"])
def add_date():
    pdr = request.json
    for ipdr in pdr:
        if "recogida" in ipdr.keys():
            recogida = ipdr["recogida"]
            for week in recogida:
                if "date" in week.keys():
                    continue
                else:
                    recogida_date = date(week["year"], 1, 1) + timedelta(
                        weeks=week["week"]
                    )
                    recogida_date = recogida_date - timedelta(
                        days=recogida_date.weekday()
                    )
                    week["date"] = recogida_date.strftime("%d/%m/%Y")

    return jsonify(pdr)


@app.route("/time-series-data", methods=["GET", "POST"])
def time_series_data():
    categoria = request.args.get("categoria")
    if "barrio" in request.args:
        barrio = request.args.get("barrio")
    else:
        barrio = "all"
    start = request.args.get("start")
    end = request.args.get("end")
    data = request.json

    return get_time_series_data(data, categoria, start, end, barrio)


@app.route("/download-file", methods=["GET", "POST"])
def download_file():
    accessToken = request.args.get("token")
    file = request.args.get("file")
    bucket = request.args.get("bucket")
    # Load credentials
    credentials = google.oauth2.credentials.Credentials(accessToken)

    storage_client = storage.Client("norse-voice", credentials=credentials)
    bucket = storage_client.bucket(bucket)
    blob = bucket.blob(file)
    try:
        contents = blob.download_as_bytes()
    except Exception as e:
        return e.message

    return json.loads(contents)


if __name__ == "__main__":
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
    app.run()
