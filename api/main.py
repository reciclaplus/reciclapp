import datetime
import json
import os
from datetime import date, datetime, timedelta

import flask
import google.oauth2.credentials
from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import storage
from google_auth_oauthlib.flow import Flow

from time_series_data import get_time_series_data

app = Flask(__name__)
CORS(app)
app.secret_key = "yoreciclo"


@app.route("/hello", methods=['GET', 'POST'])
def hello():
  return "hello world"

@app.route("/add-date-added", methods=['POST'])
def add_date_added():
  pdr = request.json
  for ipdr in pdr:
    if "recogida" in ipdr.keys():
      recogida = ipdr["recogida"]
      dates = [datetime.strptime(week["date"], '%d/%m/%Y') for week in recogida]
      date_added = datetime.strftime(min(dates), '%d/%m/%Y')
      ipdr["dateAdded"] = date_added
  return jsonify(pdr)

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
  if 'barrio' in request.args:
    barrio = request.args.get("barrio")
  else:
    barrio = 'all'
  start = request.args.get("start")
  end = request.args.get("end")
  data = request.json
  
  return get_time_series_data(data, categoria, start, end, barrio)

@app.route("/download-file", methods=['GET', 'POST'])
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

    return flask.redirect('http://localhost:3000')

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
