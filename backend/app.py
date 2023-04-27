from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/v1/',  methods=['GET'])
def welcome():
    return jsonify({'msg': 'Welcome to the SchemaPriming backend API!'})

