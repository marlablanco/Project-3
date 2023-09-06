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
    """Returns available route"""
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

# flask route for retrieving temperature anomaly data
@app.route("/api/v1.0/temperature-anomalies", methods=["GET"])
def temperature_anomalies() -> Response:
    """returns temperature anomaly data with filtering/aggregation options"""

    # retrieve query parameters from request
    args = request.args
    start_year = int(args.get("start_year")) if args.get("start_year") else None
    end_year = int(args.get("end_year")) if args.get("end_year") else None
    group_by = args.get("group_by")
    order_by = args.get("order_by")

    # construct the SQL query
    query = f"SELECT year, month, Anomaly FROM temperature_anomalies WHERE 1"

    if start_year:
        query += f" AND year >= {start_year}"

    if end_year:
        query += f" AND year <= {end_year}"

    if group_by:
        query += f" GROUP BY {group_by}"

    if order_by:
        query += f" ORDER BY {order_by}"

    # execute SQL query and retrieve data
    data = run_sql_command(query)

    # return the data as JSON response
    return make_json_response(data)
