from flask import Flask, render_template, request, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import json
import os

app = Flask(__name__)
client = MongoClient("localhost:27017")
db = client.AdminID
CORS(app)
Data = db.Account

@app.route('/signup', methods=['POST'])
def add_admin():
    data = request.get_json(force=True)
    Userid = data.get('userid', None)
    Userpw = data.get('userpw', None)
    if Data.insert({'userid': Userid, 'userpw': Userpw})
        message = '登録完了しました'
        return jsonify({'result': message})

@app.route('/login', methods=['GET'])
def add_admin():
    data = request.get_json(force=True)
    Userid = request.args.get('userid')
    Userpw = request.args.get('userpw')
    if not Data.find_one({'userid':Userid}):
        error = 'ユーさー名は存在しません'
    if Data.insert({'userid': Userid, 'userpw': Userpw})
        message = '登録完了しました'
        return jsonify({'result': message})





if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5003)
