from flask import Flask, jsonify, Response, request
from flask_cors import CORS
import json
from operator import eq, le, ge, ne, lt, gt
from pathlib import Path
from typing import List, Tuple, Any
from sqlalchemy import create_engine, Column, func, distinct
from sqlalchemy.orm import Session
from orm_local import Base, disasters, temperature_anomalies, world_disasters_1970_2021

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = False
CORS(app)

FIPS_TO_STATE = json.loads(
    Path("../data/fipsToState.json").read_text(encoding="utf-8"))
GEOJSON_COUNTIES_FIPS = json.loads(
    Path("../data/geojson-counties-fips.json").read_text(encoding="utf-8")
)
GEOJSON_COUNTIES = json.loads(
    Path("../data/counties.geojson").read_text(encoding="utf-8"))

#################################################
# Flask Routes
#################################################

########################
# Jason's routes


@app.route("/")
def welcome():
    """Returns available routes"""
    return (
        "Welcome to the Ginger Disasters API!<br/>"
        "Available Routes:<br/>"
        "/api/v1.0/disasters-by-year<br/>"
    )


@app.route("/api/v1.0/us-disasters-by-year", methods=["GET"])
def disasters_by_date() -> Response:
    """Returns disaster columns between start and end, if given"""
    args = request.args

    # columns
    cols: List[Column] = [disasters.fy_declared,
                          func.count(distinct(disasters.disaster_number))]

    # if they checked the temperature box, we need to join
    joins: List[Tuple[Column, Column]] = []
    if bool(int(args.get("add_temp"))) if args.get("add_temp") else False:
        cols.append(func.avg(temperature_anomalies.Anomaly))
        joins.append((disasters.fy_declared, temperature_anomalies.year))

    groups = [disasters.fy_declared]
    order = [disasters.fy_declared]

    filters: List[Tuple[Column, str, int | float | str]] = []
    start_date = int(args.get("start")) if args.get("start") else None
    if start_date:
        filters.append((disasters.fy_declared, ">=", start_date))
    end_date = int(args.get("end")) if args.get("end") else None
    if end_date:
        filters.append((disasters.fy_declared, "<=", end_date))
    disaster_type = args.get("type")
    if disaster_type:
        filters.append((disasters.incident_type, "==", disaster_type))

    return make_json_response(run_sql_command(cols, filters, groups, order, joins))


@app.route("/api/v1.0/us-disasters-by-year-and-location", methods=["GET"])
def disasters_by_year_and_location() -> Response:
    args = request.args

    cols: List[Column] = [
        disasters.fips_state_code, disasters.fips_county_code]
    filters: List[Tuple[Column, str, int | float | str]] = []
    start_date = int(args.get("start")) if args.get("start") else None
    if start_date:
        filters.append((disasters.fy_declared, ">=", start_date))
    end_date = int(args.get("end")) if args.get("end") else None
    if end_date:
        filters.append((disasters.fy_declared, "<=", end_date))
    disaster_type = args.get("type")
    if disaster_type:
        filters.append((disasters.incident_type, "==", disaster_type))

    return make_json_response(run_sql_command(cols, filters))


@app.route("/api/v1.0/us-disaster-types")
def us_disaster_types() -> Response:
    return make_json_response(
        run_sql_command([distinct(disasters.incident_type)],
                        order=[disasters.incident_type])
    )


@app.route("/api/v1.0/us-disaster-years")
def us_disaster_years() -> Response:
    return make_json_response(
        run_sql_command([distinct(disasters.fy_declared)],
                        order=[disasters.fy_declared])
    )


################################
# Marla's routes


@app.route("/api/v1.0/temperature-by-month", methods=["GET"])
def temp_by_year() -> Response:
    """Return the temperature anomaly data as a JSON Response"""
    args = request.args
    selected_year = int(args.get("selected_year")) if args.get(
        "selected_year") else None

    columns = [temperature_anomalies.month, temperature_anomalies.Anomaly]
    order_by = [temperature_anomalies.month]
    filters = [(temperature_anomalies.year, "==", selected_year)]
    return make_json_response(run_sql_command(columns, filters, order=order_by))


# flask route for retrieving temperature anomaly data
@app.route("/api/v1.0/temperature-by-year", methods=["GET"])
def temp_anomalies() -> Response:
    """returns temperature anomaly data with filtering/aggregation options"""

    # retrieve query parameters from request
    args = request.args
    start_year = int(args.get("start_year")) if args.get(
        "start_year") else None
    end_year = int(args.get("end_year")) if args.get("end_year") else None
    group_by = [temperature_anomalies.year]
    order_by = [temperature_anomalies.year]
    filters = [
        (temperature_anomalies.year, ">=", start_year),
        (temperature_anomalies.year, "<=", end_year),
    ]

    columns = [temperature_anomalies.year,
               func.avg(temperature_anomalies.Anomaly)]

    # execute SQL query and retrieve data
    data = run_sql_command(columns, filters, group_by, order_by)

    # return the data as JSON response
    return make_json_response(data)


##############################
# Ryan's routes


@app.route("/api/v1.0/world-disaster-by-year", methods=["GET"])
def world_disaster_by_year():
    """Return the world disasters by year as a JSON Response"""

    args = request.args
    start_year = int(args.get("start_year")) if args.get(
        "start_year") else None
    end_year = int(args.get("end_year")) if args.get("end_year") else None
    chosen_type = args.get("type")
    columns = [world_disasters_1970_2021.year, func.sum(
        world_disasters_1970_2021.total_deaths)]
    groupby = [world_disasters_1970_2021.year]
    orderby = [world_disasters_1970_2021.year]
    filters = [
        (world_disasters_1970_2021.year, '>=', start_year),
        (world_disasters_1970_2021.year, '<=', end_year),
    ]
    if chosen_type:
        filters.append(
            (world_disasters_1970_2021.disaster_type, '=', chosen_type))
    return make_json_response(run_sql_command(columns, filters, groupby, orderby))


#################################################
# Helper Functions
#################################################
op_map = {">=": ge, "<=": le, "!=": ne, "==": eq, ">": gt, "<": lt}


def run_sql_command(
    cols: List[Column],
    filters: List[Tuple[Column, str, int | float | str]] = [],
    groups: List[Column] = [],
    order: List[Column] = [],
    joins: List[Tuple[Column, Column]] = [],
) -> List[Tuple[Any, ...]]:
    """Runs the given SQL command and returns the records as a list of tuples"""
    engine = create_engine("sqlite:///../data/natural_disasters_db.sqlite")
    Base.metadata.create_all(engine)
    session = Session(bind=engine)
    query = session.query(*cols)
    if filters:
        for col, op, val in filters:
            query = query.filter(op_map[op](col, val))
    if joins:
        for col1, col2 in joins:
            query = query.filter(col1 == col2)
    if groups:
        query = query.group_by(*groups)
    if order:
        query = query.order_by(*order)
    records = query.all()
    session.close()
    return [tuple(record) for record in records]


def make_json_response(content) -> Response:
    """Turns a piece of content into a json Response with CORS"""
    response = jsonify(content)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


#################################################
# Map stuff
#################################################


@app.route("/api/v1.0/fips-to-state")
def fips_to_state() -> Response:
    return make_json_response(FIPS_TO_STATE)


@app.route("/api/v1.0/geojson-counties-fips")
def geojson_counties_fips() -> Response:
    return make_json_response(GEOJSON_COUNTIES_FIPS)


@app.route("/api/v1.0/geojson-counties")
def geojson_counties() -> Response:
    return make_json_response(GEOJSON_COUNTIES)


if __name__ == "__main__":
    app.run(debug=True)
