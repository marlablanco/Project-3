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
        "Welcome to the Ginger Disasters API!<br/>"
        "Available Routes:<br/>"
        "/api/v1.0/disasters-by-year<br/>"
    )

@app.route("/api/v1.0/disasters-by-year")
def disasters_by_year() -> Response:
    """Return the disaster data as a JSON Response"""
    query = """
            SELECT fy_declared, COUNT(DISTINCT(disaster_number))
            FROM disasters
            GROUP BY fy_declared
            ORDER BY fy_declared
        """
    return make_json_response(run_sql_command(query))

@app.route("/api/v1.0/disasters-by-date", methods=["GET"])
def disasters_by_date() -> Response:
    """Returns disaster columns between start and end, if given"""
    args = request.args
    start_date = int(args.get("start")) if args.get("start") else None
    end_date = int(args.get("end")) if args.get("end") else None
    columns = args.get("col")
    groups = args.get("groups")
    order = args.get("order")

    query = f"SELECT {columns if columns else '*'} FROM disasters"
    if start_date or end_date:
        query = f'{query} WHERE'
        if start_date:
            query = f'{query} fy_declared >= {start_date}'
            if end_date:
                query = f'{query} AND'
        if end_date:
            query = f'{query} fy_declared < {end_date}'
    if groups:
        query = f'{query} GROUP BY {groups}'
    if order:
        query = f'{query} ORDER BY {order}'

    return make_json_response(run_sql_command(query))

@app.route("/api/v1.0/world-disaster-by-year")
def temperature_by_year():
    """Return the world disasters by year as a JSON Response"""
    query = """
            SELECT year, disaster_type, COUNT(*) AS count
            FROM world_disasters_1970_2021
            GROUP BY year, disaster_type
            ORDER BY year
            """
    return make_json_response(run_sql_command(query))


@app.route("/")
def welcome1():
    """Returns available route"""
    return (
        "Welcome to Marla's Temperature API!<br/>"
        "Available Routes:<br/>"
        "/api/v1.0/temperature-by-year<br/>"
    )

@app.route("/api/v1.0/temperature-by-year")
def temp_by_year() -> Response:
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
def temp_anomalies() -> Response:
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

#################################################
# Helper Functions
#################################################

def run_sql_command(command: str) -> List[Tuple[Any, ...]]:
    """Runs the given SQL command and returns the records as a list of tuples"""
    conn = sqlite3.connect("../data/natural_disasters_db.sqlite")
    cur = conn.cursor()
    cur.execute(command)
    records = cur.fetchall()
    cur.close()
    conn.close()
    return records

def make_json_response(content) -> Response:
    """Turns a piece of content into a json Response with CORS"""
    response = jsonify(content)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    app.run(debug=True)
