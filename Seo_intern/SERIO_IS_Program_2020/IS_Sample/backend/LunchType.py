from flask import Flask, render_template, request, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import json
import os


app = Flask(__name__)
client = MongoClient("localhost:27017")
db = client.Lunch
CORS(app)


@app.route('/', methods=['GET'])
def get_all_Lunch():
    Data = db.LunchType
    output = []
    for s in Data.find():
        _id = str(s['_id'])
        output.append({'_id': _id, 'name': s['name'], 'price': s['price']})
    return jsonify({'result': output})


@app.route('/', methods=['POST'])
def add_Lunch():
    Data = db.LunchType
    output = []
    data = request.get_json(force=True)
    name = data.get('name', None)
    price = data.get('price', None)
    Data.insert({'name': name, 'price': price})
    # Insert後再検索をかける
    for s in Data.find():
        _id = str(s['_id'])
        output.append({'_id': _id, 'name': s['name'], 'price': s['price']})
    return jsonify({'result': output})


@app.route('/', methods=['PUT'])
def update_Lunch():
    Data = db.LunchType
    output = []
    data = request.get_json(force=True)
    _id = data.get('id', None)
    name = data.get('name', None)
    price = data.get('price', None)
    Data.update({'_id':ObjectId(_id)},{'$set':{'name': name,'price': price}}, upsert = False)
    # Update後再検索をかける
    for s in Data.find():
        _id = str(s['_id'])
        output.append({'_id': _id, 'name': s['name'], 'price': s['price']})
    return jsonify({'result': output})


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
