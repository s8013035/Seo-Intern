import requests
import os
import json

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId

from slack import WebClient

from datetime import datetime, timedelta, timezone

app = Flask(__name__)
client = MongoClient("localhost:27017")
db = client.IS_B
CORS(app)

slack_port = 5001

# Slack通知送信用のクラス
# 使用目的：メッセージ送信&email情報からIDに紐づけ
class slack_sender:

    def __init__(self):

        self.token = 'xoxb-1310986864676-1329762983700-sXl6Ad3trRKcPstZ9b5OjtAm'
        self.head = {'Content-Type': 'application/json'}

        self.params = {"token": self.token, "channel": "#team-b-slack通知"}

        self.phrase = self.get_fixed_phrase()

    def get_fixed_phrase(self):
        
        current_dir = os.path.dirname(__file__)
        fp = open(current_dir + "/phrase.json", 'r', encoding = "utf-8_sig")

        return json.load(fp, strict = False)

    def search_slackid(self, slackmail):

        client = WebClient(token = self.token)
        response = client.users_list()

        return list((filter(lambda x : x["name"] == slackmail, response["members"])))[0]["id"]

    def send_notification(self, contents):

        if ("name" in contents):
            message = contents["name"] + self.phrase["after_member"] + self.phrase["before_company"] + contents["company"] + self.phrase["after_company"] + contents["visitor"] + self.phrase["after_visitor"]
            if ("slack_id" in contents):
                message = "<@" + contents["slack_id"] + ">\n" + message
        else:
            message = self.phrase["before_company"] + contents["company"] + self.phrase["after_company"] + contents["visitor"] + self.phrase["after_visitor"]
        
        self.params["text"] = message

        # return self.params["text"]

        requests.post('https://slack.com/api/chat.postMessage',
        headers = self.head, params = self.params)

# 従業員IDから指名を検索
def search_employee(id):

    Data = db.Employee
    employee = Data.find_one({"_id": ObjectId(id)})

    return employee["name"]

# 従業員IDからSlackのメールアドレスを検索
def search_slackmail(id):

    Data = db.Employee
    employee = Data.find_one({"_id": ObjectId(id)})

    if not("slack_email" in employee):
        return []

    return employee["slack_email"]

# メッセージ送信後に呼び出し情報をDBに登録
def set_call_archive(contents):

    archive = db.CallArchive

    now = datetime.now(timezone(timedelta(hours = +9)))
    today = str(now.date())
    time = now.strftime('%H:%M:%S')

    post_info = {"called_date": today, "called_time": time, "company": contents["company"], "visitor": contents["visitor"]}
    if "name" in contents:
        post_info["name"] = contents["name"]

    archive.insert_one(post_info)

@app.route('/', methods = ['PUT'])
def send_message():

    data = request.get_json(force = True)
    member_id = data.get("member_id", None)

    sender = slack_sender()
    contents = {}

    if  member_id != "someone":
        slack_mail = search_slackmail(member_id)
        if slack_mail != []:
            slack_id = sender.search_slackid(slack_mail[:slack_mail.index("@")])
            contents["slack_id"] = slack_id

        contents["name"] = search_employee(member_id)

    contents["company"] = data.get("company", None)
    contents["visitor"] = data.get("visitor_name", None)
  
    set_call_archive(contents)
    # return sender.send_notification(contents)

    sender.send_notification(contents)

    return jsonify()

@app.route('/from_reservation', methods = ['PUT'])
def send_message_from_res():
           
    app_data = db.Appointment
   
    data = request.get_json(force = True)
    app_id = data.get("id_query", None)

    app_info = app_data.find_one({"appointment_id": app_id})

    sender = slack_sender()
    contents = {}

    if  "name" in app_info:
        _id = app_info["name_id"]
        slack_mail = search_slackmail(_id)
        if slack_mail != "":
            slack_id = sender.search_slackid(slack_mail[:slack_mail.index("@")])
            contents["slack_id"] = slack_id

        contents["name"] = search_employee(_id)

    contents["company"] = app_info["company"]
    contents["visitor"] = app_info["visitor"]
  
    # return sender.send_notification(contents)

    sender.send_notification(contents)

    app_data.update_one({'appointment_id': app_id}, {'$set':{'is_reserved': "済"}}, upsert = False)
    return jsonify()

if __name__== "__main__":
    app.debug = True
    app.run(host = '0.0.0.0', port = slack_port)
