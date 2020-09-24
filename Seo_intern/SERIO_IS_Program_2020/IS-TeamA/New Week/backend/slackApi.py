import os
from slack import WebClient
from slack.errors import SlackApiError
from flask import Flask, render_template, request, jsonify, Response
from flask_cors import CORS
from bson.objectid import ObjectId
from pymongo import MongoClient
from datetime import datetime
import json
import requests


app = Flask(__name__)
client = MongoClient("localhost:27017")
db = client.Reservation
CORS(app)


class SlackDriver:
    def __init__(self):
        self._token = 'xoxb-1310986864676-1335936294417-K9VkBRmbjLPreAKMOkEnwCzo'  # api_token
        self._headers = {'Content-Type': 'application/json'}

    def default_message(self, cmp):
 
        params = {"token": self._token, "channel":'C01A4SPGK1P', "text": "%sさん、%sの%sさんが来られました。" %(cmp["name"], cmp["work"], cmp["heisya"])}
        requests.post('https://slack.com/api/chat.postMessage',
                          headers=self._headers,
                          params=params)

    def specific_message(self, cmp):
 
        params = {"token": self._token, "channel":'C01A4SPGK1P', "text": "%sの%sさんが来られました。" %(cmp["work"], cmp["heisya"])}
        requests.post('https://slack.com/api/chat.postMessage',
                          headers=self._headers,
                          params=params)

 
@app.route('/def_call', methods = ['POST'])
def add_Staff_default():
  
    data = request.get_json(force=True)

    name = data.get('name', None)
    work = data.get('work', None)
    heisya = data.get('heisya', None)
    convname = []
# for Debug:
#    name = '誰なの123.?>!"'
#    work = '三菱UFJ'
#    heisya = '誰なんだろう'

    component = {} 
    component["name"] = name
    component["work"] = work
    component["heisya"] = heisya 

    slack = SlackDriver()
    
    slack.default_message(component) 
    
    from pykakasi import kakasi
    kakasi = kakasi()
    kakasi.setMode("H", "a")
    kakasi.setMode("K", "a") 
    kakasi.setMode("J", "a")  
    kakasi.setMode("r", "Hepburn") 
    conv = kakasi.getConverter()
    staff_co = conv.do(name)
    name_co = conv.do(heisya)

    convname.append({'staff': staff_co, 'name': name_co})
    return jsonify({'result': convname})

@app.route('/spe_call', methods = ['POST'])
def add_Staff_specific():
  
    data = request.get_json(force=True)

    heisya = data.get('heisya', None)
    work = data.get('work', None)
   
    component = {} 

    component["heisya"] = heisya
    component["work"] = work
    
    slack = SlackDriver()
    slack.specific_message(component) 
        
    return jsonify()

@app.route('/res_call', methods = ['GET'])
def call_Staff_reserved():
    Data = db.ResData
    resid = request.args.get('number')
    #resid = '000015' for debug
    output = ""
    component = {} 
    datenow_default = datetime.now()
    dat_moji = '現在時刻：'
    dat_fac = (datenow_default.strftime('%Y年%m月%d日 %H時%M分'))
    datenow = (dat_moji + dat_fac)
    Checked = '〇'
    if not Data.find_one({'resid':resid}):
        error = '　　　　　　　　　　　受付番号が存在しません。'
        return jsonify({'result': error})
    if Data.find_one({'Checked': Checked,'resid':resid}):
        error = '　　　　　　　　　　　　既に受付済みです。'
        return jsonify({'result': error})
    for s in Data.find({'resid':resid}): 
        error = 'null'
        com_moji = '来訪者会社名：'
        com_fac = s['company']
        company = (com_moji + com_fac)
        nam_moji = '来訪者氏名：'
        nam_fac = s['name']
        name = (nam_moji + nam_fac)
        sta_moji = '担当者：'
        sta_fac = s['staff']
        staff = (sta_moji + sta_fac)
        component["work"] = com_fac
        component["heisya"] = nam_fac
        component["name"] = sta_fac

        slack = SlackDriver()
        slack.default_message(component)
        Data.find_one_and_update({'resid':resid}, {'$set': {'Checked':Checked}})

        output = {'datenow': datenow, 'company': company, 'name': name, 'staff': staff, 'error': error}
        return jsonify({'result': output})

    






if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5001)
  