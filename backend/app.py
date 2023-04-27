import json
import yaml
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from pykwalify.core import Core, SchemaError

app = Flask(__name__)
CORS(app)


@app.route("/v1/", methods=["GET"])
def welcome():
    return jsonify({"msg": "Welcome to the SchemaPriming backend API!"})


@app.route("/v1/schema-and-empty", methods=["GET"])
def schema_and_empty():
    return jsonify({"schema": schema_text, "empty": empty_object})


@app.route("/v1/validate", methods=["POST"])
def validate():
    o = json.loads(request.data)
    c = Core(source_data=o, schema_data=schema_obj)
    response_obj = {}
    try:
        c.validate(raise_exception=True)
        response_obj = {'success': True}
    except SchemaError as se:
        response_obj = {'success': False, 'msg': se.msg}

    return make_response(jsonify(response_obj), 200)


empty_object = {
    "wrangling": [{"name": "nop"}],
    "analysis": [{"name": "nop"}],
    "visualization": [{"name": "nop"}],
}

schema_text = """map:
 wrangling:
  desc: "Data Wrangling"
  required: True
  seq:
  - map:
     name:
      type: str
      pattern: filter-data
      required: True
      desc: "Function for filterings data, e.g., pollutant = 'PM2.5' and months-back = 12 to filter the dataset to only include PM2.5 data from the last year."
     pollutant:
      type: str
      required: True
      desc: "The air pollutant, e.g., fine particulate matter concentration"
      example: "PM2.5"
     months-back:
      type: int
      required: False
      desc: "Number of month back to include"
      example: "12"
  - map:
     name:
      type: str
      pattern: aggregate-data
      required: True
     aggregation-level:
      type: str
      required: True
      example: "city"
     aggregation-function:
      type: str
      required: False
      example: "mean"
  - map:
     name:
      type: str
      pattern: nop
      required: True
      desc: "Empty placeholder function not doing anything"
 analysis:
  desc: "Data Analysis"
  required: True
  seq:
  - map:
     name:
      type: str
      pattern: trend-analysis
      required: True
     time-unit:
      type: str
      required: True
      example: "month"
     smoothing:
      type: str
      required: False
      example: "moving-average"
  - map:
     name:
      type: str
      pattern: seasonal-decomposition
      required: True
     frequency:
      type: int
      required: True
      desc: "e.g., 12 for monthly seasonality"
      example: "12"
     decomposition-method:
      type: str
      required: False
      example: "additive"
  - map:
     name:
      type: str
      pattern: nop
      required: True
      desc: "Empty placeholder function not doing anything"
 visualization:
  desc: "Data Visualization"
  required: True
  seq:
   - map:
      name:
       type: str
       pattern: line-chart
       required: True
      x-axis:
       type: str
       required: True
       example: "time"
      y-axis-label:
       type: str
       required: False
       example: "PM2.5 Concentration"
   - map:
      name:
       type: str
       pattern: heatmap
       required: True
      color-scale:
       type: str
       required: True
       example: "Reds"
      annotation:
       type: bool
       required: False
       desc: "A boolean value, e.g., True for displaying values"
       example: "True"
   - map:
      name:
       type: str
       pattern: nop
       required: True
       desc: "Empty placeholder function not doing anything"
required: True"""

schema_obj = yaml.safe_load(schema_text)
