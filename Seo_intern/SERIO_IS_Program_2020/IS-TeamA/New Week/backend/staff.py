from flask import Flask, render_template, request, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import json
import os


app = Flask(__name__)
client = MongoClient("localhost:27017")
db = client.Reception
CORS(app)


@app.route('/kanri', methods=['GET'])
def get_all_Staff():
    Data = db.Staff
    output = []
    for s in Data.find():
        _id = str(s['_id'])
        output.append({'_id': _id, 'name': s['name']})
    return jsonify({'result': output})


@app.route('/reception', methods=['GET'])
def get_spe_Staff():
    company = request.args.get('work')
    Data = db.Company
    if not Data.find_one({'company':company}):
        company = 'anycompany'
    for s in Data.find({'company':company}):
        output = s['name']
    return jsonify({'name': output})

@app.route('/', methods=['POST'])
def add_Staff():
    Data = db.Staff
    output = []
    data = request.get_json(force=True)
    name = data.get('name', None)
    Data.insert({'name': name})
    # Insert後再検索をかける
    for s in Data.find():
        _id = str(s['_id'])
        output.append({'_id': _id, 'name': s['name']})
    return jsonify({'result': output})

@app.route('/', methods=['PUT'])
def update_staff():
    Data = db.Staff
    output = []
    data = request.get_json(force=True)
    _id = data.get('id', None)
    name = data.get('name', None)
    Data.update({'_id':ObjectId(_id)},{'$set':{'name': name}}, upsert = False)
    # Update後再検索をかける
    for s in Data.find():
        _id = str(s['_id'])
        output.append({'_id': _id, 'name': s['name']})
    return jsonify({'result': output})

@app.route('/', methods=['DELETE'])
def delete_staff():
    Data = db.Staff
    output = []
    data = request.get_json(force=True)
    _id = data.get('id', None)
    Data.delete_one({'_id':ObjectId(_id)})
    # Delete後再検索をかける
    for s in Data.find():
        _id = str(s['_id'])
        if s['name'] != None:
            output.append({'_id': _id, 'name': s['name']})
    return jsonify({'result': output})

@app.route('/comer', methods=['POST'])
def add_Comer():
    Data = db.Comers
    data = request.get_json(force=True)
    output = []
    staff = data.get('name', None)
    company = data.get('work', None)
    name = data.get('heisya', None)
    Data.insert({'name': name, 'company': company, 'staff': staff, 'date': datetime.now()})
    #for s in Data.find():
    #    _id = str(s['_id'])
    #    output.append({'_id': _id, 'name': s['name'], 'company': s['company'], 'staff': s['staff'], 'date': s['date']})
    return jsonify({'result': output})





if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)



