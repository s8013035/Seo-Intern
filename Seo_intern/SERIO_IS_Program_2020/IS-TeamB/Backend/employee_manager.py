from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient

from bson.objectid import ObjectId


# 以下三行はパス関連のおまじない
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# 自作関数のimport
from util import to_roman, get_output_json

app = Flask(__name__)
client = MongoClient("localhost:27017")
db = client.IS_B
CORS(app)

employee_port = 5000

void_check_list = ["slack_email", "charging_company"]

# データ取得時に使用
@app.route('/', methods = ["GET"])
def get_all_employee():

    return get_output_json(db.Employee.find(), void_check_list)

# データ追加時に使用
@app.route('/', methods = ['POST'])
def add_employee():

    Data = db.Employee

    data = request.get_json(force = True)
    name = data.get("name", None)
    mail = data.get('slack_email', None)

    insert_dict = {"name": name, "charging_company": []}

    # アドレスが"void"でなければ登録情報にemailを追加
    if mail != "void":
        insert_dict["slack_email"] = mail

    Data.insert_one(insert_dict)
    
    return get_output_json(Data.find(), void_check_list)

# データ更新時に使用
@app.route('/', methods = ['PUT'])
def update_employee():

    Data = db.Employee

    data = request.get_json(force = True)
    _id = data.get('update_id', None)
    name = data.get('update_name', None)

    # 更新する情報をupdate_dictに代入
    update_dict = {'name': name}

    # アドレスが"void"でなければ更新情報にemailを追加
    mail = data.get("update_slack_email", None)
    if mail != "void":
        update_dict["slack_email"] = mail

    Data.update({'_id': ObjectId(_id)}, {'$set': update_dict}, upsert = False)

    return get_output_json(Data.find(), void_check_list)

# データ削除時に使用
@app.route('/', methods = ["DELETE"])
def delete_employee():

    Data = db.Employee

    data = request.get_json(force = True)
    _id = data.get("delete_id", None)
    Data.delete_one({"_id": ObjectId(_id)})

    return get_output_json(Data.find(), void_check_list)

# 担当会社登録時に使用
@app.route("/set_company", methods = ["PUT"])
def update_charging_company():

    Data = db.Employee

    data = request.get_json(force = True)
    _id = data.get("update_id", None)

    company_set = []
    company_set.append(data.get("company", None))

    # すでに担当会社がいた場合は追加にする
    query_doc = Data.find_one(filter = {"_id": ObjectId(_id)})

    if query_doc["charging_company"] != []:
        company_set += query_doc["charging_company"]
    
    Data.update_one({'_id': ObjectId(_id)}, {'$set':{'charging_company': company_set}}, upsert = False)

    return get_output_json(Data.find(), void_check_list)

# 担当者出力時に使用
@app.route("/get_charging_employee", methods = ["GET"])
def search_charging_employee():

    Data = db.Employee

    cmp_query = request.args.get("company_query")
    charging_list = Data.find(filter = {"$or" :[{"charging_company": cmp_query}, {"charging_company": []}]})

    return get_output_json(charging_list, void_check_list)

#  担当者と訪問者の名前をローマ字に変更   
@app.route('/converter', methods = ["GET"])
def convert_to_roman():
    
    fname = request.args.get("fname", None)
    sname = request.args.get("sname", None)

    roman_fname, roman_sname = to_roman([fname, sname])

    return jsonify({'result': {"fname": roman_fname, "sname":roman_sname}})

if __name__== "__main__":
    app.debug = True
    app.run(host = '0.0.0.0', port = employee_port)