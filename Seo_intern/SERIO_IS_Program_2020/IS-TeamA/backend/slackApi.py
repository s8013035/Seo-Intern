import os
from slack import WebClient
from slack.errors import SlackApiError
from flask import Flask, render_template, request, jsonify, Response
from flask_cors import CORS
from bson.objectid import ObjectId
import json
import requests

app = Flask(__name__)
#db = client.teamA
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
    
    component = {} 

    component["name"] = name
    component["work"] = work
    component["heisya"] = heisya 

    slack = SlackDriver()
    slack.default_message(component) 

    return jsonify()

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







if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5001)
  