from flask import Flask, jsonify, Response, request
from flask_cors import CORS
from typing import List, Tuple, Any
import sqlite3

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """Returns available routes"""
    return (
        "Welcome to Marla's Temperature API!<br/>"
        "Available Routes:<br/>"
        "/api/v1.0/temperature-by-year<br/>"
    )

@app.route("/api/v1.0/temperature-by-year")
def temperature_by_year() -> Response:
    """Return the temperature anomaly data as a JSON Response"""
    query = """
            SELECT year, Anomaly COUNT(DISTINCT(month))
            FROM temperature_anomalies
            GROUP BY year, Anomaly
            ORDER BY year
        """
    return make_json_response(run_sql_command(query))