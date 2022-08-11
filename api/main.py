import datetime
import json
import os
from datetime import date, datetime, timedelta

import flask
import google.oauth2.credentials
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from google.auth.transport import requests
from google.cloud import storage
from google.oauth2 import id_token
from google_auth_oauthlib import flow
from google_auth_oauthlib.flow import Flow

from time_series_data import get_time_series_data

app = Flask(__name__)
CORS(app)
app.secret_key = "yoreciclo"


@app.route("/hello", methods=['GET', 'POST'])
def hello():
  return "hello world"

@app.route("/add-date-to-recogida", methods=['GET', 'POST'])
def add_date():
  pdr = request.json
  for ipdr in pdr:
    if "recogida" in ipdr.keys():
      recogida = ipdr["recogida"]
      for week in recogida:
        if "date" in week.keys():
          continue
        else:
          recogida_date = date(week["year"], 1, 1) + timedelta(weeks=week["week"])
          recogida_date = recogida_date - timedelta(days=recogida_date.weekday())
          week["date"] = recogida_date.strftime("%d/%m/%Y")
  
  return jsonify(pdr)

@app.route("/time-series-data", methods=['GET', 'POST'])
def time_series_data():

  categoria = request.args.get("categoria")
  start = request.args.get("start")
  end = request.args.get("end")
  data = request.json
  
  return get_time_series_data(data, categoria, start, end)

@app.route("/download-file")
def download_file():
    # Load credentials from the session.
    credentials = google.oauth2.credentials.Credentials(
      **flask.session['credentials'])


    storage_client = storage.Client("project-name", credentials=credentials)
    buckets = storage_client.list_buckets()
    bucket = storage_client.bucket("bucket-name")
    blob = bucket.blob("file-name.json")
    contents = blob.download_as_string()

    return {"data": json.loads(contents)}

@app.route("/authorise")
def authorise():
    flow = Flow.from_client_secrets_file(
      'client_secret.json', scopes=["https://www.googleapis.com/auth/devstorage.read_only"])

    flow.redirect_uri = flask.url_for('oauth2callback', _external=True)
    authorization_url, state = flow.authorization_url(
    # Enable offline access so that you can refresh an access token without
    # re-prompting the user for permission. Recommended for web server apps.
    access_type='offline',
    # Enable incremental authorization. Recommended as a best practice.
    # include_granted_scopes='true'
    )

    flask.session['state'] = state

    return flask.redirect(authorization_url)

@app.route('/oauth2callback')
def oauth2callback():
  # Specify the state when creating the flow in the callback so that it can
  # verified in the authorization server response.
    state = flask.session['state']

    flow = Flow.from_client_secrets_file(
        'client_secret.json', scopes=["https://www.googleapis.com/auth/devstorage.read_only"])
    flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

    # Use the authorization server's response to fetch the OAuth 2.0 tokens.
    authorization_response = flask.request.url
    flow.fetch_token(authorization_response=authorization_response)

    # Store credentials in the session.
    # ACTION ITEM: In a production app, you likely want to save these
    #              credentials in a persistent database instead.
    credentials = flow.credentials
    flask.session['credentials'] = credentials_to_dict(credentials)

    return flask.redirect('download-file')

def credentials_to_dict(credentials):
    return {'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes}

if __name__ == "__main__":
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    app.run()
