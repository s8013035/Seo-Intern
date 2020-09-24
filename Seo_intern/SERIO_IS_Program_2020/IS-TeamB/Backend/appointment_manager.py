from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient

from bson.objectid import ObjectId

# 以下三行はパス関連のおまじない
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# 自作関数のimport
from util import get_output_json, get_registration_id

# ポート番号の設定
appointment_port = 5002
# 中身が空になり得る要素の指定
void_check_list = ["name"]

app = Flask(__name__)
client = MongoClient("localhost:27017")
db = client.IS_B
CORS(app)

# データ取得時に使用
@app.route('/', methods = ["GET"])
def get_all_registration():

    return get_output_json(db.Appointment.find(), void_check_list)

# 予約情報追加時に使用
@app.route('/', methods = ["POST"])
def add_registration():

    Data = db.Appointment

    data = request.get_json(force = True)
    reg_date = data.get("date", None)
    reg_time = data.get("time", None)
    company = data.get("company", None)
    visitor = data.get('visitor_name', None)

    reg_id = get_registration_id(Data.find())

    insert_reg_data = {"appointment_id": reg_id, "date": reg_date, "time": reg_time, "company": company, "visitor": visitor, "is_reserved": '未'}

    member_id = data.get("member_id", None)
    if member_id != "someone":
        Data_emp = db.Employee
        name = Data_emp.find_one({"_id": ObjectId(member_id)})["name"]
        insert_reg_data["name"] = name
        insert_reg_data["name_id"] = member_id

    Data.insert_one(insert_reg_data)

    return jsonify({"result": [{"appointment_id": reg_id}]})

# 受付番号で予約情報出力時に使用
@app.route("/get_appointment", methods = ["GET"])
def id_search_charging_employee():

    Data = db.Appointment

    id_query = request.args.get("id_query", None)
    appointment_info = Data.find(filter = {"appointment_id": id_query})
    reserved = list(map(lambda f: f["is_reserved"], appointment_info))

    if (len(reserved) == 0):
        return jsonify({"result": "undefined"})

    if (reserved[0] == '済'):
        return jsonify({"result": "reserved"})

    return get_output_json(Data.find(filter = {"appointment_id": id_query}),void_check_list)

# 予約情報更新時に使用
@app.route("/", methods = ["PUT"])
def update_registration_info():

    Data = db.Appointment

    data = request.get_json(force = True)

    update_contents = []
    update_contents.append(data.get("date", None))
    update_contents.append(data.get("time", None)) 
    update_contents.append(data.get("company", None)) 
    update_contents.append(data.get("visitor_name", None)) 

    update_dict = {}
    keys = ["date", "time", "company", "visitor"]

    for k in keys:
        elem = data.get(k, None)
        if len(elem) != 0:
            update_dict[k] = elem

    _id = data.get("_id", None)

    Data.update_one({"_id": ObjectId(_id)}, {"$set": update_dict}, upsert = False)

    return get_output_json(Data.find(), void_check_list)


# 予約日時で予約情報出力時に使用
@app.route("/search_appointment", methods = ["GET"])
def date_earch_charging_employee():

    Data = db.Appointment

    date_query = request.args.get("date_query", None)

    if len(date_query) == 0:
        return get_output_json(Data.find(), void_check_list)
    appointment_info = Data.find(filter = {"date": date_query})

    return get_output_json(appointment_info, void_check_list)

if __name__== "__main__":
    app.debug = True
    app.run(host = '0.0.0.0', port = appointment_port)
