from flask import Flask, render_template, request, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import locale
import json
import os


app = Flask(__name__)
client = MongoClient("localhost:27017")
db = client.Reservation
CORS(app)

locale.setlocale(locale.LC_CTYPE, "Japanese_Japan.932")

Data = db.ResData
output1 = []
for s in Data.find():
    output1.append(s['resid'])
max_value = int(max(output1))

class AddNewResid:
    def __init__(self,start):
        self.x = start
    def call(self):
        self.x += 1
        return self.x
NewResid = AddNewResid(max_value)



@app.route('/reserve', methods=['POST'])
def add_reserve():
    Data = db.ResData
    data = request.get_json(force=True)
    staff = data.get('name', None)
    company = data.get('work', None)
    name = data.get('heisya', None)
#    days = data.get('days', None)
    days_default = data.get('days', None)
    days = datetime.strptime(days_default, '%Y-%m-%dT%H:%M')
    Checked = None
    resid_default = NewResid.call()
    resid = str(resid_default).zfill(6)
    Data.insert({'name': name, 'company': company, 'staff': staff, 'days': days, 'resid': resid, 'edit_date': datetime.now(), 'Checked': Checked})
    for s in Data.find({'resid': resid}):
        output = s['resid']
    return jsonify({'resid': output})

@app.route('/reskanri', methods=['GET'])
def get_all_Reservation():
    Data = db.ResData
    output = []
    for s in Data.find():
        days_coming = (s['days'].strftime('%Y年%m月%d日 %H時%M分'))
        edit_time = (s['edit_date'].strftime('%Y年%m月%d日 %H時%M分'))
        output.append({'name': s['name'], 'company': s['company'], 'staff': s['staff'], 'days': days_coming, 'resid': s['resid'], 'edit_date': edit_time, 'Checked': s['Checked']})
    return jsonify({'result': output})



if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5002)